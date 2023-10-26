import express from 'express';
import * as userCtrl from './user.ctrl';

const user = express.Router();

user.get('/test', userCtrl.test);
user.post('/add', userCtrl.addUser);
user.post('/update', userCtrl.updateUser);

export default user;
