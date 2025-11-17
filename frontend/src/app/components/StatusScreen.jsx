import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Screen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #0f172a;
  padding: 32px;
  color: #f8fafc;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 32px;
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 16px;
  max-width: 360px;
  text-align: center;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(12px);
  animation: ${fadeIn} 200ms ease-out;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: 0.02em;
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: rgba(226, 232, 240, 0.9);
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const StatusScreen = ({ icon, title, description, actions }) => (
  <Screen>
    <Card>
      {icon}
      <Title>{title}</Title>
      {description && <Description>{description}</Description>}
      {actions && <Actions>{actions}</Actions>}
    </Card>
  </Screen>
);

StatusScreen.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actions: PropTypes.node
};

StatusScreen.defaultProps = {
  icon: null,
  description: '',
  actions: null
};

export default StatusScreen;
