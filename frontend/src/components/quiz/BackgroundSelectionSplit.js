import React from 'react';
import styled from 'styled-components';
import { ArrowsClockwise, Desktop } from 'phosphor-react';
import scalerBot from '../../assets/scaler-bot.png';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const QuestionBubbleWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 32px;
  width: 100%;
  justify-content: center;
`;

const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 1000px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const QuestionBubble = styled.div`
  background: #fefce8;
  border: 2px solid #fde047;
  border-radius: 1000px;
  padding: 16px 24px;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  max-width: 400px;

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

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.5;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QuestionNumber = styled.span`
  font-size: 0.7rem;
  font-weight: 400;
  color: #64748b;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 400px;
`;

const Option = styled.button`
  background: #FFFFFF;
  border: 2px solid #e2e8f0;
  border-radius: 0;
  padding: 18px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 70px;

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
  font-size: 0.95rem;
  color: #1e293b;
  font-weight: 500;
  line-height: 1.4;
`;

const OptionDescription = styled.div`
  font-size: 0.8rem;
  color: #64748b;
  line-height: 1.3;
`;

const BackgroundSelectionSplit = ({ onSelect }) => {
  const handleBackgroundSelect = (background) => {
    onSelect(background);
  };

  return (
    <Container>
      <QuestionBubbleWrapper>
        <Avatar>
          <AvatarImage src={scalerBot} alt="Scaler Bot" />
        </Avatar>
        <QuestionBubble>
          <Title>
            <QuestionNumber>1/5</QuestionNumber>
            <span>What's your current background?</span>
          </Title>
        </QuestionBubble>
      </QuestionBubbleWrapper>

      <OptionsContainer>
        <Option onClick={() => handleBackgroundSelect('non-tech')}>
          <OptionIconWrapper>
            <ArrowsClockwise size={24} weight="duotone" />
          </OptionIconWrapper>
          <OptionContent>
            <OptionTitle>Non-Tech / Career Switcher</OptionTitle>
            <OptionDescription>
              Looking to transition into tech
            </OptionDescription>
          </OptionContent>
        </Option>

        <Option onClick={() => handleBackgroundSelect('tech')}>
          <OptionIconWrapper>
            <Desktop size={24} weight="duotone" />
          </OptionIconWrapper>
          <OptionContent>
            <OptionTitle>Tech Professional</OptionTitle>
            <OptionDescription>
              Already working in tech
            </OptionDescription>
          </OptionContent>
        </Option>
      </OptionsContainer>
    </Container>
  );
};

export default BackgroundSelectionSplit;
