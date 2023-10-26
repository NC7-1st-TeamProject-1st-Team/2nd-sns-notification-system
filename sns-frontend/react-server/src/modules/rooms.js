import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import * as chatsAPI from '../lib/api/chats';
import { useCookies } from 'react-cookie';

const [LIST_ROOMS, LIST_ROOMS_SUCCESS, LIST_ROOMS_FAILURE] =
  createRequestActionTypes('chats/LIST_ROOMS');

const CONCAT_ROOMS = 'chats/CONCAT_ROOMS';
// const LEAVE_ROOM = 'chats/LEAVE_ROOM';

const [LEAVE_ROOM, LEAVE_ROOM_SUCCESS, LEAVE_ROOM_FAILURE] =
  createRequestActionTypes('chats/LEAVE_ROOM');

export const roomList = createAction(LIST_ROOMS);

export const concatRooms = createAction(CONCAT_ROOMS, ({ newRoom }) => ({
  newRoom,
}));

export const leaveRoom = createAction(LEAVE_ROOM, ({ roomId }) => ({
  roomId,
}));

const roomListSaga = createRequestSaga(LIST_ROOMS, chatsAPI.roomList);
const leaveRoomSaga = createRequestSaga(LEAVE_ROOM, chatsAPI.leaveRoom);

export function* roomsSaga() {
  yield takeLatest(LIST_ROOMS, roomListSaga);
  yield takeLatest(LEAVE_ROOM, leaveRoomSaga);
}

const initialState = {
  rooms: [],
  roomsStatus: null,
  error: null,
};

const rooms = handleActions(
  {
    [LIST_ROOMS_SUCCESS]: (state, { payload: rooms, meta: response }) => ({
      ...state,
      rooms,
      roomsStatus: null,
      error: null,
    }),
    [LIST_ROOMS_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error,
    }),
    [CONCAT_ROOMS]: (state, { payload: { newRoom } }) => ({
      ...state,
      rooms: [...state.rooms, newRoom],
    }),
    [LEAVE_ROOM_SUCCESS]: (state, { payload: { roomId } }) => ({
      ...state,
      rooms: state.rooms.filter((room) => room._id !== roomId),
      roomsStatus: 'leaveRoom',
    }),
  },
  initialState
);

export default rooms;
