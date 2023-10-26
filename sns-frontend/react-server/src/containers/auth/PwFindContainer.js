import { useDispatch, useSelector } from 'react-redux';
import PwFindComponent from '../../components/auth/PwFindComponent';
import {
  changeField,
  checkAuthCode,
  getAuthCode,
  resetPassword,
} from '../../modules/auth';

const PwFindContainer = () => {
  const dispatch = useDispatch();
  const {
    phoneNumber,
    password,
    verificationCode,
    verificationState,
    authError,
    authMessage,
  } = useSelector(({ auth }) => ({
    phoneNumber: auth.phoneNumber,
    password: auth.password,
    verificationCode: auth.verificationCode,
    verificationState: auth.verificationState,
    authError: auth.authError,
    authMessage: auth.authMessage,
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

  const onAuthPhoneNumber = (e) => {
    e.preventDefault();
    dispatch(getAuthCode({ phoneNumber, requestType: 'findPassword' }));
  };

  const onCheckPhoneNumber = (e) => {
    e.preventDefault();
    dispatch(checkAuthCode({ phoneNumber, verificationCode }));
  };

  const onResetPassword = () => {
    dispatch(resetPassword({ phoneNumber, password, verificationCode }));
  };

  return (
    <PwFindComponent
      phoneNumber={phoneNumber}
      password={password}
      verificationCode={verificationCode}
      verificationState={verificationState}
      authMessage={authMessage}
      onChange={onChange}
      onAuthPhoneNumber={onAuthPhoneNumber}
      onCheckPhoneNumber={onCheckPhoneNumber}
      onResetPassword={onResetPassword}
    />
  );
};

export default PwFindContainer;
