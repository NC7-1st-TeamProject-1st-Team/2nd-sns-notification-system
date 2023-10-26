import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import BoardFormComponent from '../../components/board/BoardFormComponent';
import { useEffect } from 'react';
import { changeField, initializeForm, form } from '../../modules/board';

const BoardFormContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { category, title, content, files, boardError, board, user } =
    useSelector(({ board, auth }) => ({
      category: board.category,
      title: board.title,
      content: board.content,
      files: board.attachedFiles,
      boardError: board.boardError,
      board: board.board,
      user: auth.user,
    }));

  const onChange = (e) => {
    const { value, name } = e.target;
    dispatch(
      changeField({
        key: name,
        value,
      })
    );
  };

  let formData = new FormData();
  formData.append('files', null);
  const onChangeFile = (e) => {
    const { files } = e.target;
    formData = new FormData();
    for (let i = 0; files[i] != null; i++) {
      formData.append('files', files[i]);
    }

    const selectedFileNames = Array.from(files).map((file) => file.name);
    const fileSelectedElement = document.getElementById('fileSelected');
    fileSelectedElement.textContent = `${selectedFileNames.join(', ')}`;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    formData.append(
      'data',
      new Blob(
        [
          JSON.stringify({
            title,
            content,
            files,
            category,
            writer: user,
          }),
        ],
        {
          type: 'application/json',
        }
      )
    );
    dispatch(form({ formData }));
    dispatch(initializeForm());
  };

  //컴포넌트 초기 렌터링 때 form 초기화
  useEffect(() => {
    dispatch(initializeForm());
  }, [dispatch]);

  useEffect(() => {
    if (boardError) {
      console.log('게시글 등록 중 오류 발생');
      console.log(boardError);
      // 필요한 경우 사용자에게 오류 메시지를 표시할 수 있습니다.
    }
    if (board) {
      console.log('게시글 등록 성공');
      console.log(board);
      navigate(`/board/list`);
    }
  }, [board, boardError, dispatch]);

  return (
    <BoardFormComponent
      title={title}
      content={content}
      files={files}
      category={category}
      onChange={onChange}
      onChangeFile={onChangeFile}
      onSubmit={onSubmit}
    />
  );
};

export default BoardFormContainer;
