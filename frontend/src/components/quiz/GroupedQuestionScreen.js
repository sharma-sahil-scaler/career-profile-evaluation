import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  Check,
  GraduationCap,
  Briefcase,
  ArrowsClockwise,
  Users,
  Calendar,
  CalendarCheck,
  ChartLineUp,
  Trophy,
  Star,
  StarFour,
  Sparkle,
  Crown,
  Path,
  TrendUp,
  Rocket,
  CurrencyDollar,
  Code,
  UserCircle,
  IdentificationCard,
  Buildings,
  Storefront,
  Factory,
  PlayCircle,
  BookOpen,
  CheckCircle,
  Lightning,
  Clock,
  Timer,
  FireSimple,
  ThumbsUp,
  HandHeart,
  Target,
  ChartBar
} from 'phosphor-react';
import scalerBot from '../../assets/scaler-bot.png';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

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
  max-width: 1000px;
  margin: 0 auto;
  gap: 36px;

  @media (max-width: 768px) {
    gap: 0;
    max-width: 100%;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const BotAvatar = styled.div`
  width: 56px;
  height: 56px;
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
    top: 20px;
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
    top: 20px;
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
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QuestionNumberBubble = styled.span`
  font-size: 0.75rem;
  font-weight: 400;
  color: #64748b;
`;

const QuestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;

  @media (max-width: 768px) {
    gap: 32px;
  }
`;

const QuestionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const QuestionLabel = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.5;
  margin-bottom: 4px;
`;

const OptionsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
  max-width: 800px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
    max-width: 100%;
  }
`;

const OptionPill = styled.button`
  background: ${props => props.selected ? '#E3EEFF' : '#FFFFFF'};
  color: ${props => props.selected ? '#0041CA' : '#1e293b'};
  border: 2px solid ${props => props.selected ? '#0041CA' : '#e2e8f0'};
  border-radius: 0;
  padding: 12px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;

  &:hover {
    border-color: #0041CA;
    background: ${props => props.selected ? '#E3EEFF' : '#FFFFFF'};
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
  width: 32px;
  height: 32px;
  border-radius: 0;
  background: ${props => props.selected ? '#0041CA' : '#f1f5f9'};
  color: ${props => props.selected ? 'white' : '#64748b'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
`;

const OptionContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const OptionText = styled.div`
  font-size: 0.95rem;
  color: #1e293b;
  font-weight: 500;
  line-height: 1.4;
`;

const CheckIcon = styled.div`
  color: #0041CA;
  display: flex;
  align-items: center;
  opacity: ${props => props.selected ? 1 : 0};
  transition: opacity 0.2s ease;
  flex-shrink: 0;
`;

// Icon mapping for options (moved outside component for consistency)
const getOptionIcon = (value) => {
  const icons = {
  // Screen 1: Profile (Non-Tech)
  'non-tech': <UserCircle size={20} weight="duotone" />,
  'it-services': <Briefcase size={20} weight="duotone" />,
  'technical': <Code size={20} weight="duotone" />,
  'fresh-graduate': <GraduationCap size={20} weight="duotone" />,

  // Screen 1: Profile (Tech)
  'student-freshgrad': <GraduationCap size={20} weight="duotone" />,
  'swe-product': <Buildings size={20} weight="duotone" />,
  'swe-service': <Briefcase size={20} weight="duotone" />,

  // Experience levels
  '0': <GraduationCap size={20} weight="duotone" />,
  '0-2': <Clock size={20} weight="duotone" />,
  '3-5': <Briefcase size={20} weight="duotone" />,
  '5+': <Trophy size={20} weight="duotone" />,

  // Skills (Non-Tech)
  'communication': <Users size={20} weight="duotone" />,
  'analytical': <ChartLineUp size={20} weight="duotone" />,
  'operations': <Target size={20} weight="duotone" />,
  'self-learning': <BookOpen size={20} weight="duotone" />,

  // Screen 2: Motivation
  'salary-growth': <CurrencyDollar size={20} weight="duotone" />,
  'interest': <Star size={20} weight="duotone" />,
  'job-stability': <CheckCircle size={20} weight="duotone" />,
  'peer-influence': <Users size={20} weight="duotone" />,

  // Target Roles (Non-Tech)
  'backend': <Code size={20} weight="duotone" />,
  'fullstack': <Crown size={20} weight="duotone" />,
  'data-ml': <ChartBar size={20} weight="duotone" />,
  'data-analyst': <ChartLineUp size={20} weight="duotone" />,
  'not-sure': <Target size={20} weight="duotone" />,

  // Target Roles (Tech)
  'faang-product': <Trophy size={20} weight="duotone" />,
  'backend-fullstack': <Code size={20} weight="duotone" />,
  'techlead-architect': <Crown size={20} weight="duotone" />,

  // Company types
  'product': <Buildings size={20} weight="duotone" />,
  'startup': <Rocket size={20} weight="duotone" />,
  'service': <Briefcase size={20} weight="duotone" />,
  'domain-specific': <Target size={20} weight="duotone" />,

  // Screen 3: Preparation (Non-Tech)
  'completed-course': <GraduationCap size={20} weight="duotone" />,
  'self-learning': <BookOpen size={20} weight="duotone" />,
  'just-exploring': <Path size={20} weight="duotone" />,
  'havent-tried': <PlayCircle size={20} weight="duotone" />,
  'follow-tutorials': <BookOpen size={20} weight="duotone" />,
  'solve-problems': <Code size={20} weight="duotone" />,

  // Coding Practice (Tech)
  '0-10': <PlayCircle size={20} weight="duotone" />,
  '11-50': <Clock size={20} weight="duotone" />,
  '51-100': <FireSimple size={20} weight="duotone" />,
  '100+': <Trophy size={20} weight="duotone" />,

  // System Design (Tech)
  'led-multiple': <Crown size={20} weight="duotone" />,
  'participated': <Users size={20} weight="duotone" />,
  'learning': <BookOpen size={20} weight="duotone" />,

  // Portfolio (Tech)
  'active-5plus': <Trophy size={20} weight="duotone" />,
  'limited-1to5': <CheckCircle size={20} weight="duotone" />,
  'inactive': <Clock size={20} weight="duotone" />,
  'no-portfolio': <Target size={20} weight="duotone" />,

  // Interview Practice (Tech)
  'weekly': <Trophy size={20} weight="duotone" />,
  'monthly': <CalendarCheck size={20} weight="duotone" />,
  'rarely': <Clock size={20} weight="duotone" />,
  'never': <Target size={20} weight="duotone" />,

  // Time investment options
  '6-10': <Timer size={20} weight="duotone" />,
  '10+': <FireSimple size={20} weight="duotone" />
  };

  return icons[value] || null;
};

const GroupedQuestionScreen = ({
  questions,
  responses,
  onResponse,
  initialChatText,
  chatResponseMap,
  questionStartIndex = 1,
  totalQuestions = 11,
  onAutoAdvance,
  onChatTextChange,
  hideChat = false
}) => {
  const [chatText, setChatText] = useState(initialChatText);

  const handleOptionSelect = (questionId, option, questionIndex) => {
    // Don't do anything if this option is already selected
    if (responses[questionId] === option.value) {
      return;
    }

    onResponse(questionId, option);

    // Check if all questions on this screen will be answered after this selection
    const updatedResponses = { ...responses, [questionId]: option.value };
    const allAnswered = questions.every((q) => {
      if (q.optional) {
        return true;
      }
      return updatedResponses[q.id] !== undefined && updatedResponses[q.id] !== null;
    });
    const isLastQuestion = questionIndex === questions.length - 1;
    const isSingleQuestion = questions.length === 1;

    // Only update chat bubble if NOT (single question OR last question on screen)
    // This prevents jarring chat text changes right before auto-advance
    if (!isSingleQuestion && !isLastQuestion) {
      if (chatResponseMap && chatResponseMap[questionId] && chatResponseMap[questionId][option.value]) {
        const newChatText = chatResponseMap[questionId][option.value];
        setChatText(newChatText);

        // Call the parent callback to update chat in left panel
        if (onChatTextChange) {
          onChatTextChange(newChatText);
        }
      }
    }

    // Auto-scroll to next question (if not last question on this screen)
    if (!isLastQuestion) {
      // Scroll to next question after a brief delay
      setTimeout(() => {
        const nextQuestionElement = document.querySelector(`[data-question-index="${questionIndex + 1}"]`);
        if (nextQuestionElement) {
          nextQuestionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
    }

    // Auto-advance to next page if all questions are answered
    if (allAnswered && onAutoAdvance) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onAutoAdvance();
      }, 1000);
    }
  };

  return (
    <Container>
      {!hideChat && (
        <Header>
          <BotAvatar>
            <BotImage src={scalerBot} alt="Scaler Bot" />
          </BotAvatar>
          <ChatBubble>
            <ChatText key={chatText}>{chatText}</ChatText>
          </ChatBubble>
        </Header>
      )}

      <QuestionsContainer>
        {questions.map((question, questionIndex) => (
          <QuestionGroup key={question.id} data-question-index={questionIndex}>
            <QuestionLabel>{question.question}</QuestionLabel>
            <OptionsRow>
              {question.options.map((option) => {
                const isSelected = responses[question.id] === option.value;
                return (
                  <OptionPill
                    key={option.value}
                    selected={isSelected}
                    onClick={() => handleOptionSelect(question.id, option, questionIndex)}
                  >
                    <OptionIconWrapper selected={isSelected}>
                      {option.icon || getOptionIcon(option.value)}
                    </OptionIconWrapper>
                    <OptionContent>
                      <OptionText>{option.label}</OptionText>
                      <CheckIcon selected={isSelected}>
                        <Check size={20} weight="bold" />
                      </CheckIcon>
                    </OptionContent>
                  </OptionPill>
                );
              })}
            </OptionsRow>
          </QuestionGroup>
        ))}
      </QuestionsContainer>
    </Container>
  );
};

export default GroupedQuestionScreen;
