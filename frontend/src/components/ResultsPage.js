import {
  BriefcaseMetal,
  ChartLine,
  CheckCircle,
  MagnifyingGlass,
  Phone,
  Sparkle,
  Target,
} from "phosphor-react";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { useRequestCallback } from "../app/context/RequestCallbackContext";
import { useProfile } from "../context/ProfileContext";
import { evaluateProfile } from "../utils/evaluationLogic";
import ProfileMatchHeroV2 from "./results/ProfileMatchHeroV2";
import tracker from "../utils/tracker";

const PrintStyles = createGlobalStyle`
  @media print {
    @page {
      margin: 12mm;
    }

    body {
      background: white !important;
      color: #1e293b;
    }
  }
`;

const ResultsContainer = styled.div`
  min-height: calc(100vh - 70px);
  background: #f8fafc;
  padding: 40px 20px;

  @media (max-width: 768px) {
    padding: 24px 0;
  }

  @media print {
    min-height: auto;
    background: white;
    padding: 0;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 100px;

  @media (max-width: 1024px) {
    padding: 0 40px;
  }

  @media (max-width: 768px) {
    padding: 0 16px;
  }

  @media print {
    max-width: none;
    margin: 0;
    padding: 0 24px;
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const LoadingIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #f1f5f9;
  border-radius: 0;
  border: 1px solid #e2e8f0;
  color: #c71f69;
  flex-shrink: 0;
`;

const LoadingText = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  text-align: center;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 0;
  overflow: hidden;
  margin-top: 24px;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #c71f69 0%, #e11d48 100%);
  transition: width 0.3s ease;
  width: ${(props) => props.progress}%;
`;

const LoadingSubtext = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 4px;
  text-align: center;
`;

const ErrorContainer = styled(LoadingContainer)`
  flex-direction: column;
  gap: 16px;
  color: #dc2626;
  text-align: center;
`;

const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: #b91c1c;
`;

const ErrorMessage = styled.p`
  font-size: 0.95rem;
  color: #7f1d1d;
  margin: 0;
`;

const PrimaryButton = styled.button`
  background: #c71f69;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 0;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #a01855;
  }

  @media print {
    display: none;
  }
`;

const FloatingCTA = styled.button`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: #c71f69;
  color: white;
  border: none;
  padding: 16px 32px;
  font-size: 0.9375rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(199, 31, 105, 0.35);
  z-index: 100;
  transition: all 0.3s ease;
  white-space: nowrap;
  width: auto;
  max-width: 90%;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background: #a01855;
    box-shadow: 0 12px 32px rgba(199, 31, 105, 0.45);
    transform: translateX(-50%) translateY(-2px);
  }

  &:active {
    transform: translateX(-50%) translateY(0);
  }

  @media (max-width: 768px) {
    bottom: 20px;
    padding: 14px 24px;
    font-size: 0.875rem;
  }

  @media print {
    display: none;
  }
