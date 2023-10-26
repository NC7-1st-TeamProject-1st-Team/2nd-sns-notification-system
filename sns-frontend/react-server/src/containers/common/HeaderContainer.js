import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Header from '../../components/common/Header';
import { check, logout } from '../../modules/auth';
import { useEffect } from 'react';
import {
  getNotReadNotiCount,
  initializeNoti,
} from '../../modules/notification';

const HeaderContainer = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['sessionId']);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, myPage, notReadNotiCount, authMessage } = useSelector(
    ({ auth, notification, myPage }) => ({
      user: auth.user,
      myPage: myPage.myPage,
      notReadNotiCount: notification.notReadNotiCount,
      authMessage: auth.authMessage,
    })
  );

  const onLogout = (e) => {
    e.preventDefault();
    setCookie('sessionId', '');
    removeCookie('sessionId');
    dispatch(logout());
    dispatch(initializeNoti());
  };

  useEffect(() => {
    if (user && notReadNotiCount == null) {
      dispatch(getNotReadNotiCount({ memberNo: user.no }));
    }
  }, [user, notReadNotiCount]);

  useEffect(() => {
    if (authMessage === 'logoutSuccess') {
      navigate(`/`);
    }
  }, [authMessage]);

  useEffect(() => {
    if (user?.photo !== myPage?.photo) {
      dispatch(check());
    }
  }, [myPage]);

  return (
    <Header
      user={user}
      myPage={myPage}
      notReadNotiCount={notReadNotiCount}
      onLogout={onLogout}
    />
  );
};

export default HeaderContainer;
