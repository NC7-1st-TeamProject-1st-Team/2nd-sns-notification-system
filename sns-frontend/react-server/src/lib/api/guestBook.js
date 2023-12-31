import springClient from './springClient';
import qs from 'qs';

export const post = ({ mpno, title, content, writer }) =>
    springClient.post('guestBook/add', { mpno, title, content, writer, });

export const list = async ({ no, limit, page }) => {
  const queryString = qs.stringify({ limit, page });
  return await springClient.get(`/guestBook/${no}?${queryString}`);
};

export const deleteGuestBook = (guestBookNo) => springClient.delete(`/guestBook/delete/${guestBookNo}`);

//좋아요
export const like = (guestBookNo) => {
  const queryString = qs.stringify({ guestBookNo });
  return springClient.post(`/guestBook/like?${queryString}`);
};

//좋아요취소
export const unlike = (guestBookNo) => {
  const queryString = qs.stringify({ guestBookNo });
  return springClient.post(`/guestBook/unlike?${queryString}`);
};
