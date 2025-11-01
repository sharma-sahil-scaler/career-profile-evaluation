import React from 'react';
import styled from 'styled-components';
import { TrendUp } from 'phosphor-react';

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

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background-color: #e2e8f0;
  border-radius: 0;
  overflow: hidden;
  margin: 16px 0;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => {
    if (props.readiness === 'ready') return 'linear-gradient(90deg, #10b981, #059669)';
    if (props.readiness === 'moderate') return 'linear-gradient(90deg, #f59e0b, #d97706)';
    return 'linear-gradient(90deg, #ef4444, #dc2626)';
  }};
  transition: width 0.3s ease;
  width: ${props => {
    if (props.readiness === 'ready') return '85%';
    if (props.readiness === 'moderate') return '60%';
    return '35%';
  }};
`;

const StatusItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
`;

const StatusLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const StatusValue = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
`;

const SalaryReadinessCard = ({ readiness }) => {
  const getReadinessText = () => {
    switch(readiness.gap) {
      case 'ready': return 'Ready for Target Salary';
      case 'moderate': return 'Getting Close';
      default: return 'Needs Development';
    }
  };

  const getReadinessIcon = () => {
    switch(readiness.gap) {
      case 'ready': return '💰';
      case 'moderate': return <TrendUp size={20} weight="regular" />;
      default: return '💸';
    }
  };

  return (
    <Card>
      <Title>
        <span>{getReadinessIcon()}</span>
        Salary Readiness
      </Title>
      
      <StatusItem>
        <StatusLabel>Current Market Position</StatusLabel>
        <StatusValue>{readiness.current}</StatusValue>
      </StatusItem>

      <StatusItem>
        <StatusLabel>Target Salary</StatusLabel>
        <StatusValue>{readiness.target || 'Not specified'}</StatusValue>
      </StatusItem>

      <ProgressBar>
        <ProgressFill readiness={readiness.gap} />
      </ProgressBar>
      
      <StatusItem>
        <StatusLabel>Readiness Status</StatusLabel>
        <StatusValue>{getReadinessText()}</StatusValue>
      </StatusItem>
    </Card>
  );
};

export default SalaryReadinessCard;

