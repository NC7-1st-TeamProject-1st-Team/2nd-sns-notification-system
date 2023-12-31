import mongoose from 'mongoose';
import Chat from './chat';
import Room from './room';
import User from './user';
import Noti from './noti';
import insertTestData from './data'; // data.js 파일을 가져옴

const mongodbConnect = () => {
  const { NODE_ENV, MONGO_URI, MONGODB_USER, MONGODB_PASS } = process.env;

  console.log('MONGODB연결 시작');
  const MONGO_URL = `mongodb://${MONGODB_USER}:${MONGODB_PASS}@${MONGO_URI}?directConnection=true`;
  if (NODE_ENV !== 'production') {
    mongoose.set('debug', true);
  }
  mongoose
    .connect(MONGO_URL, {
      dbName: 'sns-tp',
      useNewUrlParser: true,
    })
    .then(() => {
      console.log('MongoDB 연결성공');
    })
    .catch((err) => {
      console.error('@mongoDB 연결 에러발생@', err);
    });
};

mongoose.connection.on('error', (error) => {
  console.error('몽고디비 연결 에러', error);
});
mongoose.connection.on('disconnected', () => {
  console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
  mongodbConnect();
});

// 테스트 데이터 삽입 함수 실행
// insertTestData();

export default mongodbConnect;
