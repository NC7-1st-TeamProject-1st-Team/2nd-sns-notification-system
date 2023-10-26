import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import * as authAPI from '../lib/api/auth';
import * as myPageAPI from '../lib/api/myPage';
import * as boardAPI from '../lib/api/board';
import * as guestBookAPI from '../lib/api/guestBook';
import { useCookies } from 'react-cookie';

const CHANGE_FIELD = 'auth/CHANGE_FIELD';
const INITIALIZE_FORM = 'auth/INITIALIZE_FORM';

const [REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE] =
  createRequestActionTypes('auth/REGISTER');
const [GET_AUTH_CODE, GET_AUTH_CODE_SUCCESS, GET_AUTH_CODE_FAILURE] =
  createRequestActionTypes('auth/GET_AUTH_CODE');
const [CHECK_AUTH_CODE, CHECK_AUTH_CODE_SUCCESS, CHECK_AUTH_CODE_FAILURE] =
  createRequestActionTypes('auth/CHECK_AUTH_CODE');
const [RESET_PASSWORD, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAILURE] =
  createRequestActionTypes('auth/RESET_PASSWORD');

const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] =
  createRequestActionTypes('auth/LOGIN');

const [CHECK, CHECK_SUCCESS, CHECK_FAILURE] =
  createRequestActionTypes('auth/CHECK');

const [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAILURE] =
  createRequestActionTypes('auth/LOGOUT');

const [FOLLOW, FOLLOW_SUCCESS, FOLLOW_FAILURE] =
  createRequestActionTypes('myPage/FOLLOW');

const [UNFOLLOW, UNFOLLOW_SUCCESS, UNFOLLOW_FAILURE] =
  createRequestActionTypes('myPage/UNFOLLOW');

const [DELETE, DELETE_SUCCESS, DELETE_FAILURE] =
  createRequestActionTypes('myPage/DELETE');

const [BOARD_LIKE, BOARD_LIKE_SUCCESS, BOARD_LIKE_FAILURE] =
  createRequestActionTypes('board/LIKE');

const [BOARD_UNLIKE, BOARD_UNLIKE_SUCCESS, BOARD_UNLIKE_FAILURE] =
  createRequestActionTypes('board/UNLIKE');

const [GUESTBOOK_LIKE, GUESTBOOK_LIKE_SUCCESS, GUESTBOOK_LIKE_FAILURE] =
  createRequestActionTypes('guestBook/LIKE');

const [GUESTBOOK_UNLIKE, GUESTBOOK_UNLIKE_SUCCESS, GUESTBOOK_UNLIKE_FAILURE] =
  createRequestActionTypes('guestBook/UNLIKE');

export const changeField = createAction(CHANGE_FIELD, ({ key, value }) => ({
  key,
  value,
}));

export const initializeForm = createAction(INITIALIZE_FORM, () => {});

export const register = createAction(REGISTER, ({ formData }) => ({
  formData,
}));
export const getAuthCode = createAction(
  GET_AUTH_CODE,
  ({ phoneNumber, requestType }) => ({
    phoneNumber,
    requestType,
  })
);
export const checkAuthCode = createAction(
  CHECK_AUTH_CODE,
  ({ phoneNumber, verificationCode }) => ({
    phoneNumber,
    verificationCode,
  })
);

export const resetPassword = createAction(
  RESET_PASSWORD,
  ({ phoneNumber, password, verificationCode }) => ({
    phoneNumber,
    password,
    verificationCode,
  })
);

export const login = createAction(
  LOGIN,
  ({ phoneNumber = '', password = '', fcmToken = '' }) => ({
    phoneNumber,
    password,
    fcmToken,
  })
);
export const check = createAction(CHECK);
export const logout = createAction(LOGOUT);
export const follow = createAction(FOLLOW, (followingNo) => followingNo);
export const unfollow = createAction(UNFOLLOW, (followingNo) => followingNo);
export const boardlike = createAction(BOARD_LIKE, (boardNo) => boardNo);
export const boardunlike = createAction(BOARD_UNLIKE, (boardNo) => boardNo);
export const deleteMember = createAction(DELETE, (userNo) => userNo);

