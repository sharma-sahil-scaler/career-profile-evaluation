import React from 'react';
import styled from 'styled-components';
import { Target, Briefcase, ArrowRight } from 'phosphor-react';

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

const OpportunitiesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OpportunityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0;
`;

const OpportunityIcon = styled.div`
  font-size: 1.25rem;
`;

const OpportunityText = styled.div`
  font-size: 0.875rem;
  color: #1e293b;
  font-weight: 500;
  flex: 1;
`;

const OpportunityRole = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`;

const OpportunityDetails = styled.div`
  font-size: 0.8rem;
  opacity: 0.9;
  margin-bottom: 8px;
`;

const AlumniCTA = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #c71f69;
  text-decoration: none;
  margin-top: 8px;
  transition: all 0.2s ease;

  &:hover {
    color: #a01855;
    transform: translateX(2px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px 16px;
  color: #64748b;
  font-size: 0.875rem;
`;

const MissedOpportunitiesCard = ({ opportunities }) => {
  return (
    <Card>
      <Title>
        <Target size={20} weight="regular" />
        Opportunities You Qualify For
      </Title>

      {opportunities && opportunities.length > 0 ? (
        <OpportunitiesList>
          {opportunities.map((opportunity, index) => (
            <OpportunityItem key={index}>
              <OpportunityIcon><Briefcase size={20} weight="regular" /></OpportunityIcon>
              <OpportunityText>
                {typeof opportunity === 'string' ? (
                  opportunity
                ) : (
                  <>
                    <OpportunityRole>{opportunity.role}</OpportunityRole>
                    <OpportunityDetails>
                      {opportunity.requirements_match} match • {opportunity.notes}
                    </OpportunityDetails>
                    <AlumniCTA href="/alumni" target="_blank" rel="noopener noreferrer">
                      View Alumni Who Made This Switch
                      <ArrowRight size={12} weight="bold" />
                    </AlumniCTA>
                  </>
                )}
              </OpportunityText>
            </OpportunityItem>
          ))}
        </OpportunitiesList>
      ) : (
        <EmptyState>
          <Target size={20} weight="regular" />
          <div style={{ marginTop: '8px' }}>
            Keep building your skills to unlock more opportunities!
          </div>
        </EmptyState>
      )}
    </Card>
  );
};

export default MissedOpportunitiesCard;

