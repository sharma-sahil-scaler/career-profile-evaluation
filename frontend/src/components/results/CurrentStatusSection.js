import React from 'react';
import styled from 'styled-components';
import { CheckCircle, Target, Desktop, Handshake, ChartBar } from 'phosphor-react';

const Card = styled.div`
  background: white;
  border-radius: 0;
  padding: 32px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
`;

const MainTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
`;

const MainSubtitle = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 24px 0;
`;

const Subsection = styled.div`
  margin-bottom: 24px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 0;
  background: #ffffff;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SubsectionTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 20px;
`;

const ContentSection = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionLabel = styled.h5`
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SkillsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const SkillTag = styled.div`
  background: #ffffff;
  color: #1e293b;
  padding: 8px 16px;
  border-radius: 1000px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid ${props => props.type === 'strength' ? '#10b981' : '#d1d5db'};
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    flex-shrink: 0;
  }
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
  width: 200px;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 1000px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  background: ${props => {
    if (props.score >= 80) return '#10b981';
    if (props.score >= 60) return '#f59e0b';
    return '#ef4444';
  }};
  transition: width 0.3s ease;
  width: ${props => props.score}%;
  height: 100%;
  border-radius: 1000px;
`;

const Notes = styled.div`
  margin-top: 16px;
  font-size: 0.85rem;
  color: #475569;
  line-height: 1.4;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  border-radius: 0;
  padding: 12px;
`;

const BenchmarkContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BenchmarkLeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const BenchmarkItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 0;
  border: 1px solid #e2e8f0;
`;

const BenchmarkLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const BenchmarkValue = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
`;

const GapAnalysis = styled.div`
  background: #f8fafc;
  border-radius: 0;
  padding: 16px;
  font-size: 0.875rem;
  color: #334155;
  line-height: 1.5;
  border: 1px solid #e2e8f0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Icon = styled.span`
  display: flex;
  align-items: center;
`;

const CurrentStatusSection = ({ skillAnalysis, interviewReadiness, experienceBenchmark }) => {
  const strengths = skillAnalysis?.strengths || [];
  const areasToDevelop = skillAnalysis?.areas_to_develop || [];

  const interviewEntries = interviewReadiness ? [
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
  ] : [];

  return (
    <Card>
      <MainTitle>Your Current Status</MainTitle>
      <MainSubtitle>Understand where you stand today and what areas need attention</MainSubtitle>

      {/* Skill Analysis Subsection */}
      <Subsection>
        <SubsectionTitle>
          Skill Analysis
        </SubsectionTitle>

        <ContentSection>
          <SectionLabel>
            <Icon><CheckCircle size={16} weight="regular" /></Icon>
            Your Strengths
          </SectionLabel>
          <SkillsList>
            {strengths.length > 0
              ? strengths.map((skill, index) => (
                  <SkillTag key={index} type="strength">
                    <CheckCircle size={16} weight="fill" color="#10b981" />
                    {skill}
                  </SkillTag>
                ))
              : <SkillTag type="strength">We will highlight strengths once the evaluation is ready.</SkillTag>
            }
          </SkillsList>
        </ContentSection>

        <ContentSection>
          <SectionLabel>
            <Icon><Target size={16} weight="regular" /></Icon>
            Areas to Develop
          </SectionLabel>
          <SkillsList>
            {areasToDevelop.length > 0
              ? areasToDevelop.map((skill, index) => (
                  <SkillTag key={index} type="gap">
                    <Target size={16} weight="fill" color="#64748b" />
                    {skill}
                  </SkillTag>
                ))
              : <SkillTag type="gap">No immediate skill gaps detected.</SkillTag>
            }
          </SkillsList>
        </ContentSection>
      </Subsection>

      {/* Interview Readiness Subsection */}
      {interviewReadiness && (
        <Subsection>
          <SubsectionTitle>
            Interview Readiness
          </SubsectionTitle>

          {interviewEntries.map(({ key, icon, label, score }) => (
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
        </Subsection>
      )}

      {/* Experience Benchmark Subsection */}
      {experienceBenchmark && (
        <Subsection>
          <SubsectionTitle>
            Experience Benchmark
          </SubsectionTitle>

          <BenchmarkContainer>
            <BenchmarkLeftSection>
              <BenchmarkItem>
                <BenchmarkLabel>Your Experience</BenchmarkLabel>
                <BenchmarkValue>{experienceBenchmark.your_experience_years}</BenchmarkValue>
              </BenchmarkItem>

              <BenchmarkItem>
                <BenchmarkLabel>Typical for Target Role</BenchmarkLabel>
                <BenchmarkValue>{experienceBenchmark.typical_for_target_role_years}</BenchmarkValue>
              </BenchmarkItem>
            </BenchmarkLeftSection>

            {experienceBenchmark.gap_analysis && (
              <GapAnalysis>
                <strong>Gap Analysis:</strong> {experienceBenchmark.gap_analysis}
              </GapAnalysis>
            )}
          </BenchmarkContainer>
        </Subsection>
      )}
    </Card>
  );
};

export default CurrentStatusSection;
