import { PROGRAM_OPTION_VALUES } from '../constants/programOption';
import { apiRequest } from './api';
import attribution from './attribution';
import { getURLWithUTMParams } from './url';
import { generateJWT } from './api';

const deriveCurrentCompany = (currentRole) => {
  const roleToCompanyMap = {
    'swe-product': 'Product Company',
    'swe-service': 'Service Company',
    devops: 'Tech Company',
    'qa-support': 'Tech Company',
    'career-switcher': 'Transitioning to tech'
  };
  return roleToCompanyMap[currentRole] || 'Current Company';
};

const inferPortfolio = (problemSolving) => {
  if (problemSolving === '51-100') {
    return 'limited-1-5';
  }
  if (problemSolving === '11-50') {
    return 'inactive';
  }
  return 'none';
};

const sanitizeProgramSelections = (responses = {}) => {
  if (!responses || typeof responses !== 'object') {
    return {};
  }

  return Object.entries(responses).reduce((acc, [key, value]) => {
    if (PROGRAM_OPTION_VALUES.has(value)) {
      return acc;
    }

    if (
      key.endsWith('Label') &&
      PROGRAM_OPTION_VALUES.has(responses[key.replace(/Label$/, '')])
    ) {
      return acc;
    }

    acc[key] = value;
    return acc;
  }, {});
};

const mapTechQuizResponses = (quizResponses = {}) => {
  const problemSolving = quizResponses.problemSolving || '0-10';
  const systemDesign = quizResponses.systemDesign || 'not-yet';
  const portfolio = quizResponses.portfolio || 'none';
  const currentRole = quizResponses.currentRole || 'career-switcher';

  return {
    currentRole,
    experience: quizResponses.experience || '0-2',
    targetRole: quizResponses.targetRole || 'fullstack-sde',
    problemSolving,
    systemDesign,
    portfolio,
    mockInterviews: 'never',
    requirementType: quizResponses.primaryGoal || 'upskilling',
    targetCompany: quizResponses.targetCompany || 'Not specified',
    currentCompany: deriveCurrentCompany(currentRole),
    currentSkill: quizResponses.currentSkill || problemSolving,
    currentRoleLabel:
      quizResponses.currentRoleLabel || deriveCurrentCompany(currentRole),
    targetRoleLabel: quizResponses.targetRoleLabel || quizResponses.targetRole,
    targetCompanyLabel:
      quizResponses.targetCompanyLabel || quizResponses.targetCompany
  };
};

const deriveNonTechProblemSolving = (codeComfort) => {
  switch (codeComfort) {
    case 'confident':
      return '51-100';
    case 'learning':
      return '11-50';
    case 'beginner':
      return '0-10';
    case 'complete-beginner':
      return '0-10';
    default:
      return '0-10';
  }
};

const mapNonTechQuizResponses = (quizResponses = {}) => {
  const inferredProblemSolving = deriveNonTechProblemSolving(
    quizResponses.codeComfort
  );

  return {
    currentRole: quizResponses.currentBackground || 'career-switcher',
    experience: quizResponses.experience || '0-2',
    targetRole: quizResponses.targetRole || 'exploring',
    problemSolving: inferredProblemSolving,
    systemDesign: 'not-yet',
    portfolio: inferPortfolio(inferredProblemSolving),
    mockInterviews: 'never',
    requirementType: quizResponses.motivation || 'career-switch',
    targetCompany:
      quizResponses.targetCompany || 'Transitioning from non-tech background',
    currentCompany: 'Transitioning from non-tech background',
    currentSkill: quizResponses.currentSkill || inferredProblemSolving,
    currentRoleLabel: quizResponses.currentBackgroundLabel || 'Career Switcher',
    targetRoleLabel: quizResponses.targetRoleLabel || quizResponses.targetRole,
    targetCompanyLabel:
      quizResponses.targetCompanyLabel || quizResponses.targetCompany
  };
};

const normaliseGoals = (goals = {}) => ({
  requirementType: Array.isArray(goals.requirementType)
    ? goals.requirementType
    : [],
  targetCompany: goals.targetCompany || 'Not specified',
  topicOfInterest: Array.isArray(goals.topicOfInterest)
    ? goals.topicOfInterest
    : []
});

const buildEvaluationPayload = (quizResponses, goals, background) => {
  if (!background) {
    throw new Error(
      'User background is required before requesting evaluation.'
    );
  }

  const sanitizedResponses = sanitizeProgramSelections(quizResponses);

  const mappedQuizResponses =
    background === 'tech'
      ? mapTechQuizResponses(sanitizedResponses)
      : mapNonTechQuizResponses(sanitizedResponses);

  return {
    background,
    quizResponses: mappedQuizResponses,
    goals: normaliseGoals(goals)
  };
};

export const evaluateProfile = async (
  quizResponses,
  goals,
  background,
  options = {}
) => {
  const { signal } = options;
  const payload = buildEvaluationPayload(quizResponses, goals, background);
  const baseUrl = process.env.PUBLIC_URL || '';
  const response = await fetch(`${baseUrl}/api/evaluate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Evaluation request failed with status ${response.status}: ${
        errorText || 'Unknown error'
      }`
    );
  }

  const data = await response.json();
  if (!data || !data.profile_evaluation) {
    throw new Error(
      'Evaluation response missing "profile_evaluation" payload.'
    );
  }

  try {
    attribution.setAttribution('cpe_evaluated');
    const jwt = await generateJWT();
    const refererUrl = getURLWithUTMParams();
  
    await apiRequest(
      'POST', 
      '/api/v3/analytics/attributions/', 
      {
        attributions: {
          ...attribution.getAttribution(),
          program: 'software_development',
          product: 'scaler',
          sub_product: 'career_profile_tool',
          element: 'cpe_evaluated_btn'
        }
      },
      {
        headers: {
          'X-user-token': jwt,
          'X-REFERER': refererUrl.toString()
        }
      }
    );

  } catch(e) {

  }

  return data.profile_evaluation;
};

export { buildEvaluationPayload };
