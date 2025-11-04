import { useEffect, useMemo, useState } from 'react';
import {
  BrowserRouter as Router,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { useStore } from '@nanostores/react';

import { ProfileProvider } from './context/ProfileContext';
import { $initialData } from './store/initial-data';
import InitialDataBootstrapper from './app/bootstrap/InitialDataBootstrapper';
import AppLayout from './app/layouts/AppLayout';
import AppRoutes from './app/routing/AppRoutes';
import LoadingScreen from './app/screens/LoadingScreen';
import LoggedOutScreen from './app/screens/LoggedOutScreen';
import { RequestCallbackProvider } from './app/context/RequestCallbackContext';

function AppContent() {
  const [quizProgress, setQuizProgress] = useState(0);
  const [quizMode, setQuizMode] = useState('final');
  const { error, loading } = useStore($initialData);
  const location = useLocation();
  const navigate = useNavigate();
  const shouldShowNav = !(
    quizMode === 'final' && location.pathname === '/quiz'
  );

  const navigationProps = useMemo(
    () => ({
      progress: quizProgress,
      quizMode,
      onQuizModeChange: setQuizMode
    }),
    [quizProgress, quizMode]
  );

  useEffect(() => {
    if (!error) {
      return;
    }

    const timeoutId = setTimeout(() => {
      window.location.replace(`${window.location.origin}/users/sign_in/mobile`);
    }, 2500);

    return () => clearTimeout(timeoutId);
  }, [error, navigate]);

  if (loading) {
    return (
      <LoadingScreen />
    );
  }

  if (error) {
    return (
      <LoggedOutScreen
        onRetry={() => {
          window.location.replace(`${window.location.origin}/users/sign_in/mobile`);
        }}
      />
    );
  }

  return (
    <AppLayout
      showNavigation={shouldShowNav}
      navigationProps={navigationProps}
    >
      <AppRoutes
        quizMode={quizMode}
        onQuizProgressChange={setQuizProgress}
      />
    </AppLayout>
  );
}

function App() {
  return (
    <ProfileProvider>
      <Router basename="/career-profile-tool">
        <RequestCallbackProvider>
          <InitialDataBootstrapper
            product="career_profile_tool"
            subProduct="free_evaluation"
          />
          <AppContent />
        </RequestCallbackProvider>
      </Router>
    </ProfileProvider>
  );
}

export default App;
