import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import * as chatsAPI from '../lib/api/chats';
// import { useCookies } from 'react-cookie';

const CHANGE_FIELD = 'auth/CHANGE_FIELD';
const [ENTER_ROOM, ENTER_ROOM_SUCCESS, ENTER_ROOM_FAILURE] =
  createRequestActionTypes('chats/ENTER_ROOM');
const [
  LOAD_BEFORE_CHATS,
  LOAD_BEFORE_CHATS_SUCCESS,
  LOAD_BEFORE_CHATS_FAILURE,
] = createRequestActionTypes('chats/LOAD_BEFORE_CHATS');

const CONCAT_CHATS = 'chats/CONCAT_CHATS';
const [SEND_CHAT, SEND_CHAT_SUCCESS, SEND_CHAT_FAILURE] =
  createRequestActionTypes('chats/SEND_CHAT');

const TRANSLATE_CHAT = 'chats/TRANSLATE_CHAT';

export const changeField = createAction(CHANGE_FIELD, ({ key, value }) => ({
  key,
  value,
}));
export const enterRoom = createAction(ENTER_ROOM, ({ mno1, mno2, roomId }) => ({
  mno1,
  mno2,
  roomId,
}));
export const loadBeforeChats = createAction(
  LOAD_BEFORE_CHATS,
  ({ roomId, mno1, mno2, page }) => ({
    roomId,
    mno1,
    mno2,
    page,
  })
);

export const sendChat = createAction(
  SEND_CHAT,
  ({ roomId, mno1, mno2, page }) => ({
    roomId,
    mno1,
    mno2,
    page,
  })
);

export const concatChats = createAction(CONCAT_CHATS, ({ newChat }) => ({
  newChat,
}));

export const translateChat = createAction(
  TRANSLATE_CHAT,
  ({ translatedChatLog }) => ({
    translatedChatLog,
  })
);

const enterRoomSaga = createRequestSaga(ENTER_ROOM, chatsAPI.enterRoom);
const sendChatSaga = createRequestSaga(SEND_CHAT, chatsAPI.sendChat);
const loadBeforeChatsSaga = createRequestSaga(
  LOAD_BEFORE_CHATS,
  chatsAPI.loadBeforeChats
);

export function* chatsSaga() {
  yield takeLatest(ENTER_ROOM, enterRoomSaga);
  // yield takeLatest(SEND_CHAT, sendChatSaga);
  yield takeLatest(LOAD_BEFORE_CHATS, loadBeforeChatsSaga);
}

const initialState = {
  room: null,
  chats: null,
  nextPage: 2,
  chatTxt: '',
  error: null,
  newChat: null,
};

const chats = handleActions(
  {
    [CHANGE_FIELD]: (state, { payload: { key, value } }) => ({
      ...state,
      [key]: value,
    }),
    [ENTER_ROOM_SUCCESS]: (
      state,
      { payload: { room, chats }, meta: response }
    ) => ({
      ...state,
      room: room,
      chats: chats,
      newChat: new Date(),
      nextPage: 2,
      error: null,
    }),
    [ENTER_ROOM_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error,
    }),
    [LOAD_BEFORE_CHATS_SUCCESS]: (
      state,
      { payload: { beforeChats, nextPage }, meta: response }
    ) => ({
      ...state,
      chats: beforeChats.concat(state.chats),
      nextPage,
      error: null,
    }),
    [CONCAT_CHATS]: (state, { payload: { newChat } }) => ({
      ...state,
      chats: [...state.chats, newChat],
      newChat,
    }),
    [SEND_CHAT]: (state, { payload: { newChat } }) => ({
      ...state,
      chatTxt: '',
      error: null,
    }),
    [SEND_CHAT_SUCCESS]: (state, { payload: { newChat } }) => ({
      ...state,
      chatTxt: '',
      error: null,
    }),
    [SEND_CHAT_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error,
    }),
    [TRANSLATE_CHAT]: (state, { payload: { translatedChatLog } }) => ({
      ...state,
      chats: state.chats.map((chat) => {
        if (chat._id === translatedChatLog._id) {
          return translatedChatLog;
        } else return chat;
      }),
    }),
  },
  initialState
);

export default chats;
