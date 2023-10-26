import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const ChatRoomItemContainer = styled.div`
  background-color: #ffffff;
  margin-bottom: 10px;
  cursor: pointer;
  &:hover {
    background-color: #dcdcdc;
  }
  border-radius: 15px;
`;

const ChatRoomList = styled.div`
  width: 500px;
  height: 700px;
  display: inline-block;
  background-color: #fafaf5;
  padding: 20px;
  margin-left: 380px;
  //margin-top:-100px;
`;

const ChatRoomListBox = styled.div`
  width: 500px;
  height: 600px;
  display: inline-block;
  background-color: #fafaf5;
  overflow-y: auto; /* 목록이 넘치면 스크롤 가능하도록 설정 */
`;

const ChatRoomItem = styled.div`
  font-size: 20px;
  padding: 30px;
`;

const ProfileImagesContainer = styled.div`
  position: relative;
  width: 70px;
  height: 35px;
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: absolute;
  display: flex;

  /* 첫 번째 이미지 */
  &:first-of-type {
    left: 0;
    top: -5px;
    left: -10px;
  }

  /* 두 번째 이미지 */
  &:nth-of-type(2) {
    left: 50%; /* 이미지의 중간부터 시작되도록 설정 */
    top: -5px;
    transform: translate(
      -20px,
      20px
    ); /* X축과 Y축을 이용하여 이미지를 원하는 만큼 이동 */
  }
`;

const NicknameContainer = styled.div`
  position: relative;
  margin-left: 10px;
  display: flex;
  align-items: center;
`;

const ListComponent = styled.div`
  display: flex;
`;

const StyledLeaveBtn = styled.button`
  width: 100px;
  height: 41px;
  background: #426b1f;
  border-radius: 8px;
  color: #ffffff;
  font-weight: 600;
  font-size: 16px;
  line-height: 130%;
  border: none;
  cursor: pointer;
  margin: 10px;
  // align-self: flex-end; /* 맨 아래에 정렬 */
  display: flex;
  align-items: center;
  font-weight: normal;

  &:hover {
    background: #5d962c;
    color: #fff;
  }
`;

const ChatLeaveBtnContainer = styled.div`
  display: flex;
  margin-left: auto;
`;

const ChatRoomListComponent = ({ rooms, onSelectRoom, onLeaveRoom }) => {
  return (
    <ChatRoomList>
      <h2>채팅방 목록</h2>
      <ChatRoomListBox>
        {rooms &&
          rooms.map((room) => (
            <ChatRoomItemContainer>
              <ChatRoomItem
                key={room._id}
                onClick={(e) => {
                  console.log(room);
                  onSelectRoom({ users: room.users, roomId: room._id });
                }}
              >
                <ListComponent>
                  <ProfileImagesContainer>
                    {room.users[0] ? (
                      <ProfileImage
                        src={`https://kr.object.ncloudstorage.com/bitcamp-nc7-bucket-14/sns_member/${room.users[0]?.photo}`}
                        alt="Profile 0"
                      />
                    ) : null}
                    {room.users[1] ? (
                      <ProfileImage
                        src={`https://kr.object.ncloudstorage.com/bitcamp-nc7-bucket-14/sns_member/${room.users[1]?.photo}`}
                        alt="Profile 1"
                      />
                    ) : null}
                  </ProfileImagesContainer>
                  <NicknameContainer>
                    {`${room.users[0]?.nick} ${
                      room.users[1] ? ',' + room.users[1].nick : ''
                    }`}
                  </NicknameContainer>

                  <ChatLeaveBtnContainer>
                    <StyledLeaveBtn
                      onClick={(e) => {
                        e.stopPropagation(); // 이벤트 전파 중지
                        onLeaveRoom(room._id);
                      }}
                    >
                      채팅 나가기
                    </StyledLeaveBtn>
                  </ChatLeaveBtnContainer>
                </ListComponent>
              </ChatRoomItem>
            </ChatRoomItemContainer>
          ))}
      </ChatRoomListBox>
    </ChatRoomList>
  );
};

export default ChatRoomListComponent;
