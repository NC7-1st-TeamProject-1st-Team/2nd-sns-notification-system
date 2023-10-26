import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70%;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  pointer-events: none; /* 모달 외부 이벤트 허용 */
`;

const ModalContent = styled.div`
  background-color: transparent;
  border-radius: 8px;
  padding: 20px;
  width:500px;
  position: absolute; 
  top: 70px;
  right: 1px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-end; 
  pointer-events: auto; /* 모달 내부 이벤트 허용 */
`;

const MoreButton = styled(Link)`
  background-color: #426b1f;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  cursor:pointer;
  pointer-events: auto; /* 모달 내부 이벤트 허용 */
  margin-left: 390px;
`;


const ContentWrapper = styled.div`
  max-width: 400px; 
  width: 100%;
`;

const Modal = ({ onClose, children }) => {
  return (
      <ModalOverlay>
        <ModalContent>
          <ContentWrapper>
            {children}
          </ContentWrapper>
          <ButtonContainer>
            <MoreButton to="/notification/list">더보기 ➜</MoreButton>
          </ButtonContainer>
        </ModalContent>
      </ModalOverlay>
  );
};

export default Modal;