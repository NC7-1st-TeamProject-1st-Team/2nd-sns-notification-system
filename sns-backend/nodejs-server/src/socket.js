import SocketIO from 'socket.io';
import cookieParser from 'cookie-parser';
import { sendChatBySocket } from './api/chatRoom/ChatRoom.ctrl';
import {
  clovaVoiceAPI,
  translateAndDetectLang,
} from './api/papago/papago.ctrl';
// import Room from './schemas/room';

export default (server, app) => {
  const io = SocketIO(server, {
    cors: {
      origin: ['http://localhost:3000', process.env.REACT_SERVER_URL],
      credentials: true,
    },
    path: '/socket.io',
  });
  app.set('io', io);

  const chat = io.of('/chat');

  chat.on('connection', (socket) => {
    console.log('chat 네임스페이스에 접속');

    try {
      const cookies =
        socket && socket.handshake.headers.cookie
          ? socket.handshake.headers.cookie.split('; ')
          : [];
      const parsedCookies = {};
      for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        parsedCookies[cookieName] = cookieValue;
      }

      socket.on('join', (data) => {
        socket.join(data.roomId);
      });

      socket.on('sendChat', (data) => {
        const reqData = { body: data };
        reqData.cookies = parsedCookies;
        reqData.ioOfChat = chat;
        sendChatBySocket(reqData);
      });

      socket.on('translateChat', (data) => {
        const reqData = { body: data };
        reqData.ioOfChat = chat;
        translateAndDetectLang(reqData);
      });

      socket.on('tts', (data) => {
        const reqData = { body: data };
        reqData.ioOfChat = chat;
        const fileName = clovaVoiceAPI(reqData);
      });

      socket.on('disconnect', async () => {
        console.log('chat 네임스페이스 접속 해제');
        console.log(socket.id, '연결 종료 시 소켓');
      });
    } catch (error) {
      console.log(error);
    }
  });
};
