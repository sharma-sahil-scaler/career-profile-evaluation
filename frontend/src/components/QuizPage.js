import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import FinalModeQuiz from "./quiz/FinalModeQuiz";
import attribution from "../utils/attribution";
import { apiRequest, generateJWT } from "../utils/api";
import { getURLWithUTMParams } from "../utils/url";

function QuizPage({ onProgressChange }) {
  const navigate = useNavigate();
  const { evaluationResults } = useProfile();

  const trackVisit = useCallback(async () => {
    try {
      attribution.setAttribution("page_visit");
      const refererUrl = getURLWithUTMParams();
      const jwt = await generateJWT();
      if (!jwt) return;

      await apiRequest(
        "POST",
        "/api/v3/analytics/attributions/",
        {
          attributions: {
            ...attribution.getAttribution(),
            program: "software_development",
            product: "scaler",
            sub_product: "career_profile_tool",
          },
          owner: {
            id: 1,
            type: "CareerProfileEvaluation",
          },
        },
        {
          headers: {
            "X-user-token": jwt,
            "X-REFERER": refererUrl.toString(),
          },
        }
      );
    } catch (e) {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    if (evaluationResults) {
      navigate("/results", { replace: true });
    } else {
      trackVisit();
    }
  }, [evaluationResults, navigate]);

  return <FinalModeQuiz onProgressChange={onProgressChange} />;
}

export default QuizPage;
