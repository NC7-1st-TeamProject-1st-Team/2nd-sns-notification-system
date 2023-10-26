import express from 'express';
import * as chatCtrl from './ChatRoom.ctrl';

const chatRoom = express.Router();

chatRoom.get('/room/:mno', chatCtrl.roomList);

// chatRoom.post("/room", chatCtrl.createRoom);

chatRoom.get('/loadBeforeChats', chatCtrl.loadBeforeChats);

chatRoom.get('/enterRoom', chatCtrl.enterRoom);

chatRoom.post('/room/:roomId/leave', chatCtrl.leaveRoom);

// chatRoom.delete('/room/:roomId', chatCtrl.removeRoom);

chatRoom.post('/room/:roomId/chat', chatCtrl.sendChat);

export default chatRoom;
