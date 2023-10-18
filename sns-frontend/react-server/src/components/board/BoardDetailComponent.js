import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import FloatingHeart from '../common/FloatingHeart';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  //height: 1000vh;
  background-color: #ffffff;
  border: 1px solid #ffffff;
  position: relative;
`;

const ContentBox = styled.div`
  text-align: left;
  padding: 20px;
  background: #f2f2f2;
  width: 600px;
  //height: 7000px;
  position: relative;
  //overflow-y: scroll; /* 세로 스크롤 활성화 */
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const MetaInfo = styled.div`
  font-size: 14px;
  color: #888;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-end;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 20px;
`;

const StyledButton = styled.button`
  background-color: #426b1f;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    pointer: cursor;
  }
`;

const LikeButton = styled(StyledButton)`
  right: 0;
  bottom: 0;
  background-color: transparent;
  color: black;
  font-size: 25px;

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

const ClockIcon = styled.img`
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: space-between;
`;

const LikeList = styled.div`
  position: absolute;
  top: 730px;
  right: 170px;
`;

const CommentInputContainer = styled.div`
  margin-top: 40px;
  //width: 90%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  //align-items: center;
  //justify-content: center;
`;

const SubmitButton = styled(StyledButton)`
  padding: 10px 10px;
  font-size: 16px;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 50px;

  &:hover {
    background-color: #5d962c;
  }
`;

const CommentTextArea = styled.textarea`
  height: 35px;
  width: 80%;
  border: none;
  padding: 10px;
  resize: none;
  border-radius: 5px;
  padding: 10px;
`;

const CommentContainer = styled.div`
  border-top: 1px solid #eee;
  padding: 10px 0;
  margin-top: 50px;
  margin-bottom: 50px;
`;

const CommentMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const CommentContent = styled.p`
  margin: 0;
`;

const ProfileImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
`;

const StyledImage = styled.img`
  width: 200px;
  height: 200px;
`;

const BoardDetail = styled.div`
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
`;

const CommentsSection = styled.div`
  margin-left: 10px;
`;

const StyledInput = styled.input`
  margin-top: 20px;
  margin-bottom: 30px;
  margin-left: 5px;
  font-size: 40px;
  background-color: transparent;
  border: none;
`;

const StyledTextArea = styled.textarea`
  margin-top: 20px;
  margin-bottom: 30px;
  margin-left: 5px;
  font-size: 20px;
  background-color: transparent;
  border: none;
  resize: none;
  height: 200px;
  width: 97%;
`;

const EditDeleteButtonContainer = styled.div`
  display: inline-flex;

  button:not(:last-child) {
    margin-right: 0;
  }
`;

const DeleteText = styled.span`
  cursor: pointer;
  margin-right: 10px;
  color: grey;
  font-size: 13px;
`;

const InputWithButtonContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const DateDeleteButtonContainer = styled.div`
  display: inline-flex;
  align-items: center;

  span:not(:last-child) {
    margin-right: 10px;
  }
`;

const BoardDetailWrapper = styled.div`
  text-align: right;
  position: relative;
`;

const FloatingHeartsContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const LoadMoreCommentsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
  cursor: pointer;
`;

const ArrowIcon = styled.span`
  font-size: 20px;
  margin-right: 5px;
`;

const CommentDate = styled.span`
  font-size: 10px;
`;

const FileInputWrapper = styled.div`
  position: relative;
  font-size: 12px;
  // cursor: pointer;
  margin-left: 10px;
`;

const FileInputLabel = styled.label`
  background-color: #d3d3d3;
  color: light-gray;
  padding: 8px 8px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.65rem;
  // margin-left: 10px;
  margin-left: 0px;
  &:hover {
    background-color: #426b1f;
    color: white;
  }
`;

const FileInput = styled.input`
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