`;

const ResultsPage = () => {
  const navigate = useNavigate();
  const {
    quizResponses,
    goals,
    background,
    evaluationResults,
    setEvaluationResults,
  } = useProfile();
  const { open: openCallbackModal } = useRequestCallback();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    {
      icon: <MagnifyingGlass size={28} weight="bold" />,
      text: "Evaluating your profile...",
      subtext: "Analyzing your skills and experience",
    },
    {
      icon: <CheckCircle size={28} weight="bold" />,
      text: "Making sure your profile is thoroughly checked...",
      subtext: "Cross-referencing with industry standards",
    },
    {
      icon: <BriefcaseMetal size={28} weight="bold" />,
      text: "Bringing up relevant jobs...",
      subtext: "Finding opportunities that match your profile",
    },
    {
      icon: <Target size={28} weight="bold" />,
      text: "Predicting your career readiness score...",
      subtext: "Calculating your success likelihood",
    },
    {
      icon: <ChartLine size={28} weight="bold" />,
      text: "Generating personalized insights...",
      subtext: "Almost there!",
    },
    {
      icon: <Sparkle size={28} weight="bold" />,
      text: "Finalizing your report...",
      subtext: "Preparing your results",
    },
  ];

  useEffect(() => {
    if (isLoading) {
      setLoadingProgress(0);
      setLoadingStep(0);

      const progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 1;
        });
      }, 150);

      const stepInterval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev >= loadingSteps.length - 1) {
            clearInterval(stepInterval);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);

      return () => {
        clearInterval(progressInterval);
        clearInterval(stepInterval);
      };
    }
  }, [isLoading]);

  useEffect(() => {
    if (!quizResponses || !goals || !background) {
      navigate("/", { replace: true });
      return;
    }
  }, [quizResponses, goals, background, navigate]);

  useEffect(() => {
    if (evaluationResults) {
      return;
    }

    let isMounted = true;
    const controller = new AbortController();
    const startTime = Date.now();
    const MINIMUM_LOADING_TIME = 10000;

    const fetchEvaluation = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const results = await evaluateProfile(
          quizResponses,
          goals,
          background,
          { signal: controller.signal }
        );

        if (isMounted) {
          if (
            results &&
            typeof results === "object" &&
            Object.keys(results).length > 0
          ) {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(
              0,
              MINIMUM_LOADING_TIME - elapsedTime
            );

            setTimeout(() => {
              if (isMounted) {
                setEvaluationResults(results);
                setIsLoading(false);
              }
            }, remainingTime);
          } else {
            throw new Error("Evaluation service returned an empty response.");
          }
        }
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }
        if (isMounted) {
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, MINIMUM_LOADING_TIME - elapsedTime);

          setTimeout(() => {
            if (isMounted) {
              setError(err.message || "Failed to fetch evaluation results.");
              setIsLoading(false);
            }
          }, remainingTime);
        }
      }
    };

    fetchEvaluation();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [
    quizResponses,
    goals,
    background,
    setEvaluationResults,
    retryCount,
    evaluationResults,
  ]);

  const handleReEvaluate = () => {
    setEvaluationResults(null);
    navigate("/");
  };

  const handleRCBClick = useCallback(() => {
    tracker.click({
      click_type: "rcb_btn_clicked",
      custom: {
        source: "results_page_floating_cta",
      },
    });
    openCallbackModal?.({ source: "results_page_floating_cta" });
  }, [openCallbackModal]);

  if (isLoading) {
    const currentStep = loadingSteps[loadingStep];
    return (
      <ResultsContainer>
        <Container>
          <LoadingContainer>
            <LoadingContent>
              <LoadingIcon>{currentStep.icon}</LoadingIcon>
              <div>
                <LoadingText>{currentStep.text}</LoadingText>
                <LoadingSubtext>{currentStep.subtext}</LoadingSubtext>
              </div>
            </LoadingContent>
            <ProgressBarContainer>
              <ProgressBarFill progress={loadingProgress} />
            </ProgressBarContainer>
          </LoadingContainer>
        </Container>
      </ResultsContainer>
    );
  }

  if (error) {
    return (
      <ResultsContainer>
        <Container>
          <ErrorContainer>
            <ErrorTitle>We ran into a problem</ErrorTitle>
            <ErrorMessage>{error}</ErrorMessage>
            <PrimaryButton onClick={handleReEvaluate}>
              Re-Evaluate
            </PrimaryButton>
          </ErrorContainer>
        </Container>
      </ResultsContainer>
    );
  }

  if (!evaluationResults) {
    return (
      <ResultsContainer>
        <Container>
          <LoadingContainer>
            Unable to generate evaluation results. Please try again.
          </LoadingContainer>
        </Container>
      </ResultsContainer>
    );
  }

  return (
    <ResultsContainer>
      <PrintStyles />
      <Container>
        <ProfileMatchHeroV2
          score={evaluationResults.profile_strength_score}
          notes={evaluationResults.profile_strength_notes}
          badges={evaluationResults.badges}
          evaluationResults={evaluationResults}
          background={background}
          quizResponses={quizResponses}
          goals={goals}
        />
      </Container>
      <FloatingCTA onClick={handleRCBClick}>
        <Phone size={20} weight="bold" />
        Request Callback
      </FloatingCTA>
    </ResultsContainer>
  );
};

export default ResultsPage;
