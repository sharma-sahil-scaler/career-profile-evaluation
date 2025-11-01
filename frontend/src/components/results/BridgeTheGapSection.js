import React from 'react';
import styled from 'styled-components';
import { Lightning, ArrowRight, Wrench } from 'phosphor-react';

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

const WinsList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const WinItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #f0f9ff;
  border: 1px solid #e0f2fe;
  border-radius: 0;
`;

const WinNumber = styled.div`
  background: #3b82f6;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const WinContent = styled.div`
  flex: 1;
`;

const WinTitle = styled.div`
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
  margin-bottom: 8px;
`;

const WinDescription = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 16px;
`;

const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #c71f69;
  color: white;
  border: none;
  border-radius: 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: #a01855;
    transform: translateX(2px);
  }

  &:active {
    transform: translateX(0);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
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
  flex-direction: column;
  border-radius: 0;
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

const getCTAForWin = (win) => {
  const title = typeof win === 'string' ? win : win.title;
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('system design') || lowerTitle.includes('course')) {
    return { text: 'Explore Courses', url: '/courses' };
  } else if (lowerTitle.includes('mock interview') || lowerTitle.includes('interview')) {
    return { text: 'Try AI Mock Interview', url: '/ai-mock-interview' };
  } else if (lowerTitle.includes('project') || lowerTitle.includes('portfolio')) {
    return { text: 'View Project Ideas', url: '/resources' };
  } else if (lowerTitle.includes('linkedin') || lowerTitle.includes('resume')) {
    return { text: 'Get Resume Tips', url: '/resources' };
  }
  return { text: 'Learn More', url: '/resources' };
};

const BridgeTheGapSection = ({ quickWins = [], tools = [] }) => {
  return (
    <Card>
      <MainTitle>Bridge the Gap</MainTitle>
      <MainSubtitle>Learn how you can improve your chances to reach your goals</MainSubtitle>

      {/* Quick Wins Subsection */}
      <Subsection>
        <SubsectionTitle>
          Top Quick Wins
        </SubsectionTitle>
        {quickWins.length > 0 ? (
          <WinsList>
            {quickWins.slice(0, 4).map((win, index) => {
              const cta = getCTAForWin(win);

              return (
                <WinItem key={index}>
                  <WinNumber>{index + 1}</WinNumber>
                  <WinContent>
                    {typeof win === 'string' ? (
                      <WinDescription>{win}</WinDescription>
                    ) : (
                      <>
                        <WinTitle>{win.title}</WinTitle>
                        <WinDescription>{win.description}</WinDescription>
                        <CTAButton href={cta.url}>
                          {cta.text}
                          <ArrowRight size={14} weight="bold" />
                        </CTAButton>
                      </>
                    )}
                  </WinContent>
                </WinItem>
              );
            })}
          </WinsList>
        ) : (
          <EmptyState>No quick wins were identified for this profile.</EmptyState>
        )}
      </Subsection>

      {/* Recommended Tools Subsection */}
      <Subsection>
        <SubsectionTitle>
          Recommended Tools
        </SubsectionTitle>
        {tools.length > 0 ? (
          <ToolsGrid>
            {tools.map((tool, index) => (
              <Tool key={index}>
                <ToolName>{typeof tool === 'string' ? tool : tool.name}</ToolName>
              </Tool>
            ))}
          </ToolsGrid>
        ) : (
          <EmptyState>No tool recommendations were generated for this profile.</EmptyState>
        )}
      </Subsection>
    </Card>
  );
};

export default BridgeTheGapSection;
