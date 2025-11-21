import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { WarningCircle } from 'phosphor-react';

import StatusScreen from '../components/StatusScreen';

const ActionButton = styled.button`
  padding: 10px 22px;
  border: none;
  border-radius: 999px;
  background: #c71f69;
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 24px rgba(199, 31, 105, 0.35);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

const LoggedOutScreen = ({
  onRetry,
  title,
  description,
  actionLabel
}) => (
  <StatusScreen
    icon={<WarningCircle size={42} weight="duotone" color="#c71f69" />}
    title={title}
    description={description}
    actions={
      <ActionButton type="button" onClick={onRetry}>
        {actionLabel}
      </ActionButton>
    }
  />
);

LoggedOutScreen.propTypes = {
  onRetry: PropTypes.func.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  actionLabel: PropTypes.string
};

LoggedOutScreen.defaultProps = {
  title: 'You are logged out',
  description: 'Please sign in again to continue. Redirecting to the login page…',
  actionLabel: 'Go to sign in'
};

export default LoggedOutScreen;
