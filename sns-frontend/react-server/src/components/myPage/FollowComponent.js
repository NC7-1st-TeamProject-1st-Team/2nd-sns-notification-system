import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import FollowButton from './FollowButton';

const MemberListBox = styled.div`
  margin-left: 700px;
  width: 30%;
  padding: 0px;
  background-color: #fff;
  border-radius: 5px;
`;

const MemberItem = styled.div`
  margin-top: 0px;
  display: flex;
  justify-content: space-between;
  padding: 10px 10px;
  border-bottom: 1px solid #ccc;
`;

const MemberPhoto = styled.img`
  height: 80px;
  width: 80px;
  border-radius: 50%;
`;

const MemberLink = styled.a`
  margin-top: 25px;
  text-decoration: none;
  color: black;
`;

const ToggleLabel = styled.label`
  margin-top: 25px;
  color: #426b1f;
  background-color: transparent;
`;

const StyledChatButton = styled.button`
  margin-top: 25px;
  color: #426b1f;
  background-color: transparent;
  border: 1px solid transparent;
  &:hover {
    cursor: pointer;
  }
`;
const FollowComponent = ({
  user,
  followListData,
  handleFollow,
  handleUnfollow,
  followMemberSet,
  show,
}) => {
  return (
    <MemberListBox>
      <h3>{show === 'following' ? '🌱 팔로잉 리스트' : ''}</h3>
      <h3>{show === 'follower' ? '🌱 팔로워 리스트' : ''}</h3>
      <h3>{show === 'searchResult' ? '🌱 검색 결과' : ''}</h3>
      {Array.isArray(followListData) &&
        followListData.map((followItem, index) => (
          <MemberItem key={followItem.no}>
            <MemberPhoto
              src={
                followItem.photo
                  ? `https://kr.object.ncloudstorage.com/bitcamp-nc7-bucket-14/sns_member/${followItem.photo}`
                  : 'images/default.jpg'
              }
            />
            <MemberLink href={`/myPage/${followItem.no}`}>
              {followItem.nick}
            </MemberLink>

            <FollowButton
              followMemberSet={followMemberSet}
              memberNo={followItem.no}
              handleUnfollow={handleUnfollow}
              handleFollow={handleFollow}
            />
            <Link to={`/room?mno1=${user.no}&mno2=${followItem.no}`}>
              <StyledChatButton>
                <img src="/images/dm.png" alt="채팅하기" />
              </StyledChatButton>
            </Link>
          </MemberItem>
        ))}
    </MemberListBox>
  );
};

export default FollowComponent;
