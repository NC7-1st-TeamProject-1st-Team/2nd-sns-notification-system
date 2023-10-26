import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import * as boardAPI from '../lib/api/board';

const CHANGE_FIELD = 'board/CHANGE_FIELD';
const INITIALIZE_FORM = 'board/INITIALIZE_FORM';

// --------------- Action Type ------------------- //

//게시글
const [LIST, LIST_SUCCESS, LIST_FAILURE] =
  createRequestActionTypes('board/LIST');

const [DETAIL, DETAIL_SUCCESS, DETAIL_FAILURE] =
  createRequestActionTypes('board/DETAIL');

const [FORM, FORM_SUCCESS, FORM_FAILURE] =
  createRequestActionTypes('board/FORM');

const [UPDATE, UPDATE_SUCCESS, UPDATE_FAILURE] =
  createRequestActionTypes('board/UPDATE');

const [DELETE, DELETE_SUCCESS, DELETE_FAILURE] =
  createRequestActionTypes('board/DELETE');

// 사진 삭제
const [DELETE_PHOTO, DELETE_PHOTO_SUCCESS, DELETE_PHOTO_FAILURE] =
  createRequestActionTypes('board/DELETE_PHOTO');

//댓글
const [ADD_COMMENT, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE] =
  createRequestActionTypes('comment/ADD_COMMENT');
const [DELETE_COMMENT, DELETE_COMMENT_SUCCESS, DELETE_COMMENT_FAILURE] =
  createRequestActionTypes('comment/DELETE_COMMENT');

//검색
const [SEARCH_BOARDS, SEARCH_BOARDS_SUCCESS, SEARCH_BOARDS_FAILURE] =
  createRequestActionTypes('board/SEARCH_BOARDS');

// --------------- createAction ------------------- //

export const changeField = createAction(CHANGE_FIELD, ({ key, value }) => ({
  key,
  value,
}));

export const initializeForm = createAction(INITIALIZE_FORM, () => {});

//게시글
export const list = createAction(LIST, ({ category, limit, page }) => ({
  category,
  limit,
  page,
}));

export const detail = createAction(DETAIL, ({ category, boardNo }) => ({
  category,
  boardNo,
}));

export const form = createAction(FORM, ({ formData }) => ({ formData }));

export const update = createAction(UPDATE, ({ updateData }) => ({
  updateData,
}));

export const deleteBoard = createAction(DELETE, ({ boardNo, category }) => ({
  boardNo,
  category,
}));

// 사진 삭제
export const deletePhoto = createAction(DELETE_PHOTO, ({ fileNo }) => ({
  fileNo,
}));

//댓글
export const addComment = createAction(
  ADD_COMMENT,
  ({ content, boardNo, writer }) => ({ content, boardNo, writer })
);
export const deleteComment = createAction(
  DELETE_COMMENT,
  ({ commentNo, boardNo }) => ({ commentNo, boardNo })
);

//검색
export const searchBoards = createAction(
  SEARCH_BOARDS,
  ({ category, searchTxt, pageSize, page }) => ({
    category,
    searchTxt,
    pageSize,
    page,
  })
);

// --------------- Saga ------------------- //

//게시글
const listSaga = createRequestSaga(LIST, boardAPI.list);
const detailSaga = createRequestSaga(DETAIL, boardAPI.detail);
const formSaga = createRequestSaga(FORM, boardAPI.form);
const updateSaga = createRequestSaga(UPDATE, boardAPI.update);
const deleteBoardSaga = createRequestSaga(DELETE, boardAPI.deleteBoard);

// 사진 삭제
const deletePhotoSaga = createRequestSaga(DELETE_PHOTO, boardAPI.deletePhoto);

//댓글
const addCommentSaga = createRequestSaga(ADD_COMMENT, boardAPI.addComment);
const deleteCommentSaga = createRequestSaga(
  DELETE_COMMENT,
  boardAPI.deleteComment
);

