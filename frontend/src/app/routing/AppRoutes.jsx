import React, { useState } from 'react';
import { Navigate, Route, Routes, useSearchParams } from 'react-router-dom';

import QuizPage from '../../components/QuizPage';
import ResultsPage from '../../components/ResultsPage';
import NudgeModal from '../../components/NudgeModal';
import MasterclassNudge from '../../components/MasterclassNudge';

const AppRoutes = ({ quizMode, onQuizProgressChange }) => {
  const [searchParams] = useSearchParams();
  const nudgeId =
    searchParams.get('show_nudge') || searchParams.get('event_id');

  return (
    <>
      {nudgeId && <MasterclassNudge eventId={nudgeId} />}

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
    </>
  );
};

export default AppRoutes;
