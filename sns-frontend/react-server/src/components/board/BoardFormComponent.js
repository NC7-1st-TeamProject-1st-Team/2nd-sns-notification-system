import React from 'react';
import styled from 'styled-components';

const BoardFormContainer = styled.div`
  padding: 20px;
  background-color: #fafaf5;
  width: 700px;
  margin: auto;
`;

const TitleStyle = styled.h1`
  text-align: center;
`;

const StyledForm = styled.form`
  // text-align: center;
`;

const StyledInput = styled.input`
  box-sizing: border-box;
  width: 641px;
  height: 42px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.17);
  margin: 10px auto;
  display: block;

  &[name='title'] {
    font-size: 25px;
  }
`;

const FileInputWrapper = styled.div`
  position: relative;
  font-size: 12px;
  margin-left: 30px;
  margin-top: 20px;
`;

const FileInputLabel = styled.label`
  background-color: #d3d3d3;
  color: light-gray;
  padding: 8px 8px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.65rem;
  margin-left: 0px;
  margin-right: 5px;
  &:hover {
    background-color: #426b1f;
    color: white;
  }
`;

const FileInput = styled.input`
  display: none;
  // position: absolute;
  // top: 0;
  // left: 0;
  // width: 100%;
  // height: 100%;
  // opacity: 0;
  // cursor: pointer;

  box-sizing: border-box;
  width: 641px;
  height: 42px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.17);
  // margin: 10px auto;
  // display: block;
`;

const StyledTextarea = styled.textarea`
  box-sizing: border-box;
  width: 641px;
  height: 500px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.17);
  margin: 10px auto;
  display: block;
  font-size: 20px;
`;

const StyledButton = styled.button`
  width: 100px;
  height: 41px;
  background: #426b1f;
  border-radius: 8px;
  color: #ffffff;
  font-weight: 600;
  font-size: 16px;
  line-height: 130%;
  display: block;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  margin: 10px auto;
`;

const BoardFormComponent = ({
  title,
  content,
  files,
  category,
  onChange,
  onChangeFile,
  onSubmit,
}) => {
  return (
    <BoardFormContainer>
      <TitleStyle>🌱글쓰기🌱</TitleStyle>
      <StyledForm>
        <StyledInput
          type="text"
          name="title"
          placeholder="제목을 입력하세요"
          value={title || ''} // 예외 처리 추가
          onChange={onChange}
        />
        <StyledTextarea
          name="content"
          placeholder="내용을 입력하세요"
          value={content || ''} // 예외 처리 추가
          onChange={onChange}
        />
        {/* <StyledInput
          type="file"
          name="files"
          multiple
          placeholder="파일을 선택하세요"
          value={files || ''} // 예외 처리 추가
          onChange={onChangeFile}
        /> */}
        <FileInputWrapper>
          <FileInputLabel>
            파일 선택
            <FileInput
              type="file"
              name="files"
              multiple
              value={files || ''} // 예외 처리 추가
              onChange={onChangeFile}
            />
          </FileInputLabel>
          <span id="fileSelected">
            <span id="fileLabelText">파일 선택해주세요</span>
          </span>
        </FileInputWrapper>
        <StyledButton type="submit" onClick={onSubmit}>
          등록
        </StyledButton>
      </StyledForm>
    </BoardFormContainer>
  );
};

export default BoardFormComponent;
