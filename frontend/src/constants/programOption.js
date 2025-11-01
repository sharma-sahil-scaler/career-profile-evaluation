import React from "react";
import { GraduationCap } from "phosphor-react";

const BASE_PROGRAM_OPTIONS = [
  {
    value: "data_science",
    label: "Scaler Data Science Program",
  },
  {
    value: "ai_ml",
    label: "Scaler AI/ML Program",
  },
  {
    value: "software_development",
    label: "Scaler Academy (Software Development)",
  },
  {
    value: "devops",
    label: "Scaler DevOps Program",
  },
];

const programIcon = React.createElement(
  GraduationCap,
  { size: 22, weight: "duotone" },
);

const decorateProgramOption = (option) => ({
  ...option,
  icon: programIcon,
});

export const PROGRAM_OPTION_VALUES = new Set(
  BASE_PROGRAM_OPTIONS.map((option) => option.value),
);

export const getProgramOptions = () =>
  BASE_PROGRAM_OPTIONS.map(decorateProgramOption);
