import React from 'react';
import styled from 'styled-components';
import { Lightbulb } from 'phosphor-react';

const Card = styled.div`
  background: white;
  border-radius: 0;
  padding: 24px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ScoreContainer = styled.div`
  text-align: center;
  margin: 20px 0;
`;

const ScoreCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 0;
  background: ${props => {
    if (props.score >= 80) return 'linear-gradient(135deg, #10b981, #059669)';
    if (props.score >= 60) return 'linear-gradient(135deg, #f59e0b, #d97706)';
    return 'linear-gradient(135deg, #ef4444, #dc2626)';
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  color: white;
`;

const ScoreNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
`;

const ScoreLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 8px;
`;

const ScoreDescription = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 16px;
`;

const TipsContainer = styled.div`
  background: #f8fafc;
  border-radius: 0;
  padding: 16px;
`;

const TipsTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TipsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TipItem = styled.li`
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
  gap: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const TipBullet = styled.div`
  color: #3b82f6;
  font-weight: bold;
  margin-top: 2px;
`;

const ResumeScoreCard = ({ score }) => {
  const getScoreDescription = (score) => {
    if (score >= 80) return 'Strong Resume';
    if (score >= 60) return 'Good Resume';
    return 'Needs Improvement';
  };

  const getTips = (score) => {
    if (score >= 80) {
      return [
        'Highlight your technical achievements',
        'Add quantifiable results to your projects'
      ];
    } else if (score >= 60) {
      return [
        'Add more technical projects to your portfolio',
        'Include relevant keywords for ATS systems'
      ];
    } else {
      return [
        'Build at least 2-3 technical projects',
        'Include a professional summary section'
      ];
    }
  };

  return (
    <Card>
      <Title>
        <span>📄</span>
        Resume Score
      </Title>
      
      <ScoreContainer>
        <ScoreLabel>Resume Strength</ScoreLabel>
        <ScoreCircle score={score}>
          <ScoreNumber>{score}</ScoreNumber>
        </ScoreCircle>
        <ScoreDescription>{getScoreDescription(score)}</ScoreDescription>
      </ScoreContainer>

      <TipsContainer>
        <TipsTitle>
          <Lightbulb size={20} weight="regular" />
          Improvement Tips
        </TipsTitle>
        <TipsList>
          {getTips(score).map((tip, index) => (
            <TipItem key={index}>
              <TipBullet>•</TipBullet>
              {tip}
            </TipItem>
          ))}
        </TipsList>
      </TipsContainer>
    </Card>
  );
};

export default ResumeScoreCard;

