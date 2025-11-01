import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import QuizPage from "../../components/QuizPage";
import ResultsPage from "../../components/ResultsPage";

const AppRoutes = ({
  quizMode,
  onQuizProgressChange,
}) => (
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
    <Route path="/reports" element={<ResultsPage />} />
  </Routes>
);

export default AppRoutes;
