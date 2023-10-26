import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.div`
  width: 100%;
  height: 5rem;
`;

const FooterContainer = styled.div`
  text-align: center;
  background-color: white;
  color: white;
  padding: 10px;
  position: fixed;
  bottom: 0;
  width: 100%;
`;

const FooterText = styled.p`
  color: #426B1F;
  font-size: 90%;
  margin: 0px;
`;

const FooterAddress = styled.address`
  color: #426B1F;
  font-size: x-small;
  font-style: italic;
`;

const healingPhrases = [
  "넌 지금 충분히 잘해내고 있어",
  "오늘 하루도 정말 수고했어요",
  "조금씩 나아질거야",
  "언제나 너를 응원해",
  "괜찮아, 잘 될거야",
  "누구에게나 처음은 있잖아요",
  "힘든 날도 가만히 있다보면 또 힘이 날거야",
  "너의 오늘이 가장 빛나길",
  "나는 언제나 네편이야!",
  "너의 꿈을 응원해",
  "가끔은 가장 옳은 길이 가장 쉬운 길이 아닐때도 있지",
  "잘했고 잘하고있고 잘 할거야",
  "넘어지면 다시 일어나면 돼",
  "너의 내일을 응원해",
  "너라면 충분히 잘 할 수 있어",
  "당신을 응원하는 사람이 있다는 걸 잊지말아요",
  "너는 세상을 햇빛으로 가득 채울 수 있는 존재야",
  "항상 최선을 다하는 당신이 멋져요",
  "모든날 모든 순간을 응원해요",
  "비온 뒤 맑은날이 오는것처럼",

    
    
];

function getRandomHealingPhrase() {
  const randomIndex = Math.floor(Math.random() * healingPhrases.length);
  return healingPhrases[randomIndex];
}


const Footer = () => {
  const randomHealingPhrase = getRandomHealingPhrase();

  return (
      <FooterWrapper>
        <FooterContainer>
          <FooterText>{randomHealingPhrase}</FooterText>
          <FooterAddress>@힐링캠프</FooterAddress>
        </FooterContainer>
      </FooterWrapper>
  );
};

export default Footer;