const BoardDetailComponent = ({
  user,
  board,
  boardNo,
  onNavigateToList,
  handleUnlike,
  handleLike,
  likeBoardSet,
  comments,
  content,
  onEdit,
  onReset,
  onDelete,
  onDeleteComment,
  onSubmit,
  onChange,
  CommentChange,
  handleUpdateTitle,
  handleUpdateContent,
  onPhotoDelete,
  onChangeFile,
}) => {
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [visibleComments, setVisibleComments] = useState(5); // 처음에 댓글 5개만 보이도록 설정
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMoreComments = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleComments((prevCount) => prevCount + 5); // 5개씩 추가로 보이도록 증가
      setIsLoadingMore(false);
    }, 10); // 로딩 시간
  };

  const handleLikeButtonClick = (boardNo) => {
    // 이미 좋아요한 경우
    if (likeBoardSet && likeBoardSet.includes(parseInt(boardNo))) {
      handleUnlike(boardNo);
    } else {
      // 좋아요 안한 경우
      handleLike(boardNo);
      setFloatingHearts((prev) => [...prev, { id: Date.now() }]);
    }
  };

  const removeHeart = (id) => {
    setFloatingHearts((prev) => prev.filter((heart) => heart.id !== id));
  };

  const contentBoxRef = useRef(null); // ContentBox 요소에 대한 ref 생성

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    const contentBox = contentBoxRef.current;

    if (contentBox) {
      // 스크롤 가능한 높이에서 현재 스크롤 위치를 빼서, 아래로 남은 공간을 계산
      const remainingSpace =
        contentBox.scrollHeight -
        (contentBox.scrollTop + contentBox.clientHeight);

      // 아래로 스크롤할 때 추가 댓글을 로드하려면, 남은 공간이 어느 정도 이하로 남았을 때 로드를 시작할 것인지 설정
      if (remainingSpace < 200) {
        // 남은 공간이 일정 수준 이하일 때 추가 댓글 로드 시작
        loadMoreComments();
      }
    }
  }, [loadMoreComments]);

  // ContentBox에 스크롤 이벤트 리스너 추가
  useEffect(() => {
    const contentBox = contentBoxRef.current;
    if (contentBox) {
      contentBox.addEventListener('scroll', handleScroll);
    }

    return () => {
      // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
      if (contentBox) {
        contentBox.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <Container>
      <ContentBox ref={contentBoxRef}>
        <BoardDetail>
          <form>
            <ButtonContainer>
              <Link to={`/board/list?category=1`}>
                <StyledButton onClick={onNavigateToList}>⬅️목록</StyledButton>
              </Link>
              {board?.writer?.no === user?.no && (
                <EditDeleteButtonContainer>
                  <StyledButton onClick={onEdit}>📝수정</StyledButton>
                  <StyledButton onClick={onDelete}>❌️삭제</StyledButton>
                </EditDeleteButtonContainer>
              )}
            </ButtonContainer>
            <MetaInfo>
              <span className="nickname">
                {board && board.writer ? board.writer.nick : 'Unknown'}
              </span>
              <ClockIcon src="/images/clock.png" alt="clock-icon" />
              <span>
                {board && board.createdAt
                  ? new Date(board.createdAt).toLocaleDateString()
                  : 'Unknown date'}
              </span>
              <ClockIcon src="/images/eye.png" alt="views-icon" />
              <span>{board ? board.viewCount : 0}</span>
            </MetaInfo>
            <Title>
              <StyledInput
                type="text"
                defaultValue={board ? board.title : ''}
                onChange={handleUpdateTitle}
              />
            </Title>
            <StyledTextArea
              defaultValue={board ? board.content : ''}
              onChange={handleUpdateContent}
            ></StyledTextArea>
            <div>
              {board && board.attachedFiles
                ? board.attachedFiles.map((file, index) => (
                    <div key={index}>
                      <a
                        href={`https://kr.object.ncloudstorage.com/bitcamp-nc7-bucket-14/sns_board/${file.filePath}`}
                      >
                        <StyledImage
                          src={`https://kr.object.ncloudstorage.com/bitcamp-nc7-bucket-14/sns_board/${file.filePath}`}
                          alt="Attached file"
                        />
                      </a>

                      {user.no === board.writer.no ? (
                        <div>
                          <a href="#" onClick={() => onPhotoDelete(file.no)}>
                            X
                          </a>
                        </div>
                      ) : null}
                    </div>
                  ))
                : null}
              <FileInputWrapper>
                <FileInputLabel>
                  파일 선택
                  <FileInput type="file" onChange={onChangeFile} />
                </FileInputLabel>
                &nbsp;&nbsp;파일을 선택해 주세요
              </FileInputWrapper>
            </div>
          </form>
          <BoardDetailWrapper>
            <LikeButton onClick={() => handleLikeButtonClick(boardNo)}>
              {likeBoardSet && likeBoardSet.includes(parseInt(boardNo))
                ? '️❤️'
                : '🤍'}
            </LikeButton>
            <FloatingHeartsContainer>
              {floatingHearts.map((heart) => (
                <FloatingHeart
                  key={heart.id}
                  onComplete={() => removeHeart(heart.id)}
                />
              ))}
            </FloatingHeartsContainer>
          </BoardDetailWrapper>
        </BoardDetail>

        <CommentsSection>
          <CommentInputContainer>
            <InputWithButtonContainer>
              <CommentTextArea
                name="content"
                placeholder="댓글을 입력하세요."
                value={content}
                onChange={CommentChange}
              />
              <SubmitButton type="submit" onClick={onSubmit}>
                등록하기
              </SubmitButton>
            </InputWithButtonContainer>
          </CommentInputContainer>

          {comments && comments.length > 0
            ? comments.slice(0, visibleComments).map((boardComment) => (
                <CommentContainer key={boardComment.id}>
                  <CommentMeta>
                    <div style={{ display: 'flex' }}>
                      <ProfileImage
                        src={
                          boardComment.writer.photo
                            ? `http://gjoxpfbmymto19010706.cdn.ntruss.com/sns_member/${boardComment.writer.photo}?type=f&w=270&h=270&faceopt=true&ttype=jpg`
                            : '/images/avatar.png'
                        }
                        alt="profile"
                      />
                      <span>
                        {boardComment && boardComment.writer
                          ? boardComment.writer.nick
                          : 'Unknown'}
                      </span>
                    </div>
                    <DateDeleteButtonContainer>
                      {boardComment.writer.no === user.no && (
                        <DeleteText
                          onClick={() => onDeleteComment(boardComment.no)}
                        >
                          삭제
                        </DeleteText>
                      )}
                      <CommentDate>
                        {boardComment && boardComment.createdAt
                          ? new Date(
                              boardComment.createdAt
                            ).toLocaleDateString()
                          : 'Unknown date'}
                      </CommentDate>
                    </DateDeleteButtonContainer>
                  </CommentMeta>
                  <CommentContent>
                    {boardComment ? boardComment.content : ''}
                  </CommentContent>
                </CommentContainer>
              ))
            : null}

          {comments && comments.length > visibleComments && (
            <LoadMoreCommentsContainer onClick={loadMoreComments}>
              <ArrowIcon>&darr;</ArrowIcon>
              댓글 더보기
            </LoadMoreCommentsContainer>
          )}
        </CommentsSection>
      </ContentBox>
    </Container>
  );
};

export default BoardDetailComponent;
