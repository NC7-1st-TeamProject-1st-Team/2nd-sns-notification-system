import React, {useEffect} from 'react';
import MemberInfoComponent from '../../components/myPage/MemberInfoComponent';
import {useDispatch, useSelector} from 'react-redux';
import myPage, { list } from "../../modules/myPage";

const MemberInfoContainer = () => {
  const dispatch = useDispatch();
  const {user} = useSelector(({auth}) => ({
    user: auth.user,
  }));

  const {myPage, myPageError, userNo} = useSelector(({myPage}) => ({
    myPage: myPage.myPage,
    myPageError: myPage.myPageError,
    userNo: user.no,
  }));

  //컴포넌트 초기 렌터링 때 form 초기화
  useEffect(() => {
    dispatch(list(userNo));
  }, [dispatch, userNo]);

  // 에러가 발생하면 에러 메시지를 출력합니다.
  if (myPageError) {
    return <div>오류가 발생했습니다: {myPageError.message}</div>;
  }

  return (
      <MemberInfoComponent
          myPageData={myPage}
          user={user}/>
  );
};

export default MemberInfoContainer;