import {
  Books,
  CaretLeft,
  CaretRight,
  ChartLine,
  ChatCircleDots,
  Check,
  Target,
  UsersThree
} from 'phosphor-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import chatBot from '../../assets/ChatBot.png';
import { ReactComponent as ScalerLogo } from '../../assets/scaler-logo.svg';
import { useProfile } from '../../context/ProfileContext';
import tracker from '../../utils/tracker';
import { getPathWithQueryParams } from '../../utils/url';
import BackgroundSelectionSplit2 from './BackgroundSelectionSplit2';
import {
  NON_TECH_QUIZ_SCREENS,
  TECH_QUIZ_SCREENS,
  isScreenComplete
} from './ChattyQuizScreens';
import GroupedQuestionScreen from './GroupedQuestionScreen';

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const QuizContainer = styled.div`
  min-height: 100vh;
  background: #fbfbfb;
  position: relative;
  display: flex;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftPanel = styled.div`
  width: 40%;
  background: #fbfbfb;
  padding: 32px 60px 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }
`;

const scroll = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

const TrustBadgeSection = styled.div`
  margin-top: auto;
  padding-top: 40px;
  border-top: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    /* Mobile: Reduce space between content and logo ticker */
    margin-top: 8px;
    padding-top: 12px;
    padding-bottom: 12px; /* ADJUST THIS: increase space for trust section */
  }
`;

const TrustBadgeTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 20px;
  text-align: center;

  @media (max-width: 768px) {
    /* Mobile: Space between "Trusted by..." text and logo ticker */
    margin-bottom: 16px; /* ADJUST THIS: increase/decrease gap above ticker */
  }
`;

const LogoTicker = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;
  /* Mobile: Reduce ticker height - ADJUST gap/spacing here */
  @media (max-width: 768px) {
    min-height: 40px; /* ADJUST THIS: reduce purple ticker height */
  }

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 60px;
    background: linear-gradient(to right, #fbfbfb 0%, transparent 100%);
    z-index: 2;
    pointer-events: none;

    @media (max-width: 768px) {
      width: 40px;
    }
  }

  &::after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 60px;
    background: linear-gradient(to left, #fbfbfb 0%, transparent 100%);
    z-index: 2;
    pointer-events: none;

    @media (max-width: 768px) {
      width: 40px;
    }
  }
`;

const LogoTrack = styled.div`
  display: flex;
  align-items: center;
  gap: 48px;
  padding-right: 48px;
  animation: ${scroll} 25s linear infinite;
  width: fit-content;
  will-change: transform;

  @media (max-width: 768px) {
    gap: 36px;
    padding-right: 36px;
  }
`;

const CompanyLogo = styled.img`
  height: 36px;
  width: auto;
  object-fit: contain;
  opacity: 0.8;
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    height: 30px;
  }
`;

const RightPanel = styled.div`
  width: 60%;
  background: #ffffff;
  padding: 32px;
  min-height: 100vh;
  border-left: 1px solid #e2e8f0;
  position: relative;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    border-left: none;
    padding: 16px;
    min-height: calc(100vh - 72px);
    padding-bottom: 90px;
  }
`;

const LogoContainer = styled.div`
  margin-bottom: 40px;

  @media (max-width: 768px) {
    /* Mobile: Remove margin above logo */
    margin-top: 0;
    margin-bottom: 24px;
  }
`;

const Logo = styled.div`
  svg {
    height: 32px;
    width: auto;
  }
`;

const WelcomeContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 440px;
`;

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 12px;
  }
`;

const WelcomeSubtitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #c71f69;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 16px;
  }
`;

const WelcomeDescription = styled.p`
  font-size: 1rem;
  color: #475569;
  line-height: 1.7;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 24px;
  }
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    gap: 10px;
    margin-bottom: 24px;
  }
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
  color: #475569;
`;

const IconContainer = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 0;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #c71f69;
`;

const ProgressBarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: #e2e8f0;
  z-index: 300;
  display: block;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: #0041ca;
  transition: width 0.3s ease;
  width: ${(props) => props.progress}%;
`;

const ChatbotContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 120px;
  max-width: 440px;
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

const ChatbotWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const ChatbotAvatar = styled.div`
  width: 84px;
  height: 84px;
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

const ChatMessage = styled.div`
  background: #fefce8;
  border: 2px solid #fde047;
  border-radius: 0;
  padding: 16px 20px;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.5;
  animation: ${slideInFromLeft} 0.6s ease-out;

  &::before {
    content: "";
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
    content: "";
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

const QuizContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 100px 40px 40px;

  @media (max-width: 768px) {
    padding: 0;
    align-items: flex-start;
    justify-content: flex-start;
  }
`;

const BackButton = styled.button`
  background: white;
  color: #1e293b;
  border: 2px solid #e2e8f0;
  padding: 10px 20px;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 600;
  font-size: 0.9rem;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const NextButton = styled.button`
  background: white;
  color: #1e293b;
  border: 2px solid #e2e8f0;
  padding: 10px 20px;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 600;
  font-size: 0.9rem;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const SkipButton = styled.button`
  background: transparent;
  color: #64748b;
  border: none;
  padding: 8px 0;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.9rem;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (max-width: 768px) {
    /* Mobile: Reduce font size of Skip Evaluation CTA */
    font-size: 0.75rem; /* ADJUST THIS: reduce font size on mobile */
  }

  &:hover {
    color: #475569;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const NavDivider = styled.div`
  width: 1px;
  height: 24px;
  background: #e2e8f0;
  margin: 0 6px;
`;

const TopNavigationWrapper = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 16px 0;
  z-index: 10;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const DesktopNavigation = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const CarouselDotsContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  height: 40px;
`;

const Dot = styled.div`
  width: ${(props) => (props.active ? '24px' : '8px')};
  height: 8px;
  border-radius: 0;
  background: ${(props) => (props.active ? '#64748b' : '#cbd5e1')};
  transition: all 0.3s ease;
  cursor: ${(props) => (props.active ? 'default' : 'pointer')};

  &:hover {
    background: ${(props) => (props.active ? '#64748b' : '#94a3b8')};
  }
`;

const MobileChatbotSection = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 24px;
    margin-top: 32px;
  }
`;

const MobileChatbotAvatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const MobileChatBubble = styled.div`
  background: #fefce8;
  border: 2px solid #fde047;
  border-radius: 0;
  padding: 16px;
  position: relative;
  align-self: stretch;
  width: 100%;

  &::before {
    content: "";
    position: absolute;
    top: -12px;
    left: 20px;
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 12px solid #fde047;
  }

  &::after {
    content: "";
    position: absolute;
    top: -8px;
    left: 22px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #fefce8;
  }
`;

const MobileChatbotText = styled.p`
  font-size: 0.875rem;
  line-height: 1.6;
  color: #1e293b;
  margin: 0;
  font-weight: 500;
`;

const BottomNavigation = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e2e8f0;
  padding: 16px 20px;
  display: none;
  z-index: 100;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 768px) {
    display: flex;
    justify-content: ${(props) =>
    props.isLastStep ? 'space-between' : 'space-between'};
    align-items: center;
  }
`;

const MobileNavButtonsContainer = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;

const MobileWelcomeScreen = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;
    max-height: 100vh;
    overflow: hidden;
    /* ADJUST THIS: reduce side margins on mobile */
    padding: 20px 20px 140px;
    background: #fbfbfb;
  }
`;

const MobileWelcomeContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;

  @media (max-width: 768px) {
    justify-content: flex-start;
    /* Removed padding-top to eliminate green space above logo */
  }
`;

const MobileButtonsContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 1000;
`;

const StickyMobileCTA = styled.button`
  background: #d80566;
  color: white;
  border: none;
  padding: 18px 32px;
  border-radius: 0;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;

  &:hover {
    background: #b8044d;
  }
