import styled from 'styled-components';
import Responsive from './Responsive';
import Button from './Button';
import { Link } from 'react-router-dom';

const HeaderBlock = styled.div`
  position: fixed;
  width: 100%;
  background: white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.8);
  z-index: 100;

  .logo {
    height: 75px;
  }
`;

const Wrapper = styled(Responsive)`
  height: 1rem;
  background-color: white;
  color: #426b1f;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  margin-top: 50px;
  margin-bottom: 30px;
`;

const Spacer = styled.div`
  height: 8rem;
`;

const HeaderNav = styled.div`
  display: flex;
  gap: 20px;

  a {
    text-decoration: none;
    color: #426b1f;
    font-weight: bold;
    font-size: 1rem;
    padding: 10px 10px;
    border-radius: 5px;
    transition: background-color 0.3s, color 0.3s;
  }
  a:hover {
    background-color: #426b1f;
    color: white;
  }
`;

const HeaderProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;

  .headerUserNick {
    font-weight: bold;
    font-size: 20px;
  }

  .logout a {
    font-weight: bold;
    background-color: #426b1f;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 10px;
    cursor: pointer;
    margin-right: 10px;
    white-space: nowrap;
    text-decoration-line: none;
    font-size: 14px;
  }

  .logout a:hover {
    background-color: #5d962c;
    color: white;
  }
`;

const HeaderNotificationIcon = styled.img`
  height: 20px;
`;
const HeaderUserIcon = styled.img`
  height: 30px;
  border-radius: 50%;
`;

const Header = ({ user, onLogout }) => {

  if (user == null) {
    return <div>로그인이 필요합니다</div>;
  }

  const myPage = { no: 10 }; // 테스트용 임시 데이터
  // const myPage = null;
  const notReadNotiCount = 10;
  const profileUrl = `http://gjoxpfbmymto19010706.cdn.ntruss.com/sns_member/${user.photo}?type=f&w=270&h=270&faceopt=true&ttype=jpg`;

  return (
    <>
      <HeaderBlock>
        <Wrapper>
          <Link to={`/myPage/${user.no}`}>
            <img src="/images/logo.png" alt="로고" class="logo" />
          </Link>
          <HeaderNav>
            <Link to={`/myPage/${user.no}`}>마이페이지</Link>
            <Link to="/board/list?category=1">게시글</Link>
            {myPage != null ? (
              <Link to={`/guestBook/${myPage.no}`}>방명록</Link>
            ) : (
              <Link to={`/guestBook/${user.no}`}>방명록</Link>
            )}
          </HeaderNav>
          <HeaderProfile>
            <Link to="/notification/list">
              <span id="notReadNotiCount">{notReadNotiCount}</span>
              <HeaderNotificationIcon src="/images/noti.png" alt="알림" />
            </Link>
            {user.photo != null ? (
              <Link to={profileUrl}>
                <HeaderUserIcon src={profileUrl} />
              </Link>
            ) : (
              <HeaderUserIcon src="/images/default.jpg" />
            )}

            <span class="headerUserNick">{user.nick}</span>
            <div class="logout">
              <Link onClick={onLogout}>로그아웃</Link>
            </div>
          </HeaderProfile>
        </Wrapper>
      </HeaderBlock>
      <Spacer />
    </>
  );
};

export default Header;
