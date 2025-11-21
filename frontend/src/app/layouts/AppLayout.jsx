import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import NavigationBar from '../../components/NavigationBar';

const PageShell = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const ContentRegion = styled.main`
  flex: 1;
`;

const AppLayout = ({ showNavigation, navigationProps, children }) => (
  <PageShell>
    {showNavigation && navigationProps && (
      <NavigationBar {...navigationProps} />
    )}
    <ContentRegion>{children}</ContentRegion>
  </PageShell>
);

AppLayout.propTypes = {
  showNavigation: PropTypes.bool,
  navigationProps: PropTypes.shape({
    progress: PropTypes.number,
    quizMode: PropTypes.string,
    onQuizModeChange: PropTypes.func
  }),
  children: PropTypes.node
};

AppLayout.defaultProps = {
  showNavigation: false,
  navigationProps: undefined,
  children: null
};

export default AppLayout;
