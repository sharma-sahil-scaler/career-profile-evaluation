import React from 'react';
import styled from 'styled-components';

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

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
`;

const Tool = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;  border-radius: 0;
  padding: 16px;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }
`;

const ToolName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
`;

const ToolRecommendationsCard = ({ tools = [] }) => {
  return (
    <Card>
      <Title>
        <span>🛠️</span>
        Recommended Tools
      </Title>
      {tools.length > 0 ? (
        <ToolsGrid>
          {tools.map((tool, index) => (
            <Tool key={index}>
              <ToolName>{typeof tool === 'string' ? tool : tool.name}</ToolName>
            </Tool>
          ))}
        </ToolsGrid>
      ) : (
        <div>No tool recommendations were generated for this profile.</div>
      )}
    </Card>
  );
};

export default ToolRecommendationsCard;
