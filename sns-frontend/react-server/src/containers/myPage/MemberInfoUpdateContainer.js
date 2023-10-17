import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeField,
  changeMyPageField,
  info,
  initializeForm,
  update
} from '../../modules/myPage';
import { useNavigate, useParams } from 'react-router-dom';
import MemberInfoUpdateComponent
  from '../../components/myPage/MemberInfoUpdateComponent';

const MemberInfoUpdateContainer = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userNo } = useParams();

    const [updateNick, setUpdateNick] = useState('');
    const [updateBirthday, setUpdateBirthday] = useState('');
    const [updateEmail, setUpdateEmail] = useState('');
    const [updatePhoneNumber, setUpdatePhoneNumber] = useState('');
    const [updatePassword, setUpdatePassword] = useState('');
    const [updateGender, setUpdateGender] = useState('');

    const { user, myPage, myPageError } = useSelector(
      (state) => ({
        user: state.auth.user,
        myPage: state.myPage.myPage,
        myPageError: state.myPage.myPageError
      })
    );

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
      dispatch(initializeForm());  // 상태를 초기화
      dispatch(info(userNo));  // 다시 상세 정보를 불러옴
    };

    const handleUpdateNick = (e) => setUpdateNick(e.target.value);
    const handleUpdateBirthday = (e) => setUpdateBirthday(e.target.value);
    const handleUpdateEmail = (e) => setUpdateEmail(e.target.value);
    const handleUpdatePhoneNumber = (e) => setUpdatePhoneNumber(e.target.value);
    const handleUpdatePassword = (e) => setUpdatePassword(e.target.value);
    const handleUpdateGender = (e) => setUpdateGender(e.target.value);

    let updateData = new FormData();
    updateData.append('files', null);
    const onChangeFile = (e) => {
      const { files } = e.target; // input 요소의 파일 목록을 가져옴
      updateData = new FormData();
      updateData.append('files', files[0]);
    };

    // 폼 등록 이벤트 핸들러
    const onSubmit = (e) => {
      e.preventDefault();
      const updatedNick = updateNick || myPage.nick;
      const updatedBirthday = updateBirthday || myPage.birthday;
      const updatedEmail = updateEmail || myPage.email;
      const updatedPhoneNumber = updatePhoneNumber || myPage.phoneNumber;
      const updatedPassword = updatePassword || myPage.password;
      const updatedGender = updateGender || myPage.gender;

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
            })
          ],
          {
            type: 'application/json'
          }
        )
      );
      dispatch(update({ updateData, userNo }));
      navigate(`/myPage/${userNo}`);
    };

    return (
      <MemberInfoUpdateComponent
        myPageData={myPage}
        myPageError={myPageError}
        onChange={onChange}
        onSubmit={onSubmit}
        onReset={onReset}
        onChangeFile={onChangeFile}
        handleUpdateNick={handleUpdateNick}
        handleUpdateBirthday={handleUpdateBirthday}
        handleUpdateEmail={handleUpdateEmail}
        handleUpdatePhoneNumber={handleUpdatePhoneNumber}
        handleUpdatePassword={handleUpdatePassword}
        handleUpdateGender={handleUpdateGender}
      />
    );
  }
;

export default MemberInfoUpdateContainer;
