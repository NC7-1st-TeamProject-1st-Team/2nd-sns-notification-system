import mongoose from 'mongoose';

const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;
const chatSchema = new Schema({
  room: {
    // 채팅방 아이디
    type: ObjectId,
    required: true,
    ref: 'Room',
  },
  user: {
    // 채팅을 한 사람
    type: ObjectId,
    required: true,
    ref: 'User',
  },
  chat: String, // 채팅 내역
  translated: {
    type: Map,
    of: String,
  }, // 번역
  files: String, // 이미지 주소(gif 랑 jpg 등 모두 받을 수 있게 하고 싶음?)
  createdAt: {
    // 채팅 시간
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
