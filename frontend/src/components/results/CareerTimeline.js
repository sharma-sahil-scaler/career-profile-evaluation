import React from 'react';
import styled from 'styled-components';
import { Clock, Target, TrendUp, CheckCircle, ArrowRight } from 'phosphor-react';

const TimelineContainer = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0;
  padding: 32px;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const TimelineHeader = styled.div`
  margin-bottom: 32px;
`;

const TimelineTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    color: #c71f69;
  }
`;

const TimelineSubtitle = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
`;

const TimelineDivider = styled.div`
  height: 1px;
  background: #e2e8f0;
  margin: 20px 0;
`;

const RoleCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const RoleCard = styled.div`
  background: ${props => props.isPrimary ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : '#f8fafc'};
  border: 2px solid ${props => props.isPrimary ? '#fbbf24' : '#e2e8f0'};
  border-radius: 0;
  padding: 20px;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const RoleBadge = styled.div`
  position: absolute;
  top: -10px;
  right: 16px;
  background: ${props => props.isPrimary ? '#c71f69' : '#64748b'};
  color: white;
  padding: 4px 12px;
  border-radius: 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RoleTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
  padding-right: 40px;
`;

const TimelineInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: #475569;

  svg {
    color: ${props => props.iconColor || '#64748b'};
    flex-shrink: 0;
  }

  strong {
    font-weight: 600;
    color: #1e293b;
  }
`;

const KeyGap = styled.div`
  background: ${props => props.isPrimary ? '#fef3c7' : '#f1f5f9'};
  border: 1px solid ${props => props.isPrimary ? '#fde047' : '#cbd5e1'};
  border-radius: 0;
  padding: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
  gap: 10px;

  svg {
    color: ${props => props.isPrimary ? '#d97706' : '#64748b'};
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const KeyGapText = styled.div`
  font-size: 0.8125rem;
  color: #334155;
  line-height: 1.5;

  strong {
    font-weight: 600;
    color: #1e293b;
  }
`;

const MilestonesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MilestoneItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.8125rem;
  color: #475569;
  line-height: 1.5;
  padding-left: 8px;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    background: ${props => props.isPrimary ? '#c71f69' : '#94a3b8'};
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 6px;
  }
`;

const ConfidenceBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: ${props => {
    if (props.confidence === 'high') return '#dcfce7';
    if (props.confidence === 'medium') return '#fef3c7';
    return '#fee2e2';
  }};
  border: 1px solid ${props => {
    if (props.confidence === 'high') return '#86efac';
    if (props.confidence === 'medium') return '#fde047';
    return '#fecaca';
  }};
  color: ${props => {
    if (props.confidence === 'high') return '#166534';
    if (props.confidence === 'medium') return '#92400e';
    return '#991b1b';
  }};
  border-radius: 0;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 12px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
  font-size: 0.875rem;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 0;
