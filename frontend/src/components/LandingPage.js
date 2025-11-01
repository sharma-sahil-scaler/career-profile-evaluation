import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Check } from 'phosphor-react';
import { useProfile } from '../context/ProfileContext';

const LandingContainer = styled.div`
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 40px 20px;
`;

const Content = styled.div`
  text-align: center;
  max-width: 800px;
  background: white;
  border-radius: 0;
  padding: 60px 40px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
  line-height: 1.2;
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #e11d48;
  margin-bottom: 24px;
`;

const Description = styled.p`
  font-size: 1.125rem;
  color: #64748b;
  margin-bottom: 40px;
  line-height: 1.7;
`;

const FeaturesList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 40px;
  text-align: left;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: #475569;
`;

const CheckIcon = styled.div`
  color: #10b981;
  display: flex;
  align-items: center;
`;

const StartButton = styled.button`
  background: #e11d48;
  color: white;
  border: none;
  padding: 16px 32px;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px 0 rgba(225, 29, 72, 0.4);

  &:hover {
    background: #be185d;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px 0 rgba(225, 29, 72, 0.6);
  }

  &:active {
    transform: translateY(0);
  }
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
  padding-top: 40px;
  border-top: 1px solid #e2e8f0;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #e11d48;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 4px;
`;

const LandingPage = () => {
  const navigate = useNavigate();
  const { resetProfile } = useProfile();

  const handleStart = () => {
    // Clear all previous data before starting new evaluation
    resetProfile();
    navigate('/quiz');
  };

  return (
    <LandingContainer>
      <Content>
        <Title>Free Profile Evaluation</Title>
        <Subtitle>Assess Your Tech Career Readiness in Just 2 Mins</Subtitle>
        <Description>
          Get a comprehensive evaluation of your profile for tech roles. 
          Discover your strengths, identify gaps, and receive personalized 
          recommendations to accelerate your career growth.
        </Description>
        
        <FeaturesList>
          <Feature>
            <CheckIcon><Check size={20} weight="regular" /></CheckIcon>
            Profile Strength Analysis
          </Feature>
          <Feature>
            <CheckIcon><Check size={20} weight="regular" /></CheckIcon>
            Skill Gap Assessment
          </Feature>
          <Feature>
            <CheckIcon><Check size={20} weight="regular" /></CheckIcon>
            Salary Readiness Check
          </Feature>
          <Feature>
            <CheckIcon><Check size={20} weight="regular" /></CheckIcon>
            Interview Preparation Tips
          </Feature>
          <Feature>
            <CheckIcon><Check size={20} weight="regular" /></CheckIcon>
            Personalized Resources
          </Feature>
          <Feature>
            <CheckIcon><Check size={20} weight="regular" /></CheckIcon>
            Peer Comparison
          </Feature>
        </FeaturesList>

        <StartButton onClick={handleStart}>
          Start Free Evaluation
        </StartButton>

        <StatsContainer>
          <Stat>
            <StatNumber>5min</StatNumber>
            <StatLabel>Evaluation Time</StatLabel>
          </Stat>
          <Stat>
            <StatNumber>100%</StatNumber>
            <StatLabel>Free</StatLabel>
          </Stat>
          <Stat>
            <StatNumber>13</StatNumber>
            <StatLabel>Detailed Metrics</StatLabel>
          </Stat>
        </StatsContainer>
      </Content>
    </LandingContainer>
  );
};

export default LandingPage;
