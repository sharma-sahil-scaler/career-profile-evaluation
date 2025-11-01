import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Xarrow from 'react-xarrows';
import { ArrowRight, Star, ArrowsLeftRight, ArrowBendUpRight } from 'phosphor-react';

const Container = styled.div`
  background: white;
  border-radius: 0;
  padding: 40px 32px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  margin-bottom: 48px;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 24px 0;
`;

const PathContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 80px;
  margin-bottom: 32px;
  position: relative;
  max-width: 100%;
  overflow: visible;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;

  &:nth-child(2) {
    align-items: center;
    justify-content: flex-start;
  }
`;

const CurrentRoleCard = styled.div`
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 0;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CurrentRoleInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const CurrentRoleTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
`;

const CurrentBadge = styled.div`
  display: inline-block;
  background: #e0f2fe;
  color: #0369a1;
  padding: 2px 6px;
  border-radius: 0;
  font-size: 0.7rem;
  font-weight: 500;
`;

const CategoryCard = styled.div`
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 0;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 600;
  position: relative;
  z-index: 10;
  width: 160px;

  svg {
    color: ${props => {
      if (props.type === 'most-common') return '#10b981';
      if (props.type === 'similar') return '#3b82f6';
      if (props.type === 'pivot') return '#9333ea';
      return '#64748b';
    }};
  }
`;

const RoleCard = styled.div`
  background: ${props => props.isPriority ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : '#ffffff'};
  border: 2px solid ${props => props.isPriority ? '#10b981' : '#e2e8f0'};
  border-radius: 0;
  padding: 12px;
  display: flex;
  gap: 10px;
  position: relative;
  z-index: 10;

  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

const RoleContent = styled.div`
  flex: 1;
`;

const RoleHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
`;

const RoleTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  flex: 1;
`;

const RoleDescription = styled.p`
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.5;
  margin: 8px 0 0 0;
  max-height: 3.9375rem;
  overflow: hidden;
`;

const RoleFooter = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

const Salary = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: #059669;
`;

const MatchBadge = styled.div`
  background: ${props => {
    if (props.match >= 80) return '#dcfce7';
    if (props.match >= 60) return '#fef3c7';
    return '#f1f5f9';
  }};
  color: ${props => {
    if (props.match >= 80) return '#15803d';
    if (props.match >= 60) return '#a16207';
    return '#475569';
  }};
  padding: 3px 8px;
  border-radius: 0;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
`;

const CTAContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
`;

const AlumniCTA = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: #c71f69;
  color: white;
  border: none;
  border-radius: 0;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: #a01855;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(199, 31, 105, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const categorizeRoles = (roles) => {
  const sorted = [...roles].sort((a, b) => (b.match_score || 0) - (a.match_score || 0));

  const categories = {
    mostLikely: [],
    similar: [],
    pivot: []
  };

  sorted.forEach((role, index) => {
    const match = role.match_score || 0;
    if (categories.mostLikely.length < 1 && index === 0 && match >= 75) {
      categories.mostLikely.push(role);
    } else if (categories.similar.length < 2 && match >= 60) {
      categories.similar.push(role);
    } else if (categories.pivot.length < 1) {
      categories.pivot.push(role);
    }
  });

  return categories;
};

const getCategoryBadgeType = (category) => {
  if (category === 'mostLikely') return 'most-common';
  if (category === 'similar') return 'similar';
  return 'pivot';
};

const getCategoryIcon = (category) => {
  if (category === 'mostLikely') return <Star size={14} weight="fill" />;
  if (category === 'similar') return <ArrowsLeftRight size={14} weight="regular" />;
  return <ArrowBendUpRight size={14} weight="regular" />;
};

const getCategoryLabel = (category) => {
  if (category === 'mostLikely') return 'Most likely match';
  if (category === 'similar') return 'Similar jobs';
  return 'Pivot';
};

const getLineColor = (category) => {
  if (category === 'mostLikely') return '#10b981';
  if (category === 'similar') return '#3b82f6';
  return '#9333ea';
};

const formatSalary = (salary) => {
  if (!salary) return null;
  if (salary.toString().includes('₹')) return salary;
  return `₹${salary}`;
};

