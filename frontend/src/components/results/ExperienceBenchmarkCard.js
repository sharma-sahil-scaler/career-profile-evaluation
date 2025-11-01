import React from 'react';
import styled from 'styled-components';
import { ChartBar } from 'phosphor-react';

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

const BenchmarkItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const Value = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
`;

const GapAnalysis = styled.div`
  background: #f8fafc;
  border-radius: 0;
  padding: 12px;
  font-size: 0.875rem;
  color: #334155;
  line-height: 1.5;
`;

const ExperienceBenchmarkCard = ({ experienceBenchmark }) => {
  if (!experienceBenchmark) {
    return null;
  }

  const { your_experience_years, typical_for_target_role_years, gap_analysis } = experienceBenchmark;

  return (
    <Card>
      <Title>
        <ChartBar size={20} weight="regular" />
        Experience Benchmark
      </Title>
      
      <BenchmarkItem>
        <Label>Your Experience</Label>
        <Value>{your_experience_years}</Value>
      </BenchmarkItem>

      <BenchmarkItem>
        <Label>Typical for Target Role</Label>
        <Value>{typical_for_target_role_years}</Value>
      </BenchmarkItem>

      <BenchmarkItem>
        <Label>Gap Analysis</Label>
        <GapAnalysis>{gap_analysis}</GapAnalysis>
      </BenchmarkItem>
    </Card>
  );
};

export default ExperienceBenchmarkCard;
