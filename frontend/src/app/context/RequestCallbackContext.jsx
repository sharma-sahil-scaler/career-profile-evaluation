import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import RequestCallbackModal from "../components/RequestCallbackModal";
import { apiRequest } from "../../utils/api";

const RequestCallbackContext = createContext({
  open: () => {},
});

const INITIAL_FORM_STATE = {
  program: "",
  jobTitle: "",
};

const SUBMISSION_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

export const RequestCallbackProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [submissionStatus, setSubmissionStatus] = useState(SUBMISSION_STATUS.IDLE);
  const [errorMessage, setErrorMessage] = useState("");

  const open = useCallback((initialState = {}) => {
    setFormState({
      program: initialState.program || "",
      jobTitle: initialState.jobTitle || "",
    });
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setFormState(INITIAL_FORM_STATE);
    setSubmissionStatus(SUBMISSION_STATUS.IDLE);
    setErrorMessage("");
  }, []);

  const updateField = useCallback((field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const submit = useCallback(async () => {
    setSubmissionStatus(SUBMISSION_STATUS.LOADING);
    setErrorMessage("");

    try {
      await apiRequest("POST", "/request-callback", {
        attributions: {
          intent: "career_profile_tool_rcb",
          platform: "desktop",
          product: "career_profile_tool",
          program: formState.program || "software_development",
        },
        user: {
          program: formState.program || "Career Profile Evaluation",
          position: formState.jobTitle || "",
        },
      });

      setSubmissionStatus(SUBMISSION_STATUS.SUCCESS);
      setTimeout(() => {
        close();
      }, 2000);
    } catch (error) {
      console.error("Request callback submission failed:", error);
      setSubmissionStatus(SUBMISSION_STATUS.ERROR);
      const errorMsg = error.responseJson?.error || error.message || "Failed to submit request. Please try again.";
      setErrorMessage(errorMsg);
    }
  }, [close, formState]);

  const contextValue = useMemo(
    () => ({
      open,
    }),
    [open],
  );

  return (
    <RequestCallbackContext.Provider value={contextValue}>
      {children}
      <RequestCallbackModal
        isOpen={isOpen}
        program={formState.program}
        jobTitle={formState.jobTitle}
        onChangeField={updateField}
        onClose={close}
        onSubmit={submit}
        submissionStatus={submissionStatus}
        errorMessage={errorMessage}
      />
    </RequestCallbackContext.Provider>
  );
};

export const useRequestCallback = () => useContext(RequestCallbackContext);
