require('dotenv').config();
import Chat from '../../schemas/chat';
import request from 'request';
import rp from 'request-promise';
import fs from 'fs';
import crypto from 'crypto';
import AWS from 'aws-sdk';

const client_id = process.env.NAVER_PAPAGO_CLIENT_ID;
const client_secret = process.env.NAVER_PAPAGO_CLIENT_SECRET;
const clova_client_id = process.env.NCP_CLOVA_CLIENT_ID;
const clova_client_secret = process.env.NCP_CLOVA_CLIENT_SECRET;
const obj_storage_access_key = process.env.NCP_OBJECT_STORAGE_ACCESS_KEY;
const obj_storage_secret_key = process.env.NCP_OBJECT_STORAGE_SECRET_KEY;

const updateLogToTranslationAndSend = async ({
  chatLog,
  targetLanguage,
  translatedText,
  data,
}) => {
  const clovaVoiceSupportLanguages = ['ko', 'en', 'zh-CN', 'zh-TW', 'ja', 'es'];
  if (clovaVoiceSupportLanguages.includes(targetLanguage)) {
    const reqData = {
      ...data,
      body: {
        chatId: chatLog._id,
        roomId: chatLog.room,
        language: targetLanguage,
        text: translatedText,
      },
    };
    clovaVoiceAPI(reqData);
  } else {
    const translatedChatLog = await Chat.findByIdAndUpdate(
      chatLog._id,
      {
        $set: {
          [`translated.${targetLanguage}`]: translatedText,
        },
      },
      { new: true }
    ).populate('user');
    // 번역이 완료되면 Socket.io를 사용하여 클라이언트에게 결과를 전송
    data.ioOfChat.to(chatLog.room).emit('translateChat', {
      translatedChatLog,
    });
  }
};

export const translateAndDetectLang = async (data) => {
  const chatLog = data.body.chatLog;
  const { chat } = chatLog; // 번역할 텍스트
  // const query = await Chat.findOne({ chat: req.params.chat});

  // 먼저 언어 감지 API를 호출
  const detectApiUrl = 'https://naveropenapi.apigw.ntruss.com/langs/v1/dect';
  const detectOptions = {
    url: detectApiUrl,
    form: { query: chat },
    headers: {
      'X-NCP-APIGW-API-KEY-ID': client_id,
      'X-NCP-APIGW-API-KEY': client_secret,
    },
  };

  request.post(
    detectOptions,
    async function (detectError, detectResponse, detectBody) {
      if (!detectError && detectResponse.statusCode === 200) {
        const langCode = JSON.parse(detectBody).langCode;

        // 언어 감지 결과를 이용해 번역 API를 호출
        const translateApiUrl =
          'https://naveropenapi.apigw.ntruss.com/nmt/v1/translation';

        let targetLanguage = data.body.targetLanguage;

        let isTranslated = false;
        // 불필요한 번역 요청 방지를 위해 검증 로직 추가 필요
        // const findChatLog = await Chat.findById(chatLog._id);
        // if () {
        //   isTranslated = true;
        // }

        if (isTranslated || langCode === targetLanguage) {
          console.log('이미 번역된 언어');
          data.ioOfChat.to(chatLog.room).emit('translateChat', {
            translatedChatLog: '이미 번역된 언어',
          });

          updateLogToTranslationAndSend({
            chatLog,
            targetLanguage,
            translatedText: chat,
            data,
          });
        } else {
          const translateOptions = {
            url: translateApiUrl,
            form: {
              source: langCode,
              target: targetLanguage,
              text: chat,
            },
            headers: {
              'X-NCP-APIGW-API-KEY-ID': client_id,
              'X-NCP-APIGW-API-KEY': client_secret,
            },
          };

          request.post(
            translateOptions,
            async function (translateError, translateResponse, translateBody) {
              if (!translateError && translateResponse.statusCode === 200) {
                const translatedText =
                  JSON.parse(translateBody).message.result.translatedText;

                updateLogToTranslationAndSend({
                  chatLog,
                  targetLanguage,
                  translatedText,
                  data,
                });
              } else {
                console.log('Translation Error:', translateResponse.statusCode);
              }
            }
          );
        }
      } else {
        console.log('Language Detection Error:', detectResponse.statusCode);
      }
    }
  );
};

