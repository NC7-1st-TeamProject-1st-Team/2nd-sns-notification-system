import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명한 검은 배경색 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
 // pointer-events: none; /* 모달 외부 이벤트 허용 */
`;

// const ModalContent = styled.div`
//   background-color: black;
//   border-radius: 8px;
//   //padding: 20px;
//   width:500px;
//   position: absolute;
//   top: 70px;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   pointer-events: auto;
// `;

const ButtonContainer = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  pointer-events: auto; /* 모달 내부 이벤트 허용 */
`;

const CloseButton = styled.button`
  background-color: #426b1f;
  color: white;
  border: none;
  border-radius:50%;
  cursor: pointer;
  font-size: 28px;
  position: absolute;
  margin-left: 650px;
  top: 10px;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

const ContentWrapper = styled.div`
  max-width: 400px; 
  width: 100%;
  position: relative;
  margin-right:400px;
`;

const MyPageModal = ({ onClose, isOpen, children }) => {
  return (
      <ModalOverlay>
        <ContentWrapper>
          {children}
          <CloseButton onClick={onClose}>✖</CloseButton>
        </ContentWrapper>
      </ModalOverlay>
  );
};

export default MyPageModal;