`;

const LastStepNavButton = styled.button`
  background: ${(props) => (props.variant === 'primary' ? '#D70666' : 'white')};
  color: ${(props) => (props.variant === 'primary' ? 'white' : '#1e293b')};
  border: 2px solid
    ${(props) => (props.variant === 'primary' ? '#D70666' : '#e2e8f0')};
  padding: ${(props) =>
    props.variant === 'primary' ? '14px 24px' : '14px 16px'};
  border-radius: 0;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: ${(props) => (props.variant === 'primary' ? '1px' : '0')};
  text-transform: ${(props) =>
    props.variant === 'primary' ? 'uppercase' : 'none'};
  cursor: pointer;
  transition: all 0.2s ease;
  flex: ${(props) => (props.variant === 'primary' ? '1' : 'none')};
  width: ${(props) => (props.variant === 'primary' ? 'auto' : '60px')};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background: ${(props) =>
    props.variant === 'primary' ? '#b8044d' : '#f8fafc'};
    border-color: ${(props) =>
    props.variant === 'primary' ? '#b8044d' : '#cbd5e1'};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const NavButton = styled.button`
  background: white;
  color: #1e293b;
  border: 2px solid #e2e8f0;
  padding: 14px 24px;
  border-radius: 0;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const FinalModeQuiz = ({ onProgressChange }) => {
  const navigate = useNavigate();
  const {
    background,
    setBackground,
    quizResponses,
    setQuizResponse,
    clearQuizResponses,
    goals,
    evaluationResults
  } = useProfile();

  useEffect(() => {
    if (evaluationResults) {
      navigate(getPathWithQueryParams('/results'), { replace: true });
    }
  }, [evaluationResults, navigate]);

  const [currentStep, setCurrentStep] = useState(0);
  const [chatText, setChatText] = useState(
    "Let's get started with your profile"
  );
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showMobileWelcome, setShowMobileWelcome] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getQuizScreens = () => {
    if (background === 'tech') {
      return TECH_QUIZ_SCREENS;
    } else if (background === 'non-tech') {
      return NON_TECH_QUIZ_SCREENS;
    }
    return NON_TECH_QUIZ_SCREENS;
  };

  const quizScreens = getQuizScreens();
  const totalSteps = 1 + quizScreens.length; // background + quiz screens

  useEffect(() => {
    const progress = ((currentStep + 1) / totalSteps) * 100;
    onProgressChange?.(progress);
  }, [currentStep, totalSteps, onProgressChange]);

  const handleBackgroundSelect = (selectedBackground) => {
    setBackground(selectedBackground);
    setTimeout(() => {
      handleNext();
    }, 1000);
  };

  const handleQuizResponse = (questionId, option) => {
    setQuizResponse(questionId, option.value);

    const labelFields = ['currentRole', 'targetRole', 'targetCompany'];
    if (labelFields.includes(questionId)) {
      setQuizResponse(`${questionId}Label`, option.label);
    }
  };

  const handleNext = useCallback(() => {
    tracker.click({
      click_type: 'quiz_next_button_clicked',
      custom: {
        source: 'final_mode_quiz'
      }
    });
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(getPathWithQueryParams('/results'));
    }
  }, [currentStep, totalSteps, navigate]);

  const handlePrevious = useCallback(() => {
    tracker.click({
      click_type: 'quiz_previous_step_clicked',
      custom: {
        source: 'final_mode_quiz'
      }
    });

    if (currentStep === 0) {
      navigate(getPathWithQueryParams('/'));
      return;
    }

    if (currentStep === 1) {
      clearQuizResponses();
      setBackground(null);
      setCurrentStep(0);
      return;
    }

    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep, clearQuizResponses, setBackground, navigate]);

  const canProceed = useCallback(() => {
    if (currentStep === 0) {
      return !!background;
    }

    const screenIndex = currentStep - 1;
    if (screenIndex >= 0 && screenIndex < quizScreens.length) {
      const screen = quizScreens[screenIndex];

      const allQuestionsAnswered = screen.questions.every((q) => {
        if (q.optional) {
          return true;
        }
        if (q.conditional && q.showIf) {
          if (!q.showIf(quizResponses)) {
            return true;
          }
        }
        return (
          quizResponses[q.id] !== undefined && quizResponses[q.id] !== null
        );
      });

      return allQuestionsAnswered;
    }

    return false;
  }, [currentStep, quizScreens, quizResponses]);

  const renderContent = () => {
    if (currentStep === 0) {
      return (
        <BackgroundSelectionSplit2
          onSelect={handleBackgroundSelect}
          onAutoAdvance={handleNext}
          hideChat={true}
          onChatTextChange={setChatText}
        />
      );
    }

    const screenIndex = currentStep - 1;
    if (screenIndex >= 0 && screenIndex < quizScreens.length) {
      const screen = quizScreens[screenIndex];

      const processedQuestions = screen.questions
        .filter((question) => {
          if (question.conditional && question.showIf) {
            return question.showIf(quizResponses);
          }
          return true;
        })
        .map((question) => {
          if (question.dynamicOptions && question.optionsByRole) {
            const currentRole = quizResponses.currentRole;
            const options =
              question.optionsByRole[currentRole] ||
              question.optionsByRole['swe-product'] ||
              [];
            return {
              ...question,
              options
            };
          }
          return question;
        });

      let questionStartIndex = 2;
      for (let i = 0; i < screenIndex; i++) {
        questionStartIndex += quizScreens[i].questions.length;
      }

      return (
        <GroupedQuestionScreen
          questions={processedQuestions}
          responses={quizResponses}
          onResponse={handleQuizResponse}
          initialChatText={screen.initialChatText}
          chatResponseMap={screen.chatResponseMap}
          questionStartIndex={questionStartIndex}
          onAutoAdvance={handleNext}
          onChatTextChange={setChatText}
          hideChat={true}
        />
      );
    }

    return null;
  };

  useEffect(() => {
    if (currentStep === 0) {
      setChatText("Let's get started with your profile");
    } else {
      const screenIndex = currentStep - 1;
      if (screenIndex >= 0 && screenIndex < quizScreens.length) {
        const screen = quizScreens[screenIndex];
        setChatText(screen.initialChatText);
      }
    }
  }, [currentStep, quizScreens]);

  const companies = [
    {
      name: 'Razorpay',
      logo: 'https://cdn.brandfetch.io/razorpay.com/w/400/h/400'
    },
    {
      name: 'Swiggy',
      logo: 'https://cdn.brandfetch.io/swiggy.com/w/400/h/400'
    },
    { name: 'CRED', logo: 'https://cdn.brandfetch.io/cred.club/w/400/h/400' },
    {
      name: 'Unacademy',
      logo: 'https://cdn.brandfetch.io/unacademy.com/w/400/h/400'
    },
    { name: 'Zoho', logo: 'https://cdn.brandfetch.io/zoho.com/w/400/h/400' },
    { name: 'Paytm', logo: 'https://cdn.brandfetch.io/paytm.com/w/400/h/400' },
    {
      name: 'PhonePe',
      logo: 'https://cdn.brandfetch.io/phonepe.com/w/400/h/400'
    },
    {
      name: 'Zomato',
      logo: 'https://cdn.brandfetch.io/zomato.com/w/400/h/400'
    }
  ];

  const renderLeftPanel = () => {
    const logoSection = (
      <LogoContainer>
        <Logo>
          <ScalerLogo aria-label="Scaler" />
        </Logo>
      </LogoContainer>
    );

    const trustBadgeSection = (
      <TrustBadgeSection>
        <TrustBadgeTitle>
          Trusted by our alumni, who are working at
        </TrustBadgeTitle>
        <LogoTicker>
          <LogoTrack>
            {companies.map((company, index) => (
              <CompanyLogo
                key={`logo-${index}`}
                src={company.logo}
                alt={company.name}
              />
            ))}
            {companies.map((company, index) => (
              <CompanyLogo
                key={`logo-duplicate-${index}`}
                src={company.logo}
                alt={company.name}
              />
            ))}
          </LogoTrack>
        </LogoTicker>
      </TrustBadgeSection>
    );

    if (currentStep === 0) {
      return (
        <>
          {logoSection}
          <WelcomeContent>
            <WelcomeTitle>Free Profile Evaluation</WelcomeTitle>
            <WelcomeSubtitle>Tech Career Assessment in 2 mins</WelcomeSubtitle>
            <WelcomeDescription>
              Get a comprehensive evaluation of your profile for tech roles.
              Discover your strengths, identify gaps, and receive personalized
              recommendations to accelerate your career growth.
            </WelcomeDescription>

            <FeaturesList>
              <Feature>
                <IconContainer>
                  <ChartLine size={18} weight="regular" />
                </IconContainer>
                Profile Strength Analysis
              </Feature>
              <Feature>
                <IconContainer>
                  <Target size={18} weight="regular" />
                </IconContainer>
                Skill Gap Assessment
              </Feature>
              <Feature>
                <IconContainer>
                  <ChatCircleDots size={18} weight="regular" />
                </IconContainer>
                Career Readiness Timeline
              </Feature>
              <Feature>
                <IconContainer>
                  <UsersThree size={18} weight="regular" />
                </IconContainer>
                Peer Comparison
              </Feature>
            </FeaturesList>
          </WelcomeContent>
          {trustBadgeSection}
        </>
      );
    }

    return (
      <>
        <div>
          {logoSection}
          <ChatbotContainer>
            <ChatbotWrapper>
              <ChatbotAvatar>
                <BotImage src={chatBot} alt="Scaler Bot" />
              </ChatbotAvatar>
              <ChatMessage key={chatText}>{chatText}</ChatMessage>
            </ChatbotWrapper>
          </ChatbotContainer>
        </div>
        {trustBadgeSection}
      </>
    );
  };

  const handleDotClick = (index) => {
    if (index < currentStep && index >= 0) {
      setCurrentStep(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const progress = ((currentStep + 1) / totalSteps) * 100;

  const isLastStep = currentStep === totalSteps - 1;

  const handleMobileContinue = () => {
    setShowMobileWelcome(false);
  };

  if (isMobile && showMobileWelcome && currentStep === 0) {
    return (
      <MobileWelcomeScreen>
        <MobileWelcomeContent>
          <LogoContainer>
            <Logo>
              <ScalerLogo aria-label="Scaler" />
            </Logo>
          </LogoContainer>
          <WelcomeContent>
            <WelcomeTitle>Free Profile Evaluation</WelcomeTitle>
            <WelcomeSubtitle>Tech Career Assessment in 2 mins</WelcomeSubtitle>
            <WelcomeDescription>
              Get a comprehensive evaluation of your profile for tech roles.
              Discover your strengths, identify gaps, and receive personalized
              recommendations to accelerate your career growth.
            </WelcomeDescription>

            <FeaturesList>
              <Feature>
                <IconContainer>
                  <ChartLine size={18} weight="regular" />
                </IconContainer>
                Profile Strength Analysis
              </Feature>
              <Feature>
                <IconContainer>
                  <Target size={18} weight="regular" />
                </IconContainer>
                Skill Gap Assessment
              </Feature>
              <Feature>
                <IconContainer>
                  <ChatCircleDots size={18} weight="regular" />
                </IconContainer>
                Career Readiness Timeline
              </Feature>
              <Feature>
                <IconContainer>
                  <UsersThree size={18} weight="regular" />
                </IconContainer>
                Peer Comparison
              </Feature>
            </FeaturesList>
          </WelcomeContent>

          <TrustBadgeSection>
            <TrustBadgeTitle>
              Trusted by our alumni, who are working at
            </TrustBadgeTitle>
            <LogoTicker>
              <LogoTrack>
                {companies.map((company, index) => (
                  <CompanyLogo
                    key={`logo-${index}`}
                    src={company.logo}
                    alt={company.name}
                  />
                ))}
                {companies.map((company, index) => (
                  <CompanyLogo
                    key={`logo-duplicate-${index}`}
                    src={company.logo}
                    alt={company.name}
                  />
                ))}
              </LogoTrack>
            </LogoTicker>
          </TrustBadgeSection>
        </MobileWelcomeContent>
        <MobileButtonsContainer>
          <StickyMobileCTA onClick={handleMobileContinue}>
            Continue
          </StickyMobileCTA>
        </MobileButtonsContainer>
      </MobileWelcomeScreen>
    );
  }

  return (
    <QuizContainer>
      <ProgressBarContainer>
        <ProgressBarFill progress={progress} />
      </ProgressBarContainer>

      <LeftPanel>{renderLeftPanel()}</LeftPanel>

      <RightPanel>
        {!isMobile && (
          <TopNavigationWrapper>
            <DesktopNavigation>
              <BackButton onClick={handlePrevious} disabled={currentStep === 0}>
                <CaretLeft size={20} weight="regular" />
              </BackButton>
              {!isLastStep ? (
                <NextButton onClick={handleNext} disabled={!canProceed()}>
                  <CaretRight size={20} weight="regular" />
                </NextButton>
              ) : (
                <LastStepNavButton
                  variant="primary"
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  Evaluate my Profile
                </LastStepNavButton>
              )}

            </DesktopNavigation>

            <CarouselDotsContainer>
              {[...Array(totalSteps)].map((_, index) => (
                <Dot
                  key={index}
                  active={index === currentStep}
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </CarouselDotsContainer>
          </TopNavigationWrapper>
        )}

        {isMobile && (
          <MobileChatbotSection>
            <MobileChatbotAvatar>
              <img src={chatBot} alt="Scaler Bot" />
            </MobileChatbotAvatar>
            <MobileChatBubble>
              <MobileChatbotText>{chatText}</MobileChatbotText>
            </MobileChatBubble>
          </MobileChatbotSection>
        )}

        <QuizContent key={currentStep}>{renderContent()}</QuizContent>
      </RightPanel>

      {isMobile && (
        <BottomNavigation isLastStep={isLastStep}>
          <MobileNavButtonsContainer>
            {!isLastStep ? (
              <>
                <NavButton onClick={handlePrevious} disabled={currentStep === 0}>
                  <CaretLeft size={20} weight="regular" />
                </NavButton>
                <NavButton onClick={handleNext} disabled={!canProceed()}>
                  <CaretRight size={20} weight="regular" />
                </NavButton>
              </>
            ) : (
              <>
                <LastStepNavButton onClick={handlePrevious}>
                  <CaretLeft size={20} weight="regular" />
                </LastStepNavButton>
                <LastStepNavButton
                  variant="primary"
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  Evaluate my Profile
                </LastStepNavButton>
              </>
            )}
          </MobileNavButtonsContainer>

        </BottomNavigation>
      )}
    </QuizContainer>
  );
};

export default FinalModeQuiz;
