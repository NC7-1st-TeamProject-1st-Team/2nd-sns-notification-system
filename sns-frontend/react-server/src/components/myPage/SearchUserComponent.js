import styled from 'styled-components';
import Button from '../common/Button';

const DetailForm = styled.div`
  .between {
    display: flex;
    justify-content: space-between;
  }

  .userField {
    display: inline-block;
    height: 30px;
    margin: 0 1rem;
    text-align: center;
  }

  /* 친구 검색 버튼 */
  .search_btn {
    font-size: 20px;
    background-color: #426b1f;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    cursor: pointer;
    white-space: nowrap;
    text-decoration-line: none;
    margin: 20px 20px 20px 10px;
    &:hover {
      cursor: pointer;
    }
  }

  /* 팔로잉, 팔로워 리스트 관련 */
  .list_form {
    width: 140%;
    /*padding: 20px;*/
    background-color: #fff;
    border-radius: 5px; /* 박스를 둥글게 만들기 위해 추가 */
    /*margin: -30px;*/
  }

  /* 팔로잉, 팔로워 목록 관련 */
  .form-list {
    width: 500px;
    margin-top: -50px;
    margin-left: 250px; /* 가운데 정렬을 위해 수정 */
    position: relative; /* 부모 위치 기준으로 설정하기 위해 추가 */
  }
`;
const StyledInput = styled.input`
  border: none;
  border-bottom: 1px solid #fafaf5;
  margin-bottom: 10px;
  border-radius: 3px;
  outline: none;
  padding: 0px 0px 5px 5px;
  height: 60px;
  width: 420px;

  ::placeholder {
    color: #3a3a3a;
`;

// SubmitButton을 수정하여 styled(Button)으로 정의
const SubmitButton = styled(Button)`
  width: 5rem;
  padding: 7px;
  border: none;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  background-color: #426b1f;
  cursor: pointer;
  outline: none;
  &:hover {
    cursor: pointer;
  }
`;

const SearchUserComponent = ({ searchTxt, onSubmitSearch, onChange }) => {
  return (
    <DetailForm>
      <StyledInput
        type="text"
        name="searchTxt"
        value={searchTxt}
        placeholder="이름을 입력해주세요."
        onChange={onChange}
      />
      <label className="search_btn">
        <SubmitButton type="submit" onClick={onSubmitSearch}>
          검색
        </SubmitButton>
      </label>
    </DetailForm>
  );
};

export default SearchUserComponent;
