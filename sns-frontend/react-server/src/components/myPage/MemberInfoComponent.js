import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import FollowButton from './FollowButton';
import MemberInfoUpdateModalContainer from '../../containers/myPage/MemberInfoUpdateModalContainer';

const Sidebar = styled.div`
  float: left;
  width: 430px;
  height: 800px;
  padding: 20px;
  background-color: #fafaf5;
  border-radius: 5px;
`;

const ProfilePic = styled.img`
  width: 300px;
  height: auto;
  border-radius: 50%;
  margin: auto;
  justify-content: center;
  display: flex;
`;

const ButtonContainer = styled.div`
  display: flex;
  text-align: center;
  margin-top: 10px;
  justify-content: center;
`;

const SidebarButton = styled(Link)`
  font-size: 20px;
  background-color: #426b1f;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 15px 40px;
  cursor: pointer;
  white-space: nowrap;
  text-decoration-line: none;
  margin: 30px;

  &:hover {
    background-color: #5d962c;
    color: white;
  }
`;

const ChatRoomListButton = styled(Link)`
  font-size: 20px;
  background-color: #426b1f;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 15px 117px;
  cursor: pointer;
  white-space: nowrap;
  text-decoration-line: none;
  // margin: 20px;
  margin-top: 0px;
  text-item: center;

  &:hover {
    background-color: #5d962c;
    color: white;
  }
`;

const EditInfoLink = styled.div`
  text-decoration: none;
  color: #426b1f;
  margin: 0 0 0 20px;
  padding: 15px 20px;
  text-align: right;
  float: right;
  cursor:pointer;
`;

const StateMessageLabel = styled.p`
  display: inline;
  font-weight: bold;
  flex: 1;
  margin-right: 10px;
`;

const StateMessage = styled.textarea`
  width: 100%;
  border: none;
  background-color: transparent;
  resize: none;
  margin-bottom: 10px;
`;

const StateMessageTextarea = styled.textarea`
  border: none;
  background-color: transparent;
  width: 100%;
  resize: none;
`;

const MemberInfoComponent = ({
  user,
  myPageData,
  onFollowingList,
  onFollowerList,
  handleFollow,
  handleUnfollow,
  followMemberSet,
}) => {
  const [isMyPageModalOpen, setIsMyPageModalOpen] = useState(false);

  const toggleMyPageModal = () => {
    setIsMyPageModalOpen(!isMyPageModalOpen);
  };

  const handleMyPageClick = () => {
    setIsMyPageModalOpen((prevState) => !prevState); // 모달 열기/닫기 토글
  };


  if (myPageData == null) {
    return <div>loading...</div>;
  }
  const profileUrl = `https://gjoxpfbmymto19010706.cdn.ntruss.com/sns_member/${myPageData.photo}?type=f&w=270&h=270&faceopt=true&ttype=jpg`;
  return (
      <>
        <Sidebar>
          <p>🌱 총 방문자 수 {myPageData.visitCount}</p>
          {myPageData.photo ? (
            <ProfilePic src={profileUrl} alt="프로필 사진" />
          ) : (
            <ProfilePic src="/images/default.jpg" alt="기본 이미지" />
          )}
          <h2>{myPageData.nick}</h2>
          <StateMessageLabel>상태메시지</StateMessageLabel>
          {user && user.no === myPageData.no ? (
              <EditInfoLink onClick={handleMyPageClick}>
                내 정보 수정
              </EditInfoLink>
          ) : (
            <FollowButton
              memberNo={myPageData.no}
              followMemberSet={followMemberSet}
              handleUnfollow={handleUnfollow}
              handleFollow={handleFollow}
            />
          )}
          <StateMessageTextarea
            name="stateMessage"
            readOnly
            value={myPageData.stateMessage || '상태 메시지가 없습니다.'}
          />

          <ButtonContainer>
            <SidebarButton type="button" onClick={onFollowingList}>
              팔로잉
            </SidebarButton>
            <SidebarButton type="button" onClick={onFollowerList}>
              팔로워
            </SidebarButton>
          </ButtonContainer>
          <ButtonContainer>
            {user && user.no === myPageData.no && (
              <ChatRoomListButton to={`/room/list`}>채팅 리스트</ChatRoomListButton>
            )}
          </ButtonContainer>
        </Sidebar>
        {/* 내정보수정 모달 */}
        {isMyPageModalOpen && (
            <MemberInfoUpdateModalContainer onClose={toggleMyPageModal} />
        )}
      </>
  );
};

export default MemberInfoComponent;
