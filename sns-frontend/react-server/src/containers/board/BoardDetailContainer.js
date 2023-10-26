import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import BoardDetailComponent from '../../components/board/BoardDetailComponent';
import {
  changeField,
  initializeForm,
  detail,
  addComment,
  deleteBoard,
  deleteComment,
  update,
  deletePhoto,
} from '../../modules/board';
import { boardlike, boardunlike } from '../../modules/auth';

const BoardDetailContainer = () => {
  const dispatch = useDispatch();
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateContent, setUpdateContent] = useState('');

  const boardDefault = {
    title: 'Loading...',
    content: 'Loading...',
    writer: {
      nick: 'Loading...',
    },
    attachedFiles: [],
    editable: false,
    viewCount: 0,
    createdAt: new Date().toISOString(),
  };

  const commentDefault = {
    content: 'Loading...',
    writer: {
      nick: 'Loading...',
    },
    createdAt: new Date().toISOString(),
  };

  const {
    board = boardDefault,
    comments = Array(5).fill(commentDefault),
    boardError,
    user,
    likeBoardSet,
    files,
  } = useSelector((state) => ({
    board: state.board.board,
    comments: state.board.comments,
    boardError: state.board.boardError,
    user: state.auth.user,
    likeBoardSet: state.auth.likeBoardList,
    files: state.board.attachedFiles,
  }));

  const { boardNo, category } = useParams();

  const onChange = ({ key, value }) => {
    dispatch(changeField({ key, value }));
  };

  const handleUpdateTitle = (e) => setUpdateTitle(e.target.value);

  const handleUpdateContent = (e) => setUpdateContent(e.target.value);

  let updateData = new FormData();
  updateData.append('files', null);
  const onChangeFile = (e) => {
    const { files } = e.target;
    updateData = new FormData();
    for (let i = 0; files[i] != null; i++) {
      updateData.append('files', files[i]);
    }

    const selectedFileNames = Array.from(files).map((file) => file.name);
    const fileSelectedElement = document.getElementById('fileSelected');
    fileSelectedElement.textContent = `${selectedFileNames.join(', ')}`;
  };

  const onEdit = (e) => {
    e.preventDefault();
    const updatedTitle = updateTitle || board.title;
    const updatedContent = updateContent || board.content;

    updateData.append(
      'data',
      new Blob(
        [
          JSON.stringify({
            no: boardNo,
            title: updatedTitle,
            content: updatedContent,
            attachFiles: files,
            writer: user,
          }),
        ],
        {
          type: 'application/json',
        }
      )
    );
    dispatch(update({ updateData }));
    dispatch(detail({ category, boardNo })); // 다시 상세 정보를 불러옴
  };

  //게시글초기화
  const onReset = () => {
    dispatch(initializeForm()); // 상태를 초기화
    dispatch(detail({ category, boardNo })); // 다시 상세 정보를 불러옴
  };

  //게시글삭제
  const onDelete = (e) => {
    e.preventDefault();
    dispatch(deleteBoard({ boardNo, category }));
    navigate(`/board/list?category=${category}`); // 삭제 후 리스트로 페이지 이동
  };

  // 사진 삭제
  const onPhotoDelete = async (fileNo) => {
    await dispatch(deletePhoto({ fileNo }));
    // 삭제 작업이 완료되면 페이지를 새로 고침
    window.location.reload();
  };

  //댓글
  //댓글작성
  const onSubmit = (e) => {
    e.preventDefault();
    const commentData = {
      boardNo: parseInt(boardNo, 10),
      content,
      writer: user,
    };
    dispatch(addComment(commentData));
    dispatch(detail({ category, boardNo })); // 페이지 다시 불러서 새로고침 효과
    setContent(''); // 입력 필드 초기화
  };

  //댓글삭제
  const onDeleteComment = (commentNo) => {
    dispatch(deleteComment({ commentNo, boardNo }));
    dispatch(detail({ category, boardNo })); // 페이지 다시 불러서 새로고침 효과
  };

  const CommentChange = (e) => {
    setContent(e.target.value);
  };

  // 좋아요
  const handleLike = (boardNo) => {
    dispatch(boardlike(boardNo));
  };
  const handleUnlike = (boardNo) => {
    dispatch(boardunlike(boardNo));
  };

  useEffect(() => {
    dispatch(detail({ category, boardNo }));
  }, [dispatch, category, boardNo]);

  if (boardError) {
    return <div>Error occurred: {boardError.message}</div>;
  }

  return (
    <BoardDetailComponent
      user={user}
      board={board}
      comments={comments}
      content={content}
      onSubmit={onSubmit}
      onChange={onChange}
      onEdit={onEdit}
      onReset={onReset}
      onDelete={onDelete}
      onDeleteComment={onDeleteComment}
      CommentChange={CommentChange}
      boardNo={boardNo}
      handleLike={handleLike}
      handleUnlike={handleUnlike}
      likeBoardSet={likeBoardSet}
      handleUpdateTitle={handleUpdateTitle}
      handleUpdateContent={handleUpdateContent}
      onPhotoDelete={onPhotoDelete}
      onChangeFile={onChangeFile}
    />
  );
};

export default BoardDetailContainer;
