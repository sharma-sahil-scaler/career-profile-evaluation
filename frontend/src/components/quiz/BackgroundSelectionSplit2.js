import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { ArrowsClockwise, Desktop, Check } from 'phosphor-react';
import chatBot from '../../assets/ChatBot.png';

const slideInFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  gap: 24px;

  @media (max-width: 768px) {
    gap: 0;
    max-width: 100%;
  }
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  margin-bottom: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const BotAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
`;

const BotImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const ChatBubble = styled.div`
  background: #fefce8;
  border: 2px solid #fde047;
  border-radius: 0;
  padding: 16px 20px;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  max-width: fit-content;

  &::before {
    content: '';
    position: absolute;
    left: -14px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-right: 14px solid #fde047;
  }

  &::after {
    content: '';
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-right: 12px solid #fefce8;
  }
`;

const ChatText = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.5;
  animation: ${slideInFromLeft} 0.6s ease-out;
`;

const QuestionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const QuestionLabel = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.5;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 600px;
`;

const OptionCard = styled.button`
  background: #FFFFFF;
  border: 2px solid #e2e8f0;
  border-radius: 0;
  padding: 20px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;

  &:hover {
    border-color: #0041CA;
    background: #FFFFFF;
  }

  &:focus {
    outline: none;
    border-color: #0041CA;
    box-shadow: 0 0 0 3px rgba(0, 65, 202, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const OptionIconWrapper = styled.div`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 0;
  background: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
`;

const OptionContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const OptionTitle = styled.div`
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
  line-height: 1.4;
`;

const OptionDescription = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.3;
`;

const BackgroundSelectionSplit2 = ({ onSelect, onAutoAdvance, hideChat = false, onChatTextChange }) => {
  const [chatText, setChatText] = useState("Let's get started with your profile");

  const handleBackgroundSelect = (background) => {
    // Don't update chat text to prevent jarring transition before auto-advance
    // Just trigger the selection and advance
    onSelect(background);

    // Auto-advance after selection
    if (onAutoAdvance) {
      setTimeout(() => {
        onAutoAdvance();
      }, 1000);
    }
  };

  return (
    <Container>
      <ChatHeader>
        <BotAvatar>
          <BotImage src={chatBot} alt="Scaler Bot" />
        </BotAvatar>
        <ChatBubble>
          <ChatText key={chatText}>{chatText}</ChatText>
        </ChatBubble>
      </ChatHeader>

      <QuestionSection>
        <QuestionLabel>
          What's your current background?
        </QuestionLabel>
        <OptionsContainer>
          <OptionCard onClick={() => handleBackgroundSelect('non-tech')}>
            <OptionIconWrapper>
              <ArrowsClockwise size={24} weight="duotone" />
            </OptionIconWrapper>
            <OptionContent>
              <OptionTitle>Non-Tech / Career Switcher</OptionTitle>
              <OptionDescription>
                Looking to transition into tech
              </OptionDescription>
            </OptionContent>
          </OptionCard>

          <OptionCard onClick={() => handleBackgroundSelect('tech')}>
            <OptionIconWrapper>
              <Desktop size={24} weight="duotone" />
            </OptionIconWrapper>
            <OptionContent>
              <OptionTitle>Tech Professional</OptionTitle>
              <OptionDescription>
                Already working in tech
              </OptionDescription>
            </OptionContent>
          </OptionCard>
        </OptionsContainer>
      </QuestionSection>
    </Container>
  );
};

export default BackgroundSelectionSplit2;
