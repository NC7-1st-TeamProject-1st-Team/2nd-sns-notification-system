import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import guestBook from '../../modules/guestBook';
import Pagination from '../common/Pagination';
import FloatingHeart from '../common/FloatingHeart';

const GuestbookTitle = styled.div`
  text-align: center;
`;

const AddGuestbookForm = styled.div`
  text-align: center;
`;

const StyledForm = styled.form`
  display: inline-block;
  text-align: left;
`;

const StyledTable = styled.table`
  width: 40%;
  border-collapse: collapse;
  margin: 0 auto;
  margin-bottom: 20px;

  &,
  th,
  td {
    border: 1px solid #fafaf5;
  }

  th,
  td {
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #fafaf5;
  }
`;

const StyledTh = styled.th`
  text-align: left;
  width: 200px;
`;

const StyledInput = styled.input`
  font-size: 18px;
  border: none;
  width: 100%;
`;

const StyledTextarea = styled.textarea`
  font-size: 18px;
  border: none;
  width: 100%;
  overflow: hidden;
  resize: none;
`;

const StyledButton = styled.button`
  align-items: center;
  padding: 5px 10px;
  font-size: 16px;
  background-color: #426b1f;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  float: inherit;
  height: 50px;

  &.actions {
    margin: 5px;
  }

  &:hover {
    pointer: cursor;
    background-color: #5d962c;
  }
`;

const StyledDiv = styled.div`
  text-align: center;
  margin-bottom: 7%;
`;

const ScrollableTable = styled.div`
  max-height: 300px;
  overflow-y: scroll;
`;

const Actions = styled.div`
  text-align: center;
  padding: 16px;
  line-height: 15;
`;

const ContentTable = styled.table`
  width: 40%;
  margin: 0 auto;
  border: none;
  border-collapse: collapse;

  td {
    border: none;
  }
`;

const ContentContainer = styled.div`
  text-align: center;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-right: 20px;
`;

const ClockIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const HorizontalLayout = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

const ProfilePicture = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: auto;
  }
`;

const PaginationLink = styled.a`
  display: inline-block;
  width: 36px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  margin-right: 4px;
  border-radius: 50%;
  background-color: #fafaf5;
  text-decoration: none;
  color: black;

  &.active {
    background-color: #426b1f;
    color: white;
  }
`;

const PageLabel = styled.div`
  margin-top: 60px;
  text-align: center;
`;

const GuestBookTextarea = styled.textarea`
  width: 100%;
  min-height: 7em;
  border-color: transparent;
  resize: none;
  font-size: 20px;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 80px;
`;

const NoCell = styled.td`
  text-align: center;
`;

const TitleMetaCell = styled.td`
  margin-left: 1000px;
`;

const FirstRow = styled.tr`
  background-color: #fafaf5;
  height: 50px;
`;

const SecondRow = styled.tr`
  background-color: white;
  height: 200px;
`;

const WriterCell = styled.td`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
`;

const NickNameDiv = styled.div`
  margin-top: 5px;
`;

const ContentLikeCell = styled.td`
  position: relative;
`;

const LikeButtonContainer = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  cursor: pointer;
`;

const HiddenInput = styled.input`
  width: 0;
`;

const LikeLabel = styled.label`
  background-color: transparent;
`;

const Table = styled.table``;

const ButtonContainer = styled.div``;

const DeleteButton = styled.button`
  text-align: center;
  margin-bottom: 2%;
  padding: 5px 10px;
  background-color: #426b1f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    pointer: cursor;
    background-color: #5d962c;
  }
`;

const ProfileLink = styled.a`
  text-decoration-line: none;
  color: black;
`;

const LikeButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 0;
  font-size: 24px;

  &:hover {
    color: #426b1f;
    cursor: pointer;
    &::before {
      content: '❤️';
      position: absolute;
      transition: top 0.2s, opacity 0.2s;
    }
  }
`;

const DeleteButtonContainer = styled.div`
  text-align: left;
  margin-top: 10px;
`;

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const TitleSpan = styled.span`
  font-size: 20px;
`;

const FloatingHeartsContainer = styled.div`
  position: absolute;
  top: 100px;
  right: 0;
`;

const GuestBookList = styled.div`
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transform: translateY(${(props) => (props.isVisible ? 0 : '20px')});
  transition: opacity 0.5s, transform 0.5s;
