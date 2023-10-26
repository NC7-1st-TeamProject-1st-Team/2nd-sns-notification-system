import styled from 'styled-components';
import Button from '../common/Button';
import AuthTemplate from './AuthTemplate';
import { Link } from 'react-router-dom';

const FindForm = styled.div`
  align-self: flex-start;
  display: grid;
  justify-items: center;
  align-items: center;
  font-size: 1.2rem;
`;

const StyledTable1 = styled.table`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 100px;
`;

const StyledTable2 = styled.table`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
`;

const StyledLabel = styled.label`
  width: 200px;
`;

const ResultText = styled.p`
  color: black;
  font-weight: normal;
  margin-top: 1px;
  margin-right: 80px;
`;

const NewPasswordForm = styled.div`
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: center;
  //margin-left: 300px;
`;

const StyledInput = styled.input`
  border: 1px solid #ccc;
  margin: 5px;
  border-radius: 3px;
  padding: 10px;
  width: 80%;
  max-width: 300px;

  ::placeholder {
    color: #3a3a3a;
  }
`;

const SubmitButton = styled(Button)`
  margin-left: 30px;
  width: 220px;
  padding: 10px 20px;
  background-color: #426b1f;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: normal;

  &:hover {
    background-color: #5d962c;
  }
`;

const CommonButton = styled(Button)`
  padding: 10px 20px;
  background-color: #426b1f;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 160px;
  margin-left: 25px;
  margin-bottom: 100px;
  margin-top: 80px;
  font-weight: normal;

  &:hover {
    background-color: #5d962c;
  }
`;

const PwFindComponent = ({
  phoneNumber,
  password,
  verificationCode,
  verificationState,
  authMessage,
  onChange,
  onAuthPhoneNumber,
  onCheckPhoneNumber,
  onResetPassword,
}) => {
  return (
    <AuthTemplate>
      <StyledTable1>
        <h1>비밀번호 찾기</h1>
      </StyledTable1>
      <FindForm>
        <StyledTable2>
          <FlexDiv>
            <StyledLabel>🌱 전화번호</StyledLabel>
            <StyledInput
              type="text"
              name="phoneNumber"
              placeholder="전화번호를 입력하세요"
              value={phoneNumber}
              onChange={onChange}
            />
            <SubmitButton onClick={onAuthPhoneNumber}>
              인증번호 전송
            </SubmitButton>
          </FlexDiv>
          <FlexDiv>
            <StyledLabel>🌱 인증번호</StyledLabel>
            <StyledInput
              type="text"
              placeholder="인증번호를 입력하세요"
              name="verificationCode"
              value={verificationCode}
              onChange={onChange}
            />
            <SubmitButton id="verifyCode" onClick={onCheckPhoneNumber}>
              인증번호 확인
            </SubmitButton>
          </FlexDiv>
          <ResultText id="verifyresult">{authMessage}</ResultText>
        </StyledTable2>
        {verificationState ? (
          <NewPasswordForm id="newPasswordForm">
            <FlexDiv>
              <StyledLabel>🌱 새 비밀번호</StyledLabel>
              <StyledInput
                type="password"
                name="password"
                placeholder="새로운 비밀번호를 입력하세요"
                value={password}
                onChange={onChange}
              />
              <SubmitButton id="changePassword" onClick={onResetPassword}>
                비밀번호 변경
              </SubmitButton>
            </FlexDiv>
          </NewPasswordForm>
        ) : null}

        <Link to="/auth/login">
          <CommonButton>돌아가기</CommonButton>
        </Link>
      </FindForm>
    </AuthTemplate>
  );
};

export default PwFindComponent;
