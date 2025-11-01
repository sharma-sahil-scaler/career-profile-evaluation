import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { Lightbulb, Star, TrendUp } from 'phosphor-react';
import scalerBot from '../../assets/scaler-bot.png';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HeroCard = styled.div`
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  border-radius: 0;
  padding: 40px;
  color: white;
  position: relative;
  overflow: hidden;
  margin-bottom: 48px;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    padding: 32px 24px;
  }

  @media print {
    color: #1e293b;
    background: white;
    border: 2px solid #047857;
  }
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
  }
`;

const LeftContent = styled.div`
  flex: 1;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const BadgesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const Badge = styled.div`
  background: transparent;
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  padding: 8px 16px;
  border-radius: 0;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;

  @media print {
    border-color: #047857;
    color: #047857;
  }
`;

const ScoreSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 200px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ChatSection = styled.div`
  background: #fefce8;
  border: 2px solid #fde047;
  border-radius: 0;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  width: 100%;

  @media print {
    background: #fefce8;
    border-color: #fde047;
  }
`;

const BotAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
`;

const BotImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const ChatText = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
  font-weight: 500;
  color: #1e293b;

  @media print {
    color: #1e293b;
  }
`;

const ScoreDisplay = styled.div`
  font-size: 5rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 4rem;
  }
`;

const ScoreLabel = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const DecorativeCircle = styled.div`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  pointer-events: none;
`;

const Circle1 = styled(DecorativeCircle)`
  width: 200px;
  height: 200px;
  top: -100px;
  right: -50px;
`;

const Circle2 = styled(DecorativeCircle)`
  width: 150px;
  height: 150px;
  bottom: -75px;
  left: -50px;
`;

const Circle3 = styled(DecorativeCircle)`
  width: 100px;
  height: 100px;
  top: 50%;
  right: 10%;
  opacity: 0.3;
`;

const getChatMessage = (score) => {
  if (score >= 80) {
    return "Outstanding! Your profile shows exceptional readiness. You have strong fundamentals across all areas. Keep this momentum going and you'll be interview-ready very soon.";
  } else if (score >= 70) {
    return "Your profile shows solid fundamentals with room for growth. You have a strong foundation in problem-solving and demonstrate good technical awareness. Focus on building more practical projects and deepening your system design knowledge to reach the next level.";
  } else if (score >= 60) {
    return "Good foundation! You're on the right track with decent technical skills. Focus on consistent practice, building portfolio projects, and strengthening your interview preparation to improve your readiness.";
  } else if (score >= 50) {
    return "You're making progress! Your profile shows promise but needs focused development. Prioritize building technical skills, creating projects, and consistent coding practice to strengthen your career readiness.";
  } else {
    return "You're at the beginning of an exciting journey! Focus on building strong technical foundations through structured learning, daily coding practice, and hands-on projects. Stay consistent and you'll see great progress.";
  }
};

const getBadges = (badges) => {
  const defaultBadges = [
    { icon: 'lightbulb', name: 'Problem Solver' },
    { icon: 'star', name: 'Self Learner' },
    { icon: 'trendup', name: 'Growth Mindset' }
  ];

  if (!badges || badges.length === 0) {
    return defaultBadges;
  }

  return badges.slice(0, 3).map(badge => {
    const iconMap = {
      trophy: 'star',
      star: 'star',
      rocket: 'trendup',
      fire: 'trendup',
      compass: 'lightbulb',
      message: 'star'
    };

    return {
      icon: typeof badge === 'string' ? 'star' : (iconMap[badge.icon] || 'star'),
      name: typeof badge === 'string' ? badge : badge.name
    };
  });
};

const IconComponent = ({ iconName }) => {
  switch (iconName) {
    case 'lightbulb':
      return <Lightbulb size={20} weight="regular" />;
    case 'trendup':
      return <TrendUp size={20} weight="regular" />;
    case 'star':
    default:
      return <Star size={20} weight="regular" />;
  }
};

const ProfileMatchHero = ({ score, notes, badges }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateScore();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, [hasAnimated]);

  const animateScore = () => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, duration / steps);
  };

  const chatMessage = notes || getChatMessage(score);
  const badgeList = getBadges(badges);

  return (
    <HeroCard ref={heroRef}>
      <Circle1 />
      <Circle2 />
      <Circle3 />

      <TopSection>
        <LeftContent>
          <Title>Your Profile looks promising</Title>
          <BadgesContainer>
            {badgeList.map((badge, index) => (
              <Badge key={index}>
                <IconComponent iconName={badge.icon} />
                <span>{badge.name}</span>
              </Badge>
            ))}
          </BadgesContainer>
        </LeftContent>

        <ScoreSection>
          <ScoreDisplay>{displayScore}%</ScoreDisplay>
          <ScoreLabel>Career Readiness Score</ScoreLabel>
        </ScoreSection>
      </TopSection>

      <ChatSection>
        <BotAvatar>
          <BotImage src={scalerBot} alt="Scaler Bot" />
        </BotAvatar>
        <ChatText>{chatMessage}</ChatText>
      </ChatSection>
    </HeroCard>
  );
};

export default ProfileMatchHero;