`;

const GuestBookComponent = ({
  content,
  title,
  onChange,
  onDelete,
  mpno,
  onSubmit,
  guestBookList,
  guestBookOwnerNick,
  guestBook,
  guestBookNo,
  handleUnlike,
  handleLike,
  likeGuestBookSet,
  totalPages,
  currentPage,
  onPageChange,
  lastPage,
  page,
  query,
  user,
}) => {
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [likedGuestBooks, setLikedGuestBooks] = useState({});
  const [isListVisible, setListVisible] = useState(false);

  useEffect(() => {
    // 페이지 로드 후 1초 뒤에 방명록 리스트를 표시합니다.
    const timer = setTimeout(() => {
      setListVisible(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleLikeButtonClick = async (no) => {
    const isLiked = likedGuestBooks[no];

    try {
      if (isLiked) {
        await handleUnlike(no);
        setLikedGuestBooks((prev) => ({ ...prev, [no]: false }));
      } else {
        await handleLike(no);
        setLikedGuestBooks((prev) => ({ ...prev, [no]: true }));
        setFloatingHearts((prev) => [
          ...prev,
          { id: Date.now(), guestBookNo: no },
        ]);
      }
    } catch (error) {
      console.error('좋아요 처리 중 오류 발생:', error);
    }
  };

  const removeHeart = (id) => {
    setFloatingHearts((prev) => prev.filter((heart) => heart.id !== id));
  };

  return (
    <>
      <GuestbookTitle>
        <h2>
          🌱 {guestBookOwnerNick ? `${guestBookOwnerNick} 의 방명록 🌱` : ''}
        </h2>
      </GuestbookTitle>

      <AddGuestbookForm>
        <StyledForm method="post" action="/guestBook/add">
          <StyledTable>
            <tbody>
              <tr>
                <StyledTh>🌱 제목</StyledTh>
                <td>
                  <StyledInput
                    type="text"
                    name="title"
                    placeholder="제목을 입력하세요"
                    required
                    value={title}
                    onChange={onChange}
                  />
                </td>
              </tr>
              <tr>
                <StyledTh>🌱 내용</StyledTh>
                <td>
                  <StyledTextarea
                    name="content"
                    rows="6"
                    cols="150"
                    placeholder="내용을 입력하세요"
                    required
                    value={content}
                    onChange={onChange}
                  ></StyledTextarea>
                </td>
              </tr>
            </tbody>
            <input type="hidden" name="mpno" value={mpno} />
          </StyledTable>
          <StyledDiv>
            <StyledButton type="submit" onClick={onSubmit}>
              작성하기
            </StyledButton>
          </StyledDiv>
        </StyledForm>
      </AddGuestbookForm>

      <GuestBookList isVisible={isListVisible}>
        {Array.isArray(guestBookList) &&
          guestBookList.map((guestBook, index) => (
            <Container key={guestBook.no}>
              <ContentContainer>
                <ContentTable>
                  <tbody>
                    <FirstRow>
                      <NoCell>
                        <span>No. {guestBook.no}</span>
                      </NoCell>
                      <TitleMetaCell colSpan="3">
                        <HorizontalLayout>
                          <TitleSpan>{guestBook.title}</TitleSpan>
                          <MetaInfo>
                            <ClockIcon src="/images/clock.png" />
                            <span>{formatDate(guestBook.createdAt)}</span>
                          </MetaInfo>
                        </HorizontalLayout>
                      </TitleMetaCell>
                    </FirstRow>
                    <SecondRow>
                      <WriterCell>
                        <ProfilePicture>
                          <img
                            src={
                              guestBook.writer.photo
                                ? `http://gjoxpfbmymto19010706.cdn.ntruss.com/sns_member/${guestBook.writer.photo}?type=f&w=270&h=270&faceopt=true&ttype=jpg`
                                : '/images/avatar.png'
                            }
                            alt="profile"
                          />
                        </ProfilePicture>
                        <NickNameDiv>
                          {guestBook.writer.nick || '임시 닉네임'}
                        </NickNameDiv>
                        {
                          // 작성자와 로그인 사용자 번호가 일치하는 경우와
                          // 본인 방명록에만 삭제 버튼 표시
                        }
                        {(user.no === guestBook.writer.no ||
                          guestBook.mpno === user.no) && (
                          <DeleteButton
                            onClick={(e) => onDelete(e, guestBook.no)}
                          >
                            삭제
                          </DeleteButton>
                        )}
                      </WriterCell>
                      <ContentLikeCell colSpan="3">
                        <GuestBookTextarea readOnly>
                          {guestBook.content || '내용'}
                        </GuestBookTextarea>
                        <LikeButton
                          onClick={() => handleLikeButtonClick(guestBook.no)}
                        >
                          {likeGuestBookSet.includes(guestBook.no)
                            ? '️❤️'
                            : '🤍'}
                        </LikeButton>
                        <FloatingHeartsContainer>
                          {floatingHearts
                            .filter(
                              (heart) => heart.guestBookNo === guestBook.no
                            )
                            .map((heart) => (
                              <FloatingHeart
                                key={heart.id}
                                onComplete={() => removeHeart(heart.id)}
                              />
                            ))}
                        </FloatingHeartsContainer>
                      </ContentLikeCell>
                    </SecondRow>
                  </tbody>
                </ContentTable>
              </ContentContainer>
              <DeleteButtonContainer></DeleteButtonContainer>
            </Container>
          ))}
      </GuestBookList>

      <Pagination page={page} query={query} lastPage={lastPage} />
    </>
  );
};

export default GuestBookComponent;