`;

const CareerTimeline = ({ recommendedRoles, targetRoleName }) => {
  if (!recommendedRoles || recommendedRoles.length === 0) {
    return (
      <TimelineContainer>
        <TimelineHeader>
          <TimelineTitle>
            <Clock size={20} weight="bold" />
            Career Timeline
          </TimelineTitle>
          <TimelineSubtitle>
            Realistic timelines to achieve your target roles based on current skill gaps
          </TimelineSubtitle>
        </TimelineHeader>
        <TimelineDivider />
        <EmptyState>
          No role recommendations available yet. Complete your profile evaluation to see personalized timelines.
        </EmptyState>
      </TimelineContainer>
    );
  }

  // Remove duplicate roles based on title
  const uniqueRoles = recommendedRoles.reduce((acc, role) => {
    const title = role.title || role.role;
    if (!acc.find(r => (r.title || r.role) === title)) {
      acc.push(role);
    }
    return acc;
  }, []);

  // Find primary role (first one, typically the best match)
  const primaryRole = uniqueRoles[0];
  // Show up to 2 alternate roles (max 3 total cards: 1 target + 2 alternates)
  const otherRoles = uniqueRoles.slice(1, 3);

  return (
    <TimelineContainer>
      <TimelineHeader>
        <TimelineTitle>
          <Clock size={20} weight="bold" />
          Career Timeline
        </TimelineTitle>
        <TimelineSubtitle>
          Realistic timelines to achieve your target roles based on current skill gaps
        </TimelineSubtitle>
      </TimelineHeader>
      <TimelineDivider />

      <RoleCardsContainer>
        {/* Primary Role Card */}
        <RoleCard isPrimary={true}>
          <RoleBadge isPrimary={true}>Primary Target</RoleBadge>
          <RoleTitle>{primaryRole.title || primaryRole.role}</RoleTitle>

          <TimelineInfo>
            <InfoRow iconColor="#c71f69">
              <Clock size={18} weight="bold" />
              <div>
                <strong>{primaryRole.timeline_text || `${primaryRole.min_months}-${primaryRole.max_months} months`}</strong>
              </div>
            </InfoRow>

            {primaryRole.salary_range_usd && (
              <InfoRow iconColor="#059669">
                <TrendUp size={18} weight="bold" />
                <div>{primaryRole.salary_range_usd}</div>
              </InfoRow>
            )}
          </TimelineInfo>

          {primaryRole.key_gap && (
            <KeyGap isPrimary={true}>
              <Target size={16} weight="fill" />
              <KeyGapText>
                <strong>Key Focus:</strong> {primaryRole.key_gap}
              </KeyGapText>
            </KeyGap>
          )}

          {primaryRole.milestones && primaryRole.milestones.length > 0 && (
            <MilestonesList>
              {primaryRole.milestones.map((milestone, index) => (
                <MilestoneItem key={index} isPrimary={true}>
                  {milestone}
                </MilestoneItem>
              ))}
            </MilestonesList>
          )}

          {primaryRole.confidence && (
            <ConfidenceBadge confidence={primaryRole.confidence}>
              {primaryRole.confidence === 'high' && <CheckCircle size={14} weight="fill" />}
              {primaryRole.confidence === 'medium' && <ArrowRight size={14} weight="bold" />}
              {primaryRole.confidence.charAt(0).toUpperCase() + primaryRole.confidence.slice(1)} Confidence
            </ConfidenceBadge>
          )}
        </RoleCard>

        {/* Other Role Cards */}
        {otherRoles.map((role, index) => (
          <RoleCard key={index} isPrimary={false}>
            <RoleBadge isPrimary={false}>Alternative</RoleBadge>
            <RoleTitle>{role.title || role.role}</RoleTitle>

            <TimelineInfo>
              <InfoRow iconColor="#64748b">
                <Clock size={18} weight="bold" />
                <div>
                  <strong>{role.timeline_text || `${role.min_months}-${role.max_months} months`}</strong>
                </div>
              </InfoRow>

              {role.salary_range_usd && (
                <InfoRow iconColor="#059669">
                  <TrendUp size={18} weight="bold" />
                  <div>{role.salary_range_usd}</div>
                </InfoRow>
              )}
            </TimelineInfo>

            {role.key_gap && (
              <KeyGap isPrimary={false}>
                <Target size={16} weight="fill" />
                <KeyGapText>
                  <strong>Key Focus:</strong> {role.key_gap}
                </KeyGapText>
              </KeyGap>
            )}

            {role.milestones && role.milestones.length > 0 && (
              <MilestonesList>
                {role.milestones.slice(0, 2).map((milestone, idx) => (
                  <MilestoneItem key={idx} isPrimary={false}>
                    {milestone}
                  </MilestoneItem>
                ))}
              </MilestonesList>
            )}

            {role.confidence && (
              <ConfidenceBadge confidence={role.confidence}>
                {role.confidence === 'high' && <CheckCircle size={14} weight="fill" />}
                {role.confidence === 'medium' && <ArrowRight size={14} weight="bold" />}
                {role.confidence.charAt(0).toUpperCase() + role.confidence.slice(1)} Confidence
              </ConfidenceBadge>
            )}
          </RoleCard>
        ))}
      </RoleCardsContainer>
    </TimelineContainer>
  );
};

export default CareerTimeline;
