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
  background: #f8fafc;
  padding: 32px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 32px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  animation: ${fadeIn} 200ms ease-out;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.375rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #1e293b;
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.5;
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
