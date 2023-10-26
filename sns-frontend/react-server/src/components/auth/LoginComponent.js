import styled from 'styled-components';
import { Link } from 'react-router-dom';
import palette from '../../lib/styles/palette';
import Button from '../common/Button';
import AuthTemplate from './AuthTemplate';

const LoginForm = styled.form`
  align-self: flex-start;
  display: grid;
  justify-items: center;
  align-items: center;
  font-size: 1.2rem;

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

  .left-align {
    justify-self: start; /*전화번호 저장 왼쪽으로*/
    margin-left: 30px;
    margin-top: 10px;
    margin-bottom: 50px;
  }

  #login-error-msg-holder {
    width: 100%;
    height: 100%;
    display: grid;
    justify-items: center;
    align-items: center;
  }

  #login-error-msg {
    width: 23%;
    text-align: center;
    margin: 0;
    padding: 5px;
    font-size: 20px;
    font-weight: bold;
    color: black;
    opacity: 0;
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

const SubmitButton = styled(Button)`
  width: 90%;
  padding: 7px;
  border: none;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  background-color: #426b1f;
  cursor: pointer;
  outline: none;

  &:hover {
    background-color: #5d962c;
    color: white;
  }
`;

const LoginComponent = ({
  phoneNumber,
  password,
  onChange,
  onSubmit,
  authMessage,
  isChecked,
  setIsChecked,
}) => {
  return (
    <AuthTemplate>
      <img src="/images/logo.png" alt="로고" className="logo" />
      <div id="login-error-msg-holder">
        <p id="login-error-msg">{authMessage}</p>
      </div>
      <LoginForm onSubmit={onSubmit}>
        <StyledInput
          type="text"
          name="phoneNumber"
          placeholder="전화번호"
          value={phoneNumber}
          onChange={onChange}
        />
        <StyledInput
          type="password"
          name="password"
          placeholder="비밀번호"
          value={password}
          onChange={onChange}
        />
        <SubmitButton type="submit">로그인</SubmitButton>
        <label className="left-align">
          <input
            type="checkbox"
            name="savePhoneNumber"
            id="savePhoneNumber"
            checked={isChecked}
            onClick={(e) => {
              setIsChecked(e.target.checked);
            }}
          />
          전화번호 저장
        </label>

        <div className="between">
          <Link to="/auth/register" className="userField">
            🌱 회원가입
          </Link>
          <Link to="/auth/find" className="userField">
            🌱 비밀번호 찾기
          </Link>
        </div>
      </LoginForm>
    </AuthTemplate>
  );
};

export default LoginComponent;
