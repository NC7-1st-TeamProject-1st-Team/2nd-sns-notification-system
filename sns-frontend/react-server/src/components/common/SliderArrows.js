import React from 'react';

const arrowStyle = {
  color: '#426b1f', // 텍스트 색상
  fontSize: '10px', // 화살표 크기를 40px로 키웁니다.
  cursor: 'pointer',
  //padding: '8px 16px', // 버튼 패딩
  backgroundColor: '#426b1f', // 화살표 배경 색을 흰색 반투명으로 설정합니다.
  borderRadius: '50%', // 화살표 버튼 모서리를 둥글게 만듭니다.
  zIndex: 9999,
};


const PrevArrow = (props) => {
  const { className, onClick } = props;
  return (
      <div className={className} onClick={onClick} style={arrowStyle}>
      </div>
  );
};

const NextArrow = (props) => {
  const { className, onClick } = props;
  return (
      <div className={className} onClick={onClick} style={arrowStyle}>
      </div>
  );
};

export { PrevArrow, NextArrow };