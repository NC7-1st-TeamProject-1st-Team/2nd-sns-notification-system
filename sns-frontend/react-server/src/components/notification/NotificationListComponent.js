import React from 'react';
import styled from 'styled-components';
import Pagination from '../common/Pagination';
import { Link } from 'react-router-dom';

const NotificationListStyledContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  //height: 30vh;
  flex-direction: column;
  margin-left: 35px;
`;

const ListContainer = styled.div`
  width: 40%;
  height: 600px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  min-height: 600px;
`;

const NotificationTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;

  > form {
    margin: 1rem;
  }
`;

const NotificationItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 20px;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const StyledButton = styled.button`
  background-color: #426b1f;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const NotificationTitle = styled.h2`
  margin-left: 5%;
`;

const NotificationLink = styled(Link)`
  margin-left: 4%;
  color: black;
  text-decoration: none;
`;

const NotificationListComponent = ({
  notis,
  lastPage,
  page,
  query,
  onReadNotiLog,
  onReadAllNotiLog,
}) => {
  return (
    <>
      <NotificationListStyledContainer>
        <ListContainer>
          <NotificationTitleContainer>
            <NotificationTitle>🌱 알림내용</NotificationTitle>
            <form>
              <input value="1" name="notiState" type="hidden" />
              <StyledButton onClick={onReadAllNotiLog}>모두 읽음</StyledButton>
            </form>
          </NotificationTitleContainer>

          {notis?.map((noti) => (
            <NotificationItem key={noti.id}>
              <NotificationLink
                to={noti.url}
                name={noti._id}
                onClick={noti.noti_state == 0 ? onReadNotiLog : null}
              >
                {noti.content}
              </NotificationLink>
              <span>{noti.noti_state === 0 ? '안읽음' : '읽음'}</span>
            </NotificationItem>
          ))}
        </ListContainer>
        <Pagination page={page} query={query} lastPage={lastPage} />
      </NotificationListStyledContainer>
    </>
  );
};

export default NotificationListComponent;
