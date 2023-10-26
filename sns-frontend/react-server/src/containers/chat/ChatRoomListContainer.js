import { useNavigate } from 'react-router-dom';
import ChatRoomListComponent from '../../components/chat/ChatRoomListComponent';
import ChatComponent from '../../components/chat/ChatComponent';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { roomList, concatRooms, leaveRoom } from '../../modules/rooms';
import styled from 'styled-components';
import auth from '../../modules/auth';

const ChatRoomList = styled.div`
  display: flex;
  padding: 20px;
`;

const CenteredContainer = styled.div`
  display: flex;
  // align-items: center;
  height: 100vh; /* 화면 높이의 100%로 컨테이너를 채움 */
`;

const ChatRoomListContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { rooms, roomsStatus, error, user } = useSelector(
    ({ rooms, auth }) => ({
      rooms: rooms.rooms,
      roomsStatus: rooms.roomsStatus,
      error: rooms.error,
      user: auth.user,
    })
  );

  useEffect(() => {
    if (user && user.no) {
      // 'user' 및 'no' 속성이 존재하는지 확인
      dispatch(roomList(user.no));
    }
  }, [dispatch, user]);

  const handleSelectRoom = ({ users, roomId }) => {
    if (users && users[0] && users[1]) {
      navigate(
        `/room?mno1=${users[0].mno}&mno2=${users[1].mno}&roomId=${roomId}`
      );
    } else if (users && users[0] && roomId) {
      navigate(`/room?mno1=${users[0].mno}&roomId=${roomId}`);
    }
  };

  const handleOnLeaveRoom = (roomId) => {
    dispatch(leaveRoom({ roomId }));
  };

  useEffect(() => {
    if (roomsStatus) {
      navigate(`/room/list`);
    }
  }, [roomsStatus]);

  return (
    <CenteredContainer>
      <ChatRoomList>
        <div>
          <ChatRoomListComponent
            rooms={rooms}
            onSelectRoom={handleSelectRoom}
            onLeaveRoom={handleOnLeaveRoom}
          />
        </div>
      </ChatRoomList>
    </CenteredContainer>
  );
};

export default ChatRoomListContainer;
