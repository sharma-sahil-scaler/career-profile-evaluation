import React from 'react';
import styled from 'styled-components';
import { GraduationCap } from 'phosphor-react';

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

const ResourceContainer = styled.div`
  border: 2px solid #e2e8f0;
  border-radius: 0;
  padding: 20px;
  background: #f8fafc;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }
`;

const ResourceType = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #3b82f6;
  color: white;
  border-radius: 0;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 12px;
`;

const ResourceTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
`;

const ResourceDescription = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 16px;
`;

const ResourceButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 0;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #2563eb;
  }
`;

const LearningResourceCard = ({ resource }) => {
  const getResourceIcon = (type) => {
    switch(type) {
      case 'masterclass': return <GraduationCap size={16} weight="regular" />;
      case 'blog': return '📖';
      case 'course': return '🎥';
      default: return '📚';
    }
  };

  return (
    <Card>
      <Title>
        <span>🎁</span>
        Free Learning Resource
      </Title>
      
      <ResourceContainer>
        <ResourceType>
          <span>{getResourceIcon(resource.type)}</span>
          {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
        </ResourceType>
        
        <ResourceTitle>{resource.title}</ResourceTitle>
        <ResourceDescription>{resource.description}</ResourceDescription>
        
        <ResourceButton onClick={() => window.open(resource.url, '_blank')}>
          Access Free Resource
        </ResourceButton>
      </ResourceContainer>
    </Card>
  );
};

export default LearningResourceCard;

