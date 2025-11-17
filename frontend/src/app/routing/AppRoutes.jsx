import React, { useState } from 'react';
import { Navigate, Route, Routes, useSearchParams } from 'react-router-dom';

import QuizPage from '../../components/QuizPage';
import ResultsPage from '../../components/ResultsPage';
import MasterclassNudge from '../../components/MasterclassNudge';


const RoutesComponent = ({ quizMode, onQuizProgressChange }) => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/quiz" replace />} />
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

  return (
    <>
      {nudgeId && <MasterclassNudge eventId={nudgeId} />}
      <RoutesComponent {...{ quizMode, onQuizProgressChange }} />
    </>
  );
};

export default AppRoutes;