const CareerPathVisualization = ({ currentRole, background, recommendedRoles = [] }) => {
  const [showArrows, setShowArrows] = useState(false);

  // Categorize roles into three groups
  const categories = categorizeRoles(recommendedRoles);

  // Get first letter for avatar
  const avatarLetter = currentRole ? currentRole.charAt(0).toUpperCase() : 'C';

  // Determine background label
  const backgroundLabel = background === 'non-tech' ? 'Non-Tech Professional' : 'Tech Professional';

  // Force re-render arrows after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowArrows(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const renderRoleCard = (role, category, globalIndex) => {
    const match = role.match_score || 0;
    const salary = formatSalary(role.salary_range_inr || role.salary_range_usd || role.salary);
    const isPriority = category === 'mostLikely';

    return (
      <RoleCard
        key={`${category}-${globalIndex}`}
        id={`role-${category}-${globalIndex}`}
        isPriority={isPriority}
      >
        <RoleContent>
          <RoleHeader>
            <RoleTitle>
              {role.title || role.role}
            </RoleTitle>
            <MatchBadge match={match}>{match}% match</MatchBadge>
          </RoleHeader>

          {(role.reason || role.reasoning) && (
            <RoleDescription>
              {role.reason || role.reasoning}
            </RoleDescription>
          )}

          <RoleFooter>
            {salary && (
              <Salary>{salary}</Salary>
            )}
          </RoleFooter>
        </RoleContent>
      </RoleCard>
    );
  };

  return (
    <Container>
      <Title>Career Transition</Title>
      <Subtitle>Explore potential career paths based on your profile and interests</Subtitle>

      <PathContainer>
        {/* Column 1: Current Role */}
        <Column>
          <CurrentRoleCard id="current-role">
            <CurrentRoleInfo>
              <CurrentRoleTitle>{backgroundLabel}</CurrentRoleTitle>
              <CurrentBadge>You are here</CurrentBadge>
            </CurrentRoleInfo>
          </CurrentRoleCard>
        </Column>

        {/* Column 2: Category Labels */}
        <Column>
          {categories.mostLikely.length > 0 && (
            <CategoryCard type="most-common" id="category-mostLikely">
              <Star size={16} weight="fill" />
              Most likely match
            </CategoryCard>
          )}

          {categories.similar.length > 0 && (
            <CategoryCard type="similar" id="category-similar">
              <ArrowsLeftRight size={16} weight="regular" />
              Similar jobs
            </CategoryCard>
          )}

          {categories.pivot.length > 0 && (
            <CategoryCard type="pivot" id="category-pivot">
              <ArrowBendUpRight size={16} weight="regular" />
              Pivot
            </CategoryCard>
          )}
        </Column>

        {/* Column 3: Role Cards */}
        <Column>
          {categories.mostLikely.map((role, index) => renderRoleCard(role, 'mostLikely', index))}
          {categories.similar.map((role, index) => renderRoleCard(role, 'similar', index))}
          {categories.pivot.map((role, index) => renderRoleCard(role, 'pivot', index))}
        </Column>

        {/* Xarrow Connections */}
        {showArrows && (
          <>
            {/* Most Likely Match connections */}
            {categories.mostLikely.length > 0 && (
              <>
                <Xarrow
                  start="current-role"
                  end="category-mostLikely"
                  color="#a7f3d0"
                  strokeWidth={8}
                  curveness={0.8}
                  headSize={0}
                  path="smooth"
                  zIndex={1}
                />
                {categories.mostLikely.map((_, index) => (
                  <Xarrow
                    key={`arrow-mostLikely-${index}`}
                    start="category-mostLikely"
                    end={`role-mostLikely-${index}`}
                    color="#a7f3d0"
                    strokeWidth={8}
                    curveness={0.6}
                    headSize={0}
                    path="smooth"
                    zIndex={1}
                  />
                ))}
              </>
            )}

            {/* Similar Jobs connections */}
            {categories.similar.length > 0 && (
              <>
                <Xarrow
                  start="current-role"
                  end="category-similar"
                  color="#bfdbfe"
                  strokeWidth={8}
                  curveness={0.8}
                  headSize={0}
                  path="smooth"
                  zIndex={1}
                />
                {categories.similar.map((_, index) => (
                  <Xarrow
                    key={`arrow-similar-${index}`}
                    start="category-similar"
                    end={`role-similar-${index}`}
                    color="#bfdbfe"
                    strokeWidth={8}
                    curveness={0.6}
                    headSize={0}
                    path="smooth"
                    zIndex={1}
                  />
                ))}
              </>
            )}

            {/* Pivot connections */}
            {categories.pivot.length > 0 && (
              <>
                <Xarrow
                  start="current-role"
                  end="category-pivot"
                  color="#fbcfe8"
                  strokeWidth={8}
                  curveness={0.8}
                  headSize={0}
                  path="smooth"
                  zIndex={1}
                />
                {categories.pivot.map((_, index) => (
                  <Xarrow
                    key={`arrow-pivot-${index}`}
                    start="category-pivot"
                    end={`role-pivot-${index}`}
                    color="#fbcfe8"
                    strokeWidth={8}
                    curveness={0.6}
                    headSize={0}
                    path="smooth"
                    zIndex={1}
                  />
                ))}
              </>
            )}
          </>
        )}
      </PathContainer>

      <CTAContainer>
        <AlumniCTA href="/alumni" target="_blank" rel="noopener noreferrer">
          See Successful Alumni Profiles
          <ArrowRight size={16} weight="bold" />
        </AlumniCTA>
      </CTAContainer>
    </Container>
  );
};

export default CareerPathVisualization;
