// import Room from "../schemas/room";
// import Chat from "../schemas/chat";

// export const removeRoom = async (room) => {
//   try {
//     await Promise.all([
//       Room.deleteOne({ _id: room }),
//       Chat.deleteMany({ Room: room }),
//     ]);
//   } catch (error) {
//     console.log(error);
//   }
// }
