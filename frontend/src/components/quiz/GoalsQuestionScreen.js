import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useProfile } from '../../context/ProfileContext';
import {
  Brain, Globe, DeviceMobile, ChartBar, ShieldCheck,
  Cloud, CurrencyBtc, GameController, Bluetooth, Cube,
  CreditCard, FirstAid, GraduationCap, ShoppingCart, Robot,
  Users, Buildings, Path, Sparkle
} from 'phosphor-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  gap: 24px;
`;

const QuestionLabel = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.5;
`;

const InputGroup = styled.div`
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 0;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0041CA;
    box-shadow: 0 0 0 3px rgba(0, 65, 202, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const TopicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const TopicButton = styled.button`
  background: ${props => props.selected ? '#E3EEFF' : '#FFFFFF'};
  border: 2px solid ${props => props.selected ? '#0041CA' : '#e2e8f0'};
  border-radius: 0;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #1e293b;

  &:hover {
    border-color: #0041CA;
    background: ${props => props.selected ? '#E3EEFF' : '#f8fafc'};
  }

  &:focus {
    outline: none;
    border-color: #0041CA;
    box-shadow: 0 0 0 3px rgba(0, 65, 202, 0.1);
  }
`;

const IconWrapper = styled.div`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.selected ? '#0041CA' : '#64748b'};
  transition: color 0.2s ease;
  margin-top: 2px;
`;

const TopicContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TopicLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.3;
`;

const TopicSubtitle = styled.div`
  font-size: 0.75rem;
  font-weight: 400;
  color: #64748b;
  line-height: 1.3;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SubmitButton = styled.button`
  background: #D70666;
  color: white;
  border: none;
  border-radius: 0;
  padding: 16px 48px;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;

  &:hover {
    background: #b8044d;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(215, 6, 102, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const GoalsQuestionScreen = ({ hideChat = false, onAutoAdvance }) => {
  const { goals, setGoals } = useProfile();
  const [selectedTopics, setSelectedTopics] = useState(goals?.topicOfInterest || []);

  const trendingTopics = [
    { value: 'ai-ml', label: 'AI & Machine Learning', subtitle: 'Fractal, Tiger Analytics, Niki.ai, etc.', Icon: Brain },
    { value: 'hardware-iot', label: 'Hardware & IoT', subtitle: 'Boat, Noise, Ather Energy, etc.', Icon: Bluetooth },
    { value: 'fintech', label: 'FinTech', subtitle: 'Razorpay, PhonePe, Paytm, CRED, etc.', Icon: CreditCard },
    { value: 'healthtech', label: 'HealthTech', subtitle: 'PharmEasy, Practo, Healthify, 1mg, etc.', Icon: FirstAid },
    { value: 'edtech', label: 'EdTech', subtitle: 'Unacademy, upGrad, Vedantu, etc.', Icon: GraduationCap },
    { value: 'ecommerce', label: 'E-commerce', subtitle: 'Flipkart, Meesho, Myntra, Nykaa, etc.', Icon: ShoppingCart },
    { value: 'social-consumer', label: 'Social Media & Consumer Apps', subtitle: 'ShareChat, Moj, Josh, InMobi, etc.', Icon: Users },
    { value: 'enterprise-saas', label: 'Enterprise/SaaS', subtitle: 'Freshworks, Zoho, Chargebee, Postman, etc.', Icon: Buildings },
    { value: 'gaming', label: 'Gaming', subtitle: 'Dream11, MPL, Games24x7, Winzo, etc.', Icon: GameController },
    { value: 'cybersecurity', label: 'Cybersecurity', subtitle: 'Quick Heal, Sequretek, Lucideus, etc.', Icon: ShieldCheck },
    { value: 'cloud-infrastructure', label: 'Cloud & Infrastructure', subtitle: 'Netmagic, CtrlS, Yotta, etc.', Icon: Cloud },
    { value: 'blockchain-web3', label: 'Blockchain & Web3', subtitle: 'Polygon, CoinDCX, WazirX, etc.', Icon: CurrencyBtc },
    { value: 'ar-vr', label: 'AR/VR & Metaverse', subtitle: 'Smartvizx, GMetri, Scapic, etc.', Icon: Cube },
    { value: 'mobility', label: 'Mobility & Transportation', subtitle: 'Ola, Swiggy, Zomato, Rapido, etc.', Icon: Path },
    { value: 'climate-tech', label: 'Climate Tech & Sustainability', subtitle: 'ReNew Power, Ather, Sun Mobility, etc.', Icon: Sparkle }
  ];

  const handleTopicToggle = (value) => {
    const newTopics = selectedTopics.includes(value)
      ? selectedTopics.filter(t => t !== value)
      : [...selectedTopics, value];

    setSelectedTopics(newTopics);

    // Update goals in context
    setGoals({
      requirementType: [],
      targetCompany: '',
      topicOfInterest: newTopics
    });
  };

  const canSubmit = () => {
    return selectedTopics.length > 0;
  };

  const handleSubmit = () => {
    if (canSubmit() && onAutoAdvance) {
      onAutoAdvance();
    }
  };

  return (
    <Container>
      <QuestionLabel>
        Which industries/companies interest you most?
      </QuestionLabel>

      <TopicsGrid>
        {trendingTopics.map(topic => {
          const IconComponent = topic.Icon;
          const isSelected = selectedTopics.includes(topic.value);
          return (
            <TopicButton
              key={topic.value}
              type="button"
              selected={isSelected}
              onClick={() => handleTopicToggle(topic.value)}
            >
              <IconWrapper selected={isSelected}>
                <IconComponent size={20} weight="duotone" />
              </IconWrapper>
              <TopicContent>
                <TopicLabel>{topic.label}</TopicLabel>
                <TopicSubtitle>{topic.subtitle}</TopicSubtitle>
              </TopicContent>
            </TopicButton>
          );
        })}
      </TopicsGrid>

      <ButtonContainer>
        <SubmitButton
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit()}
        >
          Evaluate my Profile
        </SubmitButton>
      </ButtonContainer>
    </Container>
  );
};

export default GoalsQuestionScreen;
