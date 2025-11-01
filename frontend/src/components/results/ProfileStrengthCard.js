import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0;
  padding: 32px;
  color: white;
  position: relative;
  overflow: hidden;

  @media print {
    color: #1e293b;
    background: white;
    border: 1px solid #cbd5f5;
  }
`;

const Title = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 8px;

  @media print {
    color: inherit;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  opacity: 0.9;
`;

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 0;
  font-size: 0.875rem;
  font-weight: 600;
`;

const ScoreContainer = styled.div`
  text-align: center;
  margin: 32px 0;
`;

const ScoreCircle = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 0;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  position: relative;
`;

const ScoreNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
`;

const ScoreLabel = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 8px;
`;

const ScoreDescription = styled.div`
  font-size: 1rem;
  font-weight: 500;
`;

const Notes = styled.p`
  margin-top: 24px;
  font-size: 0.95rem;
  line-height: 1.5;
  opacity: 0.9;
`;

const BadgesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
`;

const Badge = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 0;
  font-size: 0.875rem;
  font-weight: 500;
`;

const DecorativeElements = styled.div`
  position: absolute;
  top: -50px;
  right: -50px;
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0;
`;

const DecorativeElements2 = styled.div`
  position: absolute;
  bottom: -30px;
  left: -30px;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0;
`;

const getScoreDescription = (score) => {
  if (score >= 90) return 'Exceptional Readiness';
  if (score >= 80) return 'Excellent Readiness';
  if (score >= 70) return 'Good Readiness';
  if (score >= 60) return 'Fair Readiness';
  if (score >= 50) return 'Developing Readiness';
  return 'Needs Improvement';
};

const ProfileStrengthCard = ({ score, status, notes, badges }) => {
  return (
    <Card>
      <DecorativeElements />
      <DecorativeElements2 />
      
      <div>
        <StatusPill>
          <span>✨</span>
          {status}
        </StatusPill>
        <Title>Profile Strength Score</Title>
        <Subtitle>Overall readiness for your target role</Subtitle>
      </div>

      <ScoreContainer>
        <ScoreLabel>Your Score</ScoreLabel>
        <ScoreCircle>
          <ScoreNumber>{score}%</ScoreNumber>
        </ScoreCircle>
        <ScoreDescription>{getScoreDescription(score)}</ScoreDescription>
      </ScoreContainer>

      {notes && <Notes>{notes}</Notes>}

      {badges && badges.length > 0 && (
        <BadgesContainer>
          {badges.slice(0, 4).map((badge, index) => (
            <Badge key={index}>
              {typeof badge === 'string' ? badge : badge.name}
            </Badge>
          ))}
        </BadgesContainer>
      )}
    </Card>
  );
};

export default ProfileStrengthCard;
