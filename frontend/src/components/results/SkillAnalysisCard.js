import React from 'react';
import styled from 'styled-components';
import { CheckCircle, Target } from 'phosphor-react';

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
`;

const Section = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SkillsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SkillTag = styled.div`
  background: ${props => props.type === 'strength' ? '#f1f5f9' : '#fee2e2'};
  color: ${props => props.type === 'strength' ? '#1e293b' : '#dc2626'};
  padding: 6px 12px;
  border-radius: 0;
  font-size: 0.875rem;
  font-weight: 500;
`;

const Icon = styled.span`
  display: flex;
  align-items: center;
`;

const SkillAnalysisCard = ({ skillAnalysis }) => {
  const strengths = skillAnalysis?.strengths || [];
  const areasToDevelop = skillAnalysis?.areas_to_develop || [];

  return (
    <Card>
      <Title>Skill Analysis</Title>
      
      <Section>
        <SectionTitle>
          <Icon><CheckCircle size={20} weight="regular" /></Icon>
          Your Strengths
        </SectionTitle>
        <SkillsList>
          {strengths.length > 0
            ? strengths.map((skill, index) => (
                <SkillTag key={index} type="strength">
                  {skill}
                </SkillTag>
              ))
            : <SkillTag type="strength">We will highlight strengths once the evaluation is ready.</SkillTag>
          }
        </SkillsList>
      </Section>

      <Section>
        <SectionTitle>
          <Icon><Target size={20} weight="regular" /></Icon>
          Areas to Develop
        </SectionTitle>
        <SkillsList>
          {areasToDevelop.length > 0
            ? areasToDevelop.map((skill, index) => (
                <SkillTag key={index} type="gap">
                  {skill}
                </SkillTag>
              ))
            : <SkillTag type="gap">No immediate skill gaps detected.</SkillTag>
          }
        </SkillsList>
      </Section>
    </Card>
  );
};

export default SkillAnalysisCard;
