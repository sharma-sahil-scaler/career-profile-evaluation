
CURRENT_ROLE_LABELS = {
    'swe-product': 'Software Engineer - Product Company',
    'swe-service': 'Software Engineer - Service Company',
    'devops': 'DevOps / Cloud / Infrastructure Engineer',
    'qa-support': 'QA / Support / Other Technical Role',
    'sales-marketing': 'Sales / Marketing / Business',
    'operations': 'Operations / Consulting / PM',
    'design': 'Design (UI/UX / Graphic / Product)',
    'finance': 'Finance / Accounting / Banking',
    'other': 'Other Non-Tech / Fresh Grad',
    'career-switcher': 'Career Switcher'
}

TARGET_ROLE_LABELS = {
    'senior-backend': 'Senior Backend Engineer',
    'senior-fullstack': 'Senior Full-Stack Engineer',
    'backend-sde': 'Backend Engineer',
    'fullstack-sde': 'Full-Stack Engineer',
    'data-ml': 'Data / ML Engineer',
    'tech-lead': 'Tech Lead / Staff Engineer',
    'backend': 'Backend Engineer',
    'fullstack': 'Full-Stack Engineer',
    'data-ml': 'Data / ML Engineer',
    'frontend': 'Frontend Engineer',
    'not-sure': 'Exploring Tech Roles',
    'exploring': 'Exploring Tech Roles'
}

TARGET_COMPANY_LABELS = {
    'faang': 'FAANG / Big Tech',
    'unicorns': 'Product Unicorns / Scaleups',
    'startups': 'High Growth Startups',
    'better-service': 'Service Companies',
    'evaluating': 'All Company Types',
    'any-tech': 'Any Tech Company',
    'product': 'Product Companies',
    'service': 'Service Companies',
    'faang-longterm': 'FAANG / Big Tech (Long-term)',
    'not-sure': 'All Company Types',
    'Not specified': 'Tech Companies',
    'Transitioning from non-tech background': 'Entry-level Tech Companies'
}

PROBLEM_SOLVING_LABELS = {
    '100+': 'Very Active (100+ problems)',
    '51-100': 'Moderately Active (50-100 problems)',
    '11-50': 'Somewhat Active (10-50 problems)',
    '0-10': 'Not Active (0-10 problems)'
}

SYSTEM_DESIGN_LABELS = {
    'multiple': 'Led design discussions',
    'once': 'Participated in discussions',
    'learning': 'Self-learning only',
    'not-yet': 'Not yet, will learn'
}

PORTFOLIO_LABELS = {
    'active-5+': 'Active (5+ public repos)',
    'limited-1-5': 'Limited (1-5 repos)',
    'inactive': 'Inactive (old activity)',
    'none': 'No portfolio yet'
}

EXPERIENCE_LABELS = {
    '0': '0 years (Fresh grad)',
    '0-2': '0-2 years',
    '3-5': '3-5 years',
    '5-8': '5-8 years',
    '8+': '8+ years',
    '5+': '5+ years'
}

PRIMARY_GOAL_LABELS = {
    'better-company': 'Move to a better company (same level)',
    'level-up': 'Level up (senior role / promotion)',
    'higher-comp': 'Higher compensation',
    'switch-domain': 'Switch to different tech domain',
    'upskilling': 'Upskilling in current role'
}


def get_role_label(role_value: str) -> str:
    return TARGET_ROLE_LABELS.get(role_value, role_value.title())


def get_company_label(company_value: str) -> str:
    return TARGET_COMPANY_LABELS.get(company_value, 'Tech Companies')


def get_current_role_label(role_value: str) -> str:
    return CURRENT_ROLE_LABELS.get(role_value, role_value.title())


def format_job_title(target_role: str, target_company: str) -> str:
    role_label = get_role_label(target_role)
    company_label = get_company_label(target_company)
    return f"{role_label} - {company_label}"


def get_experience_label(exp_value: str) -> str:
    return EXPERIENCE_LABELS.get(exp_value, exp_value)


def get_problem_solving_label(ps_value: str) -> str:
    return PROBLEM_SOLVING_LABELS.get(ps_value, ps_value)


def get_system_design_label(sd_value: str) -> str:
    return SYSTEM_DESIGN_LABELS.get(sd_value, sd_value)


def get_portfolio_label(port_value: str) -> str:
    return PORTFOLIO_LABELS.get(port_value, port_value)


def get_primary_goal_label(goal_value: str) -> str:
    return PRIMARY_GOAL_LABELS.get(goal_value, goal_value)
