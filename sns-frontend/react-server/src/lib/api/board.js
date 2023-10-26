import springClient from './springClient';
import qs from 'qs';

// boardform
export const form = ({ formData }) =>
  springClient.post('board/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

// boardlist
export const list = async ({ category, limit, page}) => {
  const queryString = qs.stringify({ limit, page });
  return await springClient.get(`/board/list?category=${category}&${queryString}`);
};


// boarddetail
export const detail = ({ category, boardNo }) =>
  springClient.get(`board/detail?category=${category}&boardNo=${boardNo}`);

// boardupdate
export const update = ({ updateData }) =>
  springClient.post('board/update', updateData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

// 게시글삭제
export const deleteBoard = ({ category, boardNo }) =>
    springClient.delete(`board/delete/${boardNo}`, { params: { category } });

// 게시글 사진 삭제
export const deletePhoto = ({ fileNo }) =>
  springClient.delete(`board/fileDelete/${fileNo}`);

// 댓글작성
export const addComment = (commentData) =>
    springClient.post('board/addComment', commentData);

//댓글삭제
export const deleteComment = ({ commentNo, boardNo }) =>
    springClient.delete(`/board/deleteComment/${boardNo}/${commentNo}`);

//좋아요
export const like = (boardNo) => {
  const queryString = qs.stringify({ boardNo });
  return springClient.post(`/board/like?${queryString}`);
};

//좋아요취소
export const unlike = (boardNo) => {
  const queryString = qs.stringify({ boardNo });
  return springClient.post(`/board/unlike?${queryString}`);
};

//검색
export const searchBoards = ({ category, searchTxt, pageSize = 5, page = 1 }) => {
  const queryString = qs.stringify({ category, searchTxt, pageSize, page });
  return springClient.get(`/board/searchBoards?${queryString}`);
};
