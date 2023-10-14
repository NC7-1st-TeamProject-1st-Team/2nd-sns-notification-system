// import { useNavigate } from 'react-router-dom';
import ChatComponent from '../../components/chat/ChatComponent';
import {
  enterRoom,
  concatChats,
  changeField,
  sendChat,
  translateChat,
} from '../../modules/chats';
import qs from 'qs';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useLocation, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';

const ChatContainer = () => {
  // const params = useParams();
  const dispatch = useDispatch();
  const [targetLanguage, setTargetLanguage] = useState('ko');
  const { room, chats, newChat, chatTxt, error, user, translatedChat } =
    useSelector(({ chats, auth }) => ({
      room: chats.room,
      chats: chats.chats,
      chatTxt: chats.chatTxt,
      error: chats.error,
      user: auth.user,
      translatedChat: chats.translatedChat,
      newChat: chats.newChat,
    }));

  const { search } = useLocation();
  const { mno1, mno2 } = qs.parse(search, { ignoreQueryPrefix: true });

  useEffect(() => {
    dispatch(enterRoom({ mno1, mno2 }));
  }, [mno1, mno2]);

  const onChange = (e) => {
    const { value, name } = e.target;
    dispatch(
      changeField({
        key: name,
        value,
      })
    );
  };

  const socket = io(`${process.env.REACT_APP_NODE_SERVER_URL}/chat`, {
    path: '/socket.io',
    transports: ['websocket'],
  });

  useEffect(() => {
    if (room && !error) {
      socket.connect();

      socket.emit('join', { roomId: room._id });
      // socket.on('join', function (data) {
      //   // 입장
      //   const newChat = data.chat;
      //   dispatch(concatChats({ newChat }));
      // });
      // socket.on('exit', function (data) {
      //   // 퇴장
      //   const newChat = data.chat;
      //   dispatch(concatChats({ newChat }));
      // });
      socket.on('chat', function (data) {
        // 채팅
        const newChat = data.chat;
        dispatch(concatChats({ newChat }));
        if (user.no !== newChat.user.mno) {
          onTranslate(newChat);
        }
      });

      socket.on('translateChat', function (data) {
        // 채팅
        const translatedChatLog = data.translatedChatLog;
        dispatch(translateChat({ translatedChatLog }));
        console.log(translatedChatLog);
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [room]);

  useEffect(() => {
    if (socket) {
    }
  }, [socket]);

  let onSendChat = () => {
    // dispatch(sendChat({ roomId: room._id, chatTxt, user }));
    if (socket) {
      if (chatTxt.length > 0) {
        dispatch(sendChat({ roomId: room._id, chatTxt, user }));
        socket.emit('sendChat', { roomId: room._id, chatTxt });
      }
    }
  };

  let onTranslate = (chatLog) => {
    // console.log(chatLog);
    const req = {};
    req.targetLanguage = targetLanguage;
    req.chatLog = chatLog;
    if (socket) {
      socket.emit('translateChat', req);
    }
  };

  return (
    <ChatComponent
      room={room}
      chats={chats}
      newChat={newChat}
      user={user}
      chatTxt={chatTxt}
      translatedChat={translatedChat}
      error={error}
      onChange={onChange}
      onSendChat={onSendChat}
      onTranslate={onTranslate}
      targetLanguage={targetLanguage}
      setTargetLanguage={setTargetLanguage}
    />
  );
};

export default ChatContainer;
