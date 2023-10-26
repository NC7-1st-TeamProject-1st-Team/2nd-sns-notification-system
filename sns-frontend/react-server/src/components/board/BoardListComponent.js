import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import Pagination from '../common/Pagination';
import SearchBoardContainer from '../../containers/board/SearchBoardContainer';

const Container = styled.div`
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
`;

const Button = styled.button`
  background-color: #426b1f;
  color: white;
  padding: 5px 10px;
  text-decoration: none;
  border: none;
  border-radius: 4px;
  margin-right: ${(props) =>
    props.main ? '300px' : props.write ? '10px' : '0'};
  cursor: pointer;
  &:hover {
    background-color: #5d962c;
  }
`;

const BoardLink = styled.a`
  color: black;
  text-decoration: none;
  font-size: 20px;
  font-weight: bold;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin: 0 auto;
  height: 600px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

const CardContent = styled.div`
  flex: 1;
  padding: 16px;
  overflow: auto;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-top: 1px solid #eee;
`;

const AuthorText = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DateText = styled.span`
  color: #888;
`;

const ActionButtonsContainer = styled.div`
  text-align: right;
  margin-right: 20px;
  margin-top: -30px;
  margin-bottom: 20px;
`;

const ProfilePicture = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: auto;
  }
`;

const BoardListComponent = ({ boardListData, lastPage, page, query }) => {
  const navigate = useNavigate();

  // Card 아무곳이나 클릭 시 detail 페이지로 이동하는 함수
  const handleCardClick = (category, no) => {
    navigate(`/board/detail/${category}/${no}`); // navigate 함수로 페이지 이동
    window.location.reload();
  };

  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 0,
    reset: true,
    config: {
      duration: 500, // 애니메이션의 지속 시간 설정
    },
  });

  return (
    <Container>
      <SearchBoardContainer></SearchBoardContainer>
      <ActionButtonsContainer>
        <Link to={`/board/form/1`}>
          <Button>✏️글쓰기</Button>
        </Link>
      </ActionButtonsContainer>

      <animated.div style={fadeIn}>
        <CardContainer>
          {boardListData &&
            boardListData.map((board) => (
              <Card
                key={board.no}
                onClick={() => handleCardClick(board.category, board.no)}
              >
                <CardImage
                  src={
                    board.attachedFiles && board.attachedFiles.length > 0
                      ? `https://kr.object.ncloudstorage.com/bitcamp-nc7-bucket-14/sns_board/${board.attachedFiles[0].filePath}`
                      : '/images/mangom.png'
                  }
                />
                <CardContent>
                  <BoardLink
                    href={`/board/detail/${board.category}/${board.no}`}
                  >
                    {board.title || '제목없음'}
                  </BoardLink>
                  <p>{board.content}</p>
                </CardContent>
                <CardFooter>
                  <AuthorText>
                    <ProfilePicture>
                      <img
                        src={
                          board.writer.photo
                            ? `http://gjoxpfbmymto19010706.cdn.ntruss.com/sns_member/${board.writer.photo}?type=f&w=270&h=270&faceopt=true&ttype=jpg`
                            : '/images/avatar.png'
                        }
                        alt="profile"
                      />
                    </ProfilePicture>
                    {board.writer.nick}
                  </AuthorText>
                  <DateText>
                    {new Date(board.createdAt).toLocaleDateString()}
                  </DateText>
                </CardFooter>
              </Card>
            ))}
        </CardContainer>
      </animated.div>

      <Pagination page={page} query={query} lastPage={lastPage} />
    </Container>
  );
};

export default BoardListComponent;
