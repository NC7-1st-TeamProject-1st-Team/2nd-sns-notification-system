import springClient from './springClient';
import qs from 'qs';

export const list = (userNo) => {
  return springClient.get(`/myPage/${userNo}`);
};

export const info = (userNo) => springClient.get(`/myPage/${userNo}/info`);

export const update = ({ updateData, userNo }) =>
  springClient.post(`myPage/${userNo}/update`, updateData, userNo, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

// 탈퇴하기
export const deleteMember = (userNo) =>
  springClient.delete(`myPage/${userNo}/update`);

export const following = (userNo) => {
  return springClient.get(`/myPage/${userNo}/following`);
};

export const follower = (userNo) => {
  return springClient.get(`/myPage/${userNo}/followers`);
};

export const follow = (followingNo) => {
  const queryString = qs.stringify({ followingNo });
  return springClient.get(`/myPage/follow?${queryString}`);
};

export const unfollow = (followingNo) => {
  const queryString = qs.stringify({ followingNo });
  return springClient.get(`/myPage/unfollow?${queryString}`);
};

export const searchMembers = ({ searchTxt, pageSize = 10, page = 1 }) => {
  const queryString = qs.stringify({ searchTxt, pageSize, page });
  return springClient.get(`/myPage/searchMembers?${queryString}`);
};
