import React from 'react';
import styled from 'styled-components';
import { Users, LinkedinLogo } from 'phosphor-react';

// Wrapper for the entire section (title + card)
const SectionWrapper = styled.div`
  margin-bottom: 64px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;

const SectionHeading = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SectionSubtitle = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 16px 0;
  line-height: 1.4;
`;

const SectionDivider = styled.div`
  height: 1px;
  background: #e2e8f0;
  margin-bottom: 20px;
`;

// Card container - bordered box without title
const CardContainer = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 0;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const PeerGroupWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const PeerGroupText = styled.div`
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
`;

const DataSourceAttribution = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 24px;
`;

const VisualizationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
  }
`;

const DonutChartContainer = styled.div`
  position: relative;
  width: 160px;
  height: 160px;
  flex-shrink: 0;
`;

const DonutSvg = styled.svg`
  transform: rotate(-90deg);
`;

const CenterLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const CenterNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
  display: flex;
  align-items: baseline;
  gap: 2px;
`;

const CenterSuperscript = styled.span`
  font-size: 1rem;
  font-weight: 600;
`;

const CenterText = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 4px;
`;

const LegendContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const LegendColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 0;
  background: ${props => props.color};
  flex-shrink: 0;
  margin-top: 2px;
`;

const LegendContent = styled.div`
  flex: 1;
`;

const LegendLabel = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
`;

const LegendValue = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.4;
`;

const PeerComparisonCard = ({ peerComparison }) => {
  if (!peerComparison) {
    return null;
  }

  const currentPercentile = peerComparison.percentile || 40;
  // Ensure potential is ALWAYS higher than current (minimum 5% gap, fallback to +15)
  const rawPotential = peerComparison.potential_percentile ?? currentPercentile + 15;
  const potentialPercentile = Math.max(rawPotential, currentPercentile + 5);
  const peerGroupDescription = peerComparison.peer_group_description ?? "Similar professionals in tech";

  // Donut chart calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 20;

  // Calculate offsets for SVG circles (drawn from top, clockwise)
  // Current percentile (solid blue)
  const currentOffset = circumference - (currentPercentile / 100) * circumference;

  // Potential percentile (light blue, full potential arc)
  const potentialOffset = circumference - (potentialPercentile / 100) * circumference;

  return (
    <SectionWrapper>
      {/* Title and Subtitle - Outside the box */}
      <SectionHeading>Peer Comparison</SectionHeading>
      <SectionSubtitle>See how you compare to similar professionals in your field</SectionSubtitle>
      <SectionDivider />

      {/* Card Container - Bordered box */}
      <CardContainer>
        {/* Peer Group - Clean text with icon */}
        <PeerGroupWrapper>
          <Users size={20} weight="regular" color="#64748b" />
          <PeerGroupText>{peerGroupDescription}</PeerGroupText>
        </PeerGroupWrapper>
        <DataSourceAttribution>
          <LinkedinLogo size={18} weight="fill" color="#0A66C2" />
          Data sourced from LinkedIn and Scaler's placement records
        </DataSourceAttribution>

        {/* Donut Chart with Legend */}
        <VisualizationContainer>
          <DonutChartContainer>
            <DonutSvg width="160" height="160">
              {/* Define diagonal stripes pattern for potential */}
              <defs>
                <pattern id="diagonalStripes" patternUnits="userSpaceOnUse" width="4" height="4">
                  <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="#6ee7b7" strokeWidth="1" />
                </pattern>
              </defs>

              {/* Background gray circle (full circle) */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth={strokeWidth}
              />

              {/* Potential percentile arc (light green - 30% opacity) */}
              <circle
                className="potential-arc"
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="rgba(5, 150, 105, 0.3)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={potentialOffset}
                strokeLinecap="butt"
              />

              {/* Current percentile arc (bright green, overlaid on top) */}
              <circle
                className="current-arc"
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="#059669"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={currentOffset}
                strokeLinecap="butt"
              />
            </DonutSvg>

            <CenterLabel>
              <CenterNumber>
                {currentPercentile}
                <CenterSuperscript>th</CenterSuperscript>
              </CenterNumber>
              <CenterText>percentile</CenterText>
            </CenterLabel>
          </DonutChartContainer>

          <LegendContainer>
            <LegendItem>
              <LegendColor color="#059669" />
              <LegendContent>
                <LegendLabel>Current Percentile: {currentPercentile}th</LegendLabel>
                <LegendValue>
                  You currently rank better than {currentPercentile}% of peers in this group based on your experience, skills, and interview readiness.
                </LegendValue>
              </LegendContent>
            </LegendItem>

            <LegendItem>
              <LegendColor color="rgba(5, 150, 105, 0.3)" />
              <LegendContent>
                <LegendLabel>Potential Percentile: {potentialPercentile}th</LegendLabel>
                <LegendValue>
                  With focused improvement in key areas, you could reach the {potentialPercentile}th percentile.
                </LegendValue>
              </LegendContent>
            </LegendItem>
          </LegendContainer>
        </VisualizationContainer>
      </CardContainer>
    </SectionWrapper>
  );
};

export default PeerComparisonCard;