export const clovaVoiceAPI = async (data) => {
  const { chatId, roomId, language, text } = data.body;
  const api_url = 'https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts';
  let speaker;
  switch (language) {
    case 'ko':
      speaker = 'nara';
      break;
    case 'en':
      speaker = 'danna';
      break;
    case 'zh-CN':
      speaker = 'meimei';
      break;
    case 'ja':
      speaker = 'nnaomi';
      break;
    case 'zh-TW':
      speaker = 'chiahua';
      break;
    case 'es':
      speaker = 'carmen';
      break;
    default:
      console.log('지원하지 않는 언어입니다');
      return;
  }
  const options = {
    url: api_url,
    form: {
      speaker: speaker,
      volume: '0',
      speed: '0',
      pitch: '0',
      text: text,
      format: 'mp3',
    },
    headers: {
      'X-NCP-APIGW-API-KEY-ID': clova_client_id,
      'X-NCP-APIGW-API-KEY': clova_client_secret,
    },
  };
  const fileName = crypto.createHash('sha512').update(text).digest('hex');
  if (!fs.existsSync('clova')) {
    fs.mkdirSync('clova');
  }
  const filePath = `clova/${fileName}.mp3`;
  request.get(
    `https://kr.object.ncloudstorage.com/bitcamp-nc7-bucket-25/clova_voice/${fileName}.mp3`,
    async function (error, response, body) {
      console.log(response.statusCode);
      if (response.statusCode == 404) {
        console.log('objectStorage에 존재하지 않는 파일');
        const writeStream = fs.createWriteStream(filePath);
        const _req = request.post(options).on('response', function (response) {
          console.log(response.statusCode); // 200
          console.log(response.headers['content-type']);
        });
        _req.pipe(writeStream); // file로 출력
        console.log('voice 파일 생성!');
        writeStream.on('finish', async () => {
          await uploadObjectStorage({
            object_name: fileName,
            local_file_path: filePath,
          });

          const translatedChatLog = await Chat.findByIdAndUpdate(
            chatId,
            {
              $set: {
                [`translated.${language}`]: text,
                [`translated.${language}-voice`]: fileName,
              },
            },
            { new: true }
          ).populate('user');

          // 번역이 완료되면 Socket.io를 사용하여 클라이언트에게 결과를 전송
          data.ioOfChat.to(roomId).emit('translateChat', {
            translatedChatLog,
          });

          fs.unlinkSync(filePath, (err) => {
            if (err.code == 'ENOENT') {
              console.log('파일 삭제 Error 발생');
            }
          });
        });
      } else {
        console.log('objectStorage에 존재하는 파일');
        const translatedChatLog = await Chat.findByIdAndUpdate(
          chatId,
          {
            $set: {
              [`translated.${language}`]: text,
              [`translated.${language}-voice`]: fileName,
            },
          },
          { new: true }
        ).populate('user');

        // 번역이 완료되면 Socket.io를 사용하여 클라이언트에게 결과를 전송
        data.ioOfChat.to(roomId).emit('translateChat', {
          translatedChatLog,
        });
      }
    }
  );

  return fileName;
};

export const uploadObjectStorage = async ({ local_file_path, object_name }) => {
  const bucket_name = 'bitcamp-nc7-bucket-25';
  const endpoint = new AWS.Endpoint('https://kr.object.ncloudstorage.com');
  const region = 'kr-standard';

  const S3 = new AWS.S3({
    endpoint: endpoint,
    region: region,
    credentials: {
      accessKeyId: obj_storage_access_key,
      secretAccessKey: obj_storage_secret_key,
    },
  });

  let options = {
    partSize: 5 * 1024 * 1024,
  };

  await S3.upload(
    {
      Bucket: bucket_name,
      Key: 'clova_voice/' + object_name + '.mp3',
      ACL: 'public-read',
      Body: fs.createReadStream(local_file_path),
    },
    options
  ).promise();
};
