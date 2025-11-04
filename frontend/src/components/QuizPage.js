import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import FinalModeQuiz from './quiz/FinalModeQuiz';


function QuizPage({ onProgressChange }) {
  const navigate = useNavigate();
  const { evaluationResults } = useProfile();

  useEffect(() => {
    if (evaluationResults) {
      navigate('/results', { replace: true });
    }
  }, [evaluationResults, navigate]);

  return <FinalModeQuiz onProgressChange={onProgressChange} />;
}

export default QuizPage;
