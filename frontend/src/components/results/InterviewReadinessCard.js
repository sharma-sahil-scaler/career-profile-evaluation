import React from 'react';
import styled from 'styled-components';
import { Target, Desktop, Handshake } from 'phosphor-react';

const Card = styled.div`
  background: white;
  border-radius: 0;
  padding: 24px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
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

const ReadinessItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
`;

const ReadinessLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ScoreContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Score = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => {
    if (props.score >= 80) return '#059669';
    if (props.score >= 60) return '#d97706';
    return '#dc2626';
  }};
`;

const ProgressBar = styled.div`
  width: 60px;
  height: 6px;
  background-color: #e2e8f0;
  border-radius: 0;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  background: #64748b;
  transition: width 0.3s ease;
  width: ${props => props.score}%;
  height: 100%;
`;

const Notes = styled.div`
  margin-top: 16px;
  font-size: 0.85rem;
  color: #475569;
  line-height: 1.4;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;  border-radius: 0;
  padding: 12px;
`;

const InterviewReadinessCard = ({ interviewReadiness }) => {
  if (!interviewReadiness) {
    return null;
  }

  const entries = [
    {
      key: 'technical',
      icon: <Desktop size={20} weight="regular" />,
      label: 'Technical Interview',
      score: interviewReadiness.technical_interview_percent ?? 0,
    },
    {
      key: 'hr',
      icon: <Handshake size={20} weight="regular" />,
      label: 'HR / Behavioral',
      score: interviewReadiness.hr_behavioral_percent ?? 0,
    },
  ];

  return (
    <Card>
      <Title>
        <Target size={20} weight="regular" />
        Interview Readiness
      </Title>
      
      {entries.map(({ key, icon, label, score }) => (
        <ReadinessItem key={key}>
          <ReadinessLabel>
            <span>{icon}</span>
            {label}
          </ReadinessLabel>
          <ScoreContainer>
            <Score score={score}>{score}%</Score>
            <ProgressBar>
              <ProgressFill score={score} />
            </ProgressBar>
          </ScoreContainer>
        </ReadinessItem>
      ))}

      {interviewReadiness.technical_notes && (
        <Notes>
          <strong>Coach notes:</strong> {interviewReadiness.technical_notes}
        </Notes>
      )}
    </Card>
  );
};

export default InterviewReadinessCard;
