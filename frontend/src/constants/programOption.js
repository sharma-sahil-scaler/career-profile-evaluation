const BASE_PROGRAM_OPTIONS = [
  {
    value: 'data_science',
    label: 'Scaler Data Science Program'
  },
  {
    value: 'ai_ml',
    label: 'Scaler AI/ML Program'
  },
  {
    value: 'software_development',
    label: 'Scaler Academy (Software Development)'
  },
  {
    value: 'devops',
    label: 'Scaler DevOps Program'
  }
];

export const PROGRAM_OPTION_VALUES = new Set(
  BASE_PROGRAM_OPTIONS.map((option) => option.value)
);
