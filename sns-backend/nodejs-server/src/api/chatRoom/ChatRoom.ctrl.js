import Chat from "../../schemas/chat";
import Room from "../../schemas/room";
import User from "../../schemas/user";

export const roomList = async (req, res, next) => {
  try {
    const findRooms = await Room.find({
    //   "user":{
    //     $elemMatch: {"nick": "지나가율" } // auther배열객체 들 중에서 {"name":"park"} 검색.
    //  }
    });

    res.json(findRooms);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const enterRoom = async (req, res, next) => {
  try {
    let room = await Room.find({users: {$all: [req.query.mno1, req.query.mno2]}})
    if (!room) {
      room = await Room.create({
            users : [req.query.mno1, req.query.mno2],
          });
          const io = req.app.get("io");
          io.of("/room").emit("newRoom", room);
    };
    res.json(room);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const removeRoom = async (req, res, next) => {
  try {
    await Room.deleteOne ({ _id: req.params.id });
    await Chat.deleteMany ({ room: req.params.id });
    res.send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const sendChat = async (req, res, next) => {
  try {
    const roomId = req.params.roomId;
    const chat = await Chat.create({
      Room: roomId,
      User: req.state.user,
      chat: req.body.chatTxt,
      img: req.body.imgUrl,
    });
    req.app.get("io").of("/chat").to(roomId).emit("chat", { chat });
    res.json(chat);
  } catch (error) {
    console.error(error);
    next(error);
  }
};