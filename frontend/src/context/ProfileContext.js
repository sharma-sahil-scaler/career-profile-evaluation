import React, { createContext, useContext, useReducer, useCallback, useMemo, useEffect, useRef } from 'react';

const ProfileContext = createContext();

// Load state from localStorage
const loadStateFromStorage = () => {
  try {
    const savedState = localStorage.getItem('scalerProfileState');
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
  }
  return null;
};

// Save state to localStorage
const saveStateToStorage = (state) => {
  try {
    localStorage.setItem('scalerProfileState', JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
};

const defaultState = {
  // Quiz responses
  background: null, // 'non-tech' or 'tech'
  quizResponses: {},

  // Goals and requirements
  goals: {
    requirementType: [],
    targetCompany: '',
    topicOfInterest: []
  },

  // Evaluation results
  evaluationResults: null
};

const persistedState = loadStateFromStorage();
const initialState = persistedState
  ? {
    ...defaultState,
    ...persistedState,
    goals: {
      ...defaultState.goals,
      ...(persistedState.goals || {})
    },
    quizResponses: {
      ...defaultState.quizResponses,
      ...(persistedState.quizResponses || {})
    }
  }
  : defaultState;

const profileReducer = (state, action) => {
  switch (action.type) {
    case 'SET_BACKGROUND':
      return {
        ...state,
        background: action.payload
      };

    case 'SET_QUIZ_RESPONSE':
      return {
        ...state,
        quizResponses: {
          ...state.quizResponses,
          [action.payload.question]: action.payload.answer
        }
      };

    case 'CLEAR_QUIZ_RESPONSES':
      return {
        ...state,
        quizResponses: {}
      };
    
    case 'SET_GOALS':
      return {
        ...state,
        goals: {
          ...state.goals,
          ...action.payload
        }
      };
    
    case 'SET_EVALUATION_RESULTS':
      return {
        ...state,
        evaluationResults: action.payload
      };
    
    case 'RESET_PROFILE':
      return defaultState;

    default:
      return state;
  }
};

export const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, initialState);
  const isResetting = useRef(false);

  // Save to localStorage whenever state changes (except during reset)
  useEffect(() => {
    if (!isResetting.current) {
      saveStateToStorage(state);
    }
  }, [state]);

  const setBackground = useCallback((background) => {
    dispatch({ type: 'SET_BACKGROUND', payload: background });
  }, [dispatch]);

  const setQuizResponse = useCallback((question, answer) => {
    dispatch({ type: 'SET_QUIZ_RESPONSE', payload: { question, answer } });
  }, [dispatch]);

  const clearQuizResponses = useCallback(() => {
    dispatch({ type: 'CLEAR_QUIZ_RESPONSES' });
  }, [dispatch]);

  const setGoals = useCallback((goals) => {
    dispatch({ type: 'SET_GOALS', payload: goals });
  }, [dispatch]);

  const setEvaluationResults = useCallback((results) => {
    dispatch({ type: 'SET_EVALUATION_RESULTS', payload: results });
  }, [dispatch]);

  const resetProfile = useCallback(() => {
    isResetting.current = true;
    localStorage.removeItem('scalerProfileState');
    dispatch({ type: 'RESET_PROFILE' });
    // Reset flag after a brief delay
    setTimeout(() => {
      isResetting.current = false;
    }, 100);
  }, [dispatch]);

  const value = useMemo(() => ({
    ...state,
    setBackground,
    setQuizResponse,
    clearQuizResponses,
    setGoals,
    setEvaluationResults,
    resetProfile
  }), [state, setBackground, setQuizResponse, clearQuizResponses, setGoals, setEvaluationResults, resetProfile]);

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
