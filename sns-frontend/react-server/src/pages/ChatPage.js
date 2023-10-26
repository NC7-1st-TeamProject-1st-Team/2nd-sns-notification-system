import ChatContainer from '../containers/chat/ChatContainer';
import HeaderContainer from '../containers/common/HeaderContainer';
import ChatRoomListContainer from '../containers/chat/ChatRoomListContainer';
import FooterContainer from '../containers/common/FooterContainer';
const ChatPage = () => {
  return (
    <>
      <HeaderContainer />
      <div style={{ display: 'flex' }}>
        <ChatRoomListContainer />
        <ChatContainer />
      </div>
      <FooterContainer />
    </>
  );
};

export default ChatPage;
