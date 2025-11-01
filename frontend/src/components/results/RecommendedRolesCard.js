import React from 'react';
import styled from 'styled-components';
import { Target, ArrowRight } from 'phosphor-react';

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

const RolesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

const RoleCard = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 1px solid #cbd5e1;
  border-radius: 0;
  padding: 16px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #3b82f6;
  }
`;

const RoleTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
`;

const RoleDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Level = styled.span`
  background: #dbeafe;
  color: #1e40af;
  padding: 2px 8px;
  border-radius: 0;
  font-size: 0.75rem;
  font-weight: 500;
`;

const Salary = styled.span`
  color: #059669;
  font-weight: 600;
  font-size: 0.875rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px 16px;
  color: #64748b;
  font-size: 0.875rem;
`;

const Reason = styled.div`
  font-size: 0.8rem;
  color: #475569;
  line-height: 1.4;
  margin-bottom: 12px;
`;

const MatchScore = styled.div`
  background: #dcfce7;
  color: #166534;
  padding: 4px 8px;
  border-radius: 0;
  font-size: 0.75rem;
  font-weight: 600;
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
  transition: all 0.2s ease;

  &:hover {
    color: #a01855;
    transform: translateX(2px);
  }
`;

const formatSeniority = (value) => {
  if (!value) return 'Not specified';
  return value
    .toString()
    .replace(/_/g, ' ')
    .replace(/\b(\w)/g, (match) => match.toUpperCase());
};

const formatSalary = (salary) => {
  if (!salary) return null;

  // If salary is already in INR format (starts with ₹)
  if (salary.toString().includes('₹')) return salary;

  // If it's a number or range like "12-18L"
  return `₹${salary}`;
};

const RecommendedRolesCard = ({ recommendedRoles = [] }) => {
  return (
    <Card>
      <Title>
        <Target size={20} weight="regular" />
        Recommended Roles Based on Your Interests
      </Title>

      {recommendedRoles.length > 0 ? (
        <RolesGrid>
          {recommendedRoles.map((roleData, index) => {
            const salary = formatSalary(roleData.salary_range_inr || roleData.salary_range_usd || roleData.salary);

            return (
              <RoleCard key={index}>
                <RoleTitle>{roleData.title || roleData.role}</RoleTitle>
                <RoleDetails>
                  {roleData.match_score ? (
                    <MatchScore>{roleData.match_score}% Match</MatchScore>
                  ) : roleData.seniority ? (
                    <Level>{formatSeniority(roleData.seniority || roleData.level)}</Level>
                  ) : null}
                  {salary && <Salary>{salary}</Salary>}
                </RoleDetails>
                {(roleData.reason || roleData.reasoning) && (
                  <Reason>{roleData.reason || roleData.reasoning}</Reason>
                )}
                <AlumniCTA href="/alumni" target="_blank" rel="noopener noreferrer">
                  See Successful Alumni Profiles
                  <ArrowRight size={12} weight="bold" />
                </AlumniCTA>
              </RoleCard>
            );
          })}
        </RolesGrid>
      ) : (
        <EmptyState>
          <Target size={20} weight="regular" />
          <div style={{ marginTop: '8px' }}>
            Select topics of interest to see recommended roles!
          </div>
        </EmptyState>
      )}
    </Card>
  );
};

export default RecommendedRolesCard;
