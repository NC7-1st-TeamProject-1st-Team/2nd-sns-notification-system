import { io } from 'socket.io-client';

export const socket = io(`${process.env.REACT_APP_NODE_SERVER_URL}/chat`, {
  path: '/socket.io',
  transports: ['websocket'],
  autoConnect: false,
});
