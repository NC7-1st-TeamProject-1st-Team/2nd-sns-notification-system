import qs from 'qs';
import nodeClient from './nodeClient';

export const roomList = (mno) => {
  return nodeClient.get(`chatRoom/room/${mno}`);
};

export const createRoom = ({ mno1, mno2 }) => {
  const queryString = qs.stringify({
    mno1,
    mno2,
  });
  return nodeClient.post(`chatRoom/room?${queryString}`);
};

export const enterRoom = ({ mno1, mno2, roomId, limit = 25 }) => {
  const queryString = qs.stringify({
    mno1,
    mno2,
    roomId,
    limit,
    page: 1,
  });
  return nodeClient.get(`chatRoom/enterRoom?${queryString}`);
};

export const loadBeforeChats = ({ roomId, mno1, mno2, limit = 25, page }) => {
  const queryString = qs.stringify({
    roomId,
    mno1,
    mno2,
    limit,
    page,
  });
  return nodeClient.get(`chatRoom/loadBeforeChats?${queryString}`);
};

export const leaveRoom = ({ roomId }) => {
  return nodeClient.post(`chatRoom/room/${roomId}/leave`);
};

// 채팅 전송
export const sendChat = ({ roomId, chatTxt, files, user }) => {
  return nodeClient.post(`chatRoom/room/${roomId}/chat`, {
    chatTxt,
    files,
    user,
  });
};