export const guestBooklike = createAction(
  GUESTBOOK_LIKE,
  (guestBookNo) => guestBookNo
);
export const guestBookunlike = createAction(
  GUESTBOOK_UNLIKE,
  (guestBookNo) => guestBookNo
);

const registerSaga = createRequestSaga(REGISTER, authAPI.register);
const getAuthCodeSaga = createRequestSaga(
  GET_AUTH_CODE,
  authAPI.getPhoneAuthCode
);
const checkAuthCodeSaga = createRequestSaga(
  CHECK_AUTH_CODE,
  authAPI.checkPhoneAuthCode
);
const resetPasswordSaga = createRequestSaga(
  RESET_PASSWORD,
  authAPI.resetPassword
);
const loginSaga = createRequestSaga(LOGIN, authAPI.login);
const checkSaga = createRequestSaga(CHECK, authAPI.check);
const logoutSaga = createRequestSaga(LOGOUT, authAPI.logout);
const followSaga = createRequestSaga(FOLLOW, myPageAPI.follow);
const unfollowSaga = createRequestSaga(UNFOLLOW, myPageAPI.unfollow);
const deleteMemberSaga = createRequestSaga(DELETE, myPageAPI.deleteMember);
const boardlikeSaga = createRequestSaga(BOARD_LIKE, boardAPI.like);
const boardunlikeSaga = createRequestSaga(BOARD_UNLIKE, boardAPI.unlike);
const guestBooklikeSaga = createRequestSaga(GUESTBOOK_LIKE, guestBookAPI.like);
const guestBookunlikeSaga = createRequestSaga(
  GUESTBOOK_UNLIKE,
  guestBookAPI.unlike
);

export function* authSaga() {
  yield takeLatest(REGISTER, registerSaga);
  yield takeLatest(GET_AUTH_CODE, getAuthCodeSaga);
  yield takeLatest(CHECK_AUTH_CODE, checkAuthCodeSaga);
  yield takeLatest(RESET_PASSWORD, resetPasswordSaga);
  yield takeLatest(LOGIN, loginSaga);
  yield takeLatest(CHECK, checkSaga);
  yield takeLatest(LOGOUT, logoutSaga);
  yield takeLatest(FOLLOW, followSaga);
  yield takeLatest(UNFOLLOW, unfollowSaga);
  yield takeLatest(BOARD_LIKE, boardlikeSaga);
  yield takeLatest(BOARD_UNLIKE, boardunlikeSaga);
  yield takeLatest(GUESTBOOK_LIKE, guestBooklikeSaga);
  yield takeLatest(GUESTBOOK_UNLIKE, guestBookunlikeSaga);
  yield takeLatest(DELETE, deleteMemberSaga);
}

const initialState = {
  phoneNumber: '',
  password: '',

  nick: '',
  name: '',
  email: '',
  photo: '',
  fcmToken: '',

  authMessage: null,
  verificationCode: '',
  verificationState: null,

  user: null, // 변경 금지
};

