import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

import StatusScreen from '../components/StatusScreen';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 4px solid rgba(249, 250, 251, 0.35);
  border-top-color: #c71f69;
  animation: ${spin} 0.9s linear infinite;
`;

const LoadingScreen = ({
  title,
  description
}) => (
  <StatusScreen
    icon={<Spinner />}
    title={title}
    description={description}
  />
);

LoadingScreen.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string
};

LoadingScreen.defaultProps = {
  title: 'Preparing your workspace',
  description: 'Hang tight while we load your profile data.'
};

export default LoadingScreen;
