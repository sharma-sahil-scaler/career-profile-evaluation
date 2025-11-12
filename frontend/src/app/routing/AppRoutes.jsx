import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useSearchParams } from 'react-router-dom';

import QuizPage from '../../components/QuizPage';
import ResultsPage from '../../components/ResultsPage';
import NudgeModal from '../../components/NudgeModal';
import MasterclassNudge from '../../components/MasterclassNudge';

const AppRoutes = ({ quizMode, onQuizProgressChange }) => {
  const [searchParams] = useSearchParams();
  const nudgeId =
    searchParams.get('show_nudge') || searchParams.get('event_id');

  const [isNudgeVisible, setIsNudgeVisible] = useState(!!nudgeId);

  console.log('nudgeId', nudgeId);

  return (
    <>
      <NudgeModal
        visible={isNudgeVisible}
        onClose={() => setIsNudgeVisible(false)}
      >
        <MasterclassNudge eventId={nudgeId} />
      </NudgeModal>

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
