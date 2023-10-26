import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeField,
  info,
  initializeForm,
  update,
} from '../../modules/myPage';
import { useNavigate, useParams } from 'react-router-dom';
import MemberInfoUpdateComponent from '../../components/myPage/MemberInfoUpdateComponent';
import { check, deleteMember } from '../../modules/auth';
import MyPageModal from '../../components/common/MyPageModal';

const MemberInfoUpdateContainer = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userNo } = useParams();

  const [updateNick, setUpdateNick] = useState('');
  const [updateBirthday, setUpdateBirthday] = useState('');
  const [updateEmail, setUpdateEmail] = useState('');
  const [updatePhoneNumber, setUpdatePhoneNumber] = useState('');
  const [updatePassword, setUpdatePassword] = useState('');
  const [updateGender, setUpdateGender] = useState('');
  const [updateStateMessage, setUpdateStateMessage] = useState('');

  const { user, myPage, myPageError } = useSelector((state) => ({
    user: state.auth.user,
    myPage: state.myPage.myPage,
    myPageError: state.myPage.myPageError,
  }));

  //컴포넌트 초기 렌터링 때 form 초기화
  useEffect(() => {
    dispatch(info(userNo));
  }, [dispatch, userNo]);

  // 인풋 변경 이벤트 핸들러
  const onChange = ({ key, value }) => {
    dispatch(changeField({ key, value }));
  };

  //게시글초기화
  const onReset = () => {
    dispatch(initializeForm()); // 상태를 초기화
    dispatch(info(userNo)); // 다시 상세 정보를 불러옴
  };

  const handleUpdateNick = (e) => setUpdateNick(e.target.value);
  const handleUpdateBirthday = (e) => setUpdateBirthday(e.target.value);
  const handleUpdateEmail = (e) => setUpdateEmail(e.target.value);
  const handleUpdatePhoneNumber = (e) => setUpdatePhoneNumber(e.target.value);
  const handleUpdatePassword = (e) => setUpdatePassword(e.target.value);
  const handleUpdateGender = (e) => setUpdateGender(e.target.value);
  const handleUpdateStateMessage = (e) => setUpdateStateMessage(e.target.value);

  let updateData = new FormData();
  updateData.append('files', null);
  const onChangeFile = (e) => {
    const { files } = e.target; // input 요소의 파일 목록을 가져옴
    updateData = new FormData();
    updateData.append('files', files[0]);
  };

  // 폼 등록 이벤트 핸들러
  const onSubmit = async (e) => {
    e.preventDefault();
    const updatedNick = updateNick || myPage.nick;
    const updatedBirthday = updateBirthday || myPage.birthday;
    const updatedEmail = updateEmail || myPage.email;
    const updatedPhoneNumber = updatePhoneNumber || myPage.phoneNumber;
    const updatedPassword = updatePassword || myPage.password;
    const updatedGender = updateGender || myPage.gender;
    const updatedStateMessage = updateStateMessage || myPage.stateMessage;


    updateData.append(
        'data',
        new Blob(
            [
              JSON.stringify({
                no: parseInt(userNo, 10),
                name: myPage.name,
                nick: updatedNick,
                birthday: updatedBirthday,
                email: updatedEmail,
                phoneNumber: updatedPhoneNumber,
                password: updatedPassword,
                gender: updatedGender,
                stateMessage: updatedStateMessage,
              }),
            ],
            {
              type: 'application/json',
            }
        )
    );
    try {
      await dispatch(update({ updateData, userNo }));
      // 업데이트가 성공하면 모달을 닫음
      onClose();
      navigate(`/myPage/${userNo}`);
    } catch (error) {
      console.error('업데이트 오류:', error);
    }
  };

  // 회원 삭제
  const onDelete = (e) => {
    e.preventDefault();
    dispatch(deleteMember(userNo));
    navigate(`/auth/login`);
  };

  return (
      <MyPageModal onClose={onClose}>
        <MemberInfoUpdateComponent
            user={user}
            myPageData={myPage}
            myPageError={myPageError}
            onChange={onChange}
            onSubmit={onSubmit}
            onDelete={onDelete}
            onReset={onReset}
            onChangeFile={onChangeFile}
            handleUpdateNick={handleUpdateNick}
            handleUpdateBirthday={handleUpdateBirthday}
            handleUpdateEmail={handleUpdateEmail}
            handleUpdatePhoneNumber={handleUpdatePhoneNumber}
            handleUpdatePassword={handleUpdatePassword}
            handleUpdateGender={handleUpdateGender}
            handleUpdateStateMessage={handleUpdateStateMessage}
        />
      </MyPageModal>
  );
};
export default MemberInfoUpdateContainer;