const auth = handleActions(
  {
    [CHANGE_FIELD]: (state, { payload: { key, value } }) => ({
      ...state,
      [key]: value,
    }),
    [INITIALIZE_FORM]: (state) => ({
      ...state,

      phoneNumber: '',
      password: '',

      nick: '',
      name: '',
      email: '',
      photo: '',
      fcmToken: '',

      verificationState: null,
      verificationCode: '',

      followList: [],
      likeBoardList: [],
      likeGuestBookList: [],

      authError: null,
      authMessage: null,
    }),

    [REGISTER_SUCCESS]: (state, { payload: user }) => ({
      ...state,
      authError: null,
    }),
    [REGISTER_FAILURE]: (state, { payload: error }) => ({
      ...state,
      authError: error,
    }),

    [GET_AUTH_CODE_SUCCESS]: (state, { payload: data }) => ({
      ...state,
      authMessage: data,
    }),
    [GET_AUTH_CODE_FAILURE]: (state, { payload: error }) => ({
      ...state,
      authError: error,
    }),
    [CHECK_AUTH_CODE_SUCCESS]: (
      state,
      { payload: message, meta: response }
    ) => ({
      ...state,
      authMessage: message,
      verificationState: response.status == 200 ? true : null,
    }),
    [CHECK_AUTH_CODE_FAILURE]: (state, { payload: error }) => ({
      ...state,
      verificationState: null,
      authMessage: error,
    }),

    [RESET_PASSWORD_SUCCESS]: (state, { payload: data }) => ({
      ...state,
      authMessage: data,
    }),
    [RESET_PASSWORD_FAILURE]: (state, { payload: error }) => ({
      ...state,
      authError: error,
    }),

    [LOGIN_SUCCESS]: (state, { payload: user, meta: response }) => ({
      ...state,
      authError: null,
      user,
      followList: user ? user.followMemberSet : [],
      likeBoardList: user ? user.likeBoardSet : [],
      likeGuestBookList: user ? user.likeGuestBookSet : [],
      authMessage:
        response.status == 200
          ? null
          : '존재하지 않는 번호이거나 비밀번호가 일치하지 않습니다',
    }),
    [LOGIN_FAILURE]: (state, { payload: error }) => ({
      ...state,
      authError: error,
    }),

    [CHECK_SUCCESS]: (state, { payload: user }) => ({
      ...state,
      user,
      followList: user.followMemberSet,
      likeBoardList: user.likeBoardSet,
      likeGuestBookList: user.likeGuestBookSet,
      authError: null,
    }),
    [CHECK_FAILURE]: (state, { payload: error }) => ({
      ...state,
      user: null,
      authError: error,
    }),

    [LOGOUT_SUCCESS]: (state) => ({
      ...state,
      user: null,
      authMessage: 'logoutSuccess',
    }),

    [DELETE]: (state) => ({
      ...state,
      user: null,
    }),

    [FOLLOW_SUCCESS]: (state, { payload: followingNo }) => ({
      ...state,
      followList: state.followList.concat(followingNo),
    }),
    [FOLLOW_FAILURE]: (state, { payload: error }) => ({
      ...state,
      myPageError: error,
    }),

    [UNFOLLOW_SUCCESS]: (state, { payload: followingNo }) => ({
      ...state,
      followList: state.followList.filter((no) => no != followingNo),
    }),
    [UNFOLLOW_FAILURE]: (state, { payload: error }) => ({
      ...state,
      myPageError: error,
    }),

    [BOARD_LIKE_SUCCESS]: (state, { payload: boardNo }) => ({
      ...state,
      likeBoardList: state.likeBoardList.concat(boardNo),
    }),
    [BOARD_LIKE_FAILURE]: (state, { payload: error }) => ({
      ...state,
      boardError: error,
    }),

    [BOARD_UNLIKE_SUCCESS]: (state, { payload: boardNo }) => ({
      ...state,
      likeBoardList: state.likeBoardList.filter((no) => no != boardNo),
    }),
    [BOARD_UNLIKE_FAILURE]: (state, { payload: error }) => ({
      ...state,
      boardError: error,
    }),

    [GUESTBOOK_LIKE_SUCCESS]: (state, { payload: guestBookNo }) => ({
      ...state,
      likeGuestBookList: state.likeGuestBookList.concat(guestBookNo),
    }),
    [GUESTBOOK_LIKE_FAILURE]: (state, { payload: error }) => ({
      ...state,
      guestBookError: error,
    }),

    [GUESTBOOK_UNLIKE_SUCCESS]: (state, { payload: guestBookNo }) => ({
      ...state,
      likeGuestBookList: state.likeGuestBookList.filter(
        (no) => no != guestBookNo
      ),
    }),
    [GUESTBOOK_UNLIKE_FAILURE]: (state, { payload: error }) => ({
      ...state,
      guestBookError: error,
    }),
  },
  initialState
);

export default auth;
