import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import styled, { keyframes } from 'styled-components';
import scalerBot from '../assets/scaler-bot.png';
import {
  Brain, Globe, DeviceMobile, ChartBar, ShieldCheck,
  Cloud, CurrencyBtc, GameController, Bluetooth, Cube,
  CreditCard, FirstAid, GraduationCap, ShoppingCart, Robot
} from 'phosphor-react';

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

const GoalsContainer = styled.div`
  min-height: calc(100vh - 70px);
  background: #FFFFFF;
  padding: 80px 20px 160px;
  animation: ${fadeIn} 1.2s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const QuestionBubbleWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 32px;
  width: 100%;
`;

const Avatar = styled.div`
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

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const QuestionBubble = styled.div`
  background: #fefce8;
  border: 2px solid #fde047;
  border-radius: 0;
  padding: 16px 20px;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

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
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.5;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QuestionNumber = styled.span`
  font-size: 0.75rem;
  font-weight: 400;
  color: #64748b;
`;

const Form = styled.form`
  width: 100%;
`;

const TopicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 40px;
`;

const TopicButton = styled.button`
  background: ${props => props.selected ? '#E3EEFF' : '#FFFFFF'};
  border: 2px solid ${props => props.selected ? '#0041CA' : '#e2e8f0'};
  border-radius: 0;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;

  &:hover {
    border-color: #0041CA;
    background: ${props => props.selected ? '#E3EEFF' : '#FFFFFF'};
  }

  &:focus {
    outline: none;
    border-color: #0041CA;
    box-shadow: 0 0 0 3px rgba(0, 65, 202, 0.1);
  }
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 0;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 0;
  font-size: 1rem;
  background: white;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 0;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const BottomNavigation = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e2e8f0;
  padding: 12px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const NavigationContent = styled.div`
  max-width: 800px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PreviousButton = styled.button`
  background: transparent;
  color: #64748b;
  border: none;
  padding: 8px 20px;
  border-radius: 0;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #1e293b;
    background: #FAFAFA;
  }
`;

const NextButton = styled.button`
  background: ${props => props.disabled ? '#e2e8f0' : '#FFFFFF'};
  color: ${props => props.disabled ? '#94a3b8' : '#1e293b'};
  border: 2px solid ${props => props.disabled ? '#e2e8f0' : '#e2e8f0'};
  padding: 8px 24px;
  border-radius: 0;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  font-size: 0.9rem;

  &:hover {
    background: ${props => props.disabled ? '#e2e8f0' : '#FAFAFA'};
    border-color: ${props => props.disabled ? '#e2e8f0' : '#0041CA'};
  }
`;

const GoalsPage = () => {
  const navigate = useNavigate();
  const { goals, setGoals } = useProfile();
  const [formData, setFormData] = useState(goals);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      requirementType: [],
      targetCompany: '',
      topicOfInterest: prev.topicOfInterest || []
    }));
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field] || []), value]
        : (prev[field] || []).filter(item => item !== value)
    }));
  };

  const trendingTopics = [
    { value: 'ai-ml', label: 'AI/ML', Icon: Brain },
    { value: 'web-development', label: 'Web Development', Icon: Globe },
    { value: 'mobile-development', label: 'Mobile Development', Icon: DeviceMobile },
    { value: 'data-science', label: 'Data Science', Icon: ChartBar },
    { value: 'cybersecurity', label: 'Cybersecurity', Icon: ShieldCheck },
    { value: 'cloud-computing', label: 'Cloud & DevOps', Icon: Cloud },
    { value: 'blockchain', label: 'Blockchain', Icon: CurrencyBtc },
    { value: 'game-development', label: 'Game Development', Icon: GameController },
    { value: 'iot', label: 'IoT', Icon: Bluetooth },
    { value: 'ar-vr', label: 'AR/VR', Icon: Cube },
    { value: 'fintech', label: 'FinTech', Icon: CreditCard },
    { value: 'healthtech', label: 'HealthTech', Icon: FirstAid },
    { value: 'edtech', label: 'EdTech', Icon: GraduationCap },
    { value: 'ecommerce', label: 'E-commerce', Icon: ShoppingCart },
    { value: 'automation', label: 'Automation', Icon: Robot }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate that at least one topic is selected
    const hasContent = formData.topicOfInterest?.length > 0;

    if (!hasContent) {
      alert('Please select at least one topic to continue.');
      return;
    }

    const payload = {
      ...formData,
      requirementType: [],
      targetCompany: '',
      topicOfInterest: formData.topicOfInterest
    };

    setGoals(payload);
    navigate('/results');
  };

  const handleBack = () => {
    navigate('/quiz');
  };

  const canSubmit = formData.topicOfInterest?.length > 0;

  const handleTopicToggle = (value) => {
    const isSelected = formData.topicOfInterest?.includes(value);
    handleCheckboxChange('topicOfInterest', value, !isSelected);
  };

  return (
    <GoalsContainer>
      <Container>
        <QuestionBubbleWrapper>
          <Avatar>
            <AvatarImage src={scalerBot} alt="Scaler Bot" />
          </Avatar>
          <QuestionBubble>
            <Title>
              Select any one preferred goal/skill you want to explore
            </Title>
          </QuestionBubble>
        </QuestionBubbleWrapper>

        <Form onSubmit={handleSubmit}>
          <TopicsGrid>
            {trendingTopics.map(topic => {
              const IconComponent = topic.Icon;
              return (
                <TopicButton
                  key={topic.value}
                  type="button"
                  selected={formData.topicOfInterest?.includes(topic.value)}
                  onClick={() => handleTopicToggle(topic.value)}
                >
                  <IconComponent size={20} weight="duotone" />
                  <span>{topic.label}</span>
                </TopicButton>
              );
            })}
          </TopicsGrid>
        </Form>
      </Container>

      <BottomNavigation>
        <NavigationContent>
          <PreviousButton type="button" onClick={handleBack}>
            Previous
          </PreviousButton>
          <NextButton type="button" onClick={handleSubmit} disabled={!canSubmit}>
            Next
          </NextButton>
        </NavigationContent>
      </BottomNavigation>
    </GoalsContainer>
  );
};

export default GoalsPage;