//검색
const searchBoardsSaga = createRequestSaga(
  SEARCH_BOARDS,
  boardAPI.searchBoards
);

export function* boardSaga() {
  //게시글
  yield takeLatest(LIST, listSaga);
  yield takeLatest(DETAIL, detailSaga);
  yield takeLatest(FORM, formSaga);
  yield takeLatest(UPDATE, updateSaga);
  yield takeLatest(DELETE, deleteBoardSaga);
  yield takeLatest(DELETE_PHOTO, deletePhotoSaga);

  //댓글
  yield takeLatest(ADD_COMMENT, addCommentSaga);
  yield takeLatest(DELETE_COMMENT, deleteCommentSaga);

  //검색
  yield takeLatest(SEARCH_BOARDS, searchBoardsSaga);
}

const initialState = {
  boardList: [],
  category: 1,
  lastPage: 1,
  board: null,
  comments: null,
  boardError: null, // 에러 상태
  boardComment: null,
  commentError: null,
  searchTxt: '',
};

// --------------- Reducer ------------------- //
const board = handleActions(
  {
    [CHANGE_FIELD]: (state, { payload: { key, value } }) => ({
      ...state,
      [key]: value,
    }),
    [INITIALIZE_FORM]: (state) => ({
      ...state,
      title: '',
      content: '',
      files: '',
      board: null,
    }),

    //게시글
    [LIST_SUCCESS]: (state, { payload: { boardList, lastPage } }) => ({
      ...state,
      boardError: null,
      boardList,
      lastPage,
    }),
    [LIST_FAILURE]: (state, { payload: error }) => ({
      ...state,
      boardError: error,
    }),
    [DETAIL_SUCCESS]: (state, { payload: response }) => ({
      ...state,
      boardError: null,
      ...response,
    }),
    [DETAIL_FAILURE]: (state, { payload: error }) => ({
      ...state,
      boardError: error,
    }),
    [FORM_SUCCESS]: (state, { payload: board }) => ({
      ...state,
      boardError: null,
      board,
    }),
    [FORM_FAILURE]: (state, { payload: error }) => ({
      ...state,
      boardError: error,
    }),
    [UPDATE_SUCCESS]: (state, { payload: board }) => ({
      ...state,
      boardError: null,
      board,
    }),
    [UPDATE_FAILURE]: (state, { payload: error }) => ({
      ...state,
      boardError: error,
    }),
    [DELETE_SUCCESS]: (state) => ({
      ...state,
      boardError: null,
      board: initialState.board,
    }),
    [DELETE_FAILURE]: (state, { payload: error }) => ({
      ...state,
      boardError: error,
    }),
    [DELETE_PHOTO_SUCCESS]: (state) => ({
      ...state,
      boardError: null,
      board: state.board,
    }),
    [DELETE_PHOTO_FAILURE]: (state, { payload: error }) => ({
      ...state,
      boardError: error,
    }),

    //댓글
    [ADD_COMMENT_SUCCESS]: (state, { payload: boardComment }) => ({
      ...state,
      commentError: null,
      boardComment,
    }),
    [ADD_COMMENT_FAILURE]: (state, { payload: error }) => ({
      ...state,
      commentError: error,
    }),
    [DELETE_COMMENT_SUCCESS]: (state, { payload: { commentNo, boardNo } }) => ({
      ...state,
      commentError: null,
    }),
    [DELETE_COMMENT_FAILURE]: (state, { payload: error }) => ({
      ...state,
      commentError: error,
    }),

    //검색
    [SEARCH_BOARDS_SUCCESS]: (state, { payload: resultList }) => ({
      ...state,
      show: 'searchResult',
      boardList: resultList,
      searchTxt: '',
    }),
    [SEARCH_BOARDS_FAILURE]: (state, { payload: error }) => ({
      ...state,
      boardError: error,
    }),
  },
  initialState
);

export default board;
