import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useSearchParams } from 'react-router-dom';

import QuizPage from '../../components/QuizPage';
import ResultsPage from '../../components/ResultsPage';
import MasterclassNudge from '../../components/MasterclassNudge';
import { getPathWithQueryParams, hasNudgeBeenShown } from '../../utils/url';

const RoutesComponent = ({ quizMode, onQuizProgressChange }) => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={getPathWithQueryParams('/quiz')} replace />}
      />
      <Route
        path="/quiz"
        element={
          <QuizPage
            onProgressChange={onQuizProgressChange}
            quizMode={quizMode}
          />
        }
      />
      <Route path="/results" element={<ResultsPage />} />
    </Routes>
  );
};

const AppRoutes = ({ quizMode, onQuizProgressChange }) => {
  const [searchParams] = useSearchParams();
  const nudgeId =
    searchParams.get('show_nudge') || searchParams.get('event_id');

  const [shouldShowNudge, setShouldShowNudge] = useState(false);

  useEffect(() => {
    if (nudgeId && !hasNudgeBeenShown(nudgeId)) {
      setShouldShowNudge(true);
    }
  }, [nudgeId]);

  return (
    <>
      {shouldShowNudge && <MasterclassNudge eventId={nudgeId} />}
      <RoutesComponent {...{ quizMode, onQuizProgressChange }} />
    </>
  );
};

export default AppRoutes;
