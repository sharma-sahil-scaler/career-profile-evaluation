from typing import Any, Dict


def calculate_profile_strength(background: str, quiz_responses: Dict[str, Any]) -> Dict[str, Any]:
    """
    SIMPLIFIED PROBABILISTIC SCORING

    Question: "What % likely are you ready for your TARGET role?"

    LOGIC:
    1. Score each readiness component (0-100)
    2. Weight and combine them
    3. Adjust for role transition difficulty
    4. Apply floor (45%) and ceiling (75% tech, 70% non-tech)

    INPUTS:
    - Current Role (your starting point)
    - Preparation (experience, problem-solving, system-design, portfolio)
    - Target Role (where you want to go)

    OUTPUT:
    - 45-80%: Probability you're ready (floor motivates, ceiling shows mastery path)
    """

    if background == "non-tech":
        return _calculate_nontech_score_simple(quiz_responses)

    # === TECH PROFESSIONAL ===
    experience = quiz_responses.get("experience", "0-2")
    current_role = quiz_responses.get("currentRole", "swe-service")
    problem_solving = quiz_responses.get("problemSolving", "0-10")
    system_design = quiz_responses.get("systemDesign", "not-yet")
    portfolio = quiz_responses.get("portfolio", "none")
    target_role = quiz_responses.get("targetRole", "backend-sde")

    # Step 1: Score each component (0-100 scale, normalized)
    exp_score = _score_experience_simple(experience, current_role)
    ps_score = _score_problem_solving_simple(problem_solving)
    sd_score = _score_system_design_simple(system_design, experience)
    port_score = _score_portfolio_simple(portfolio)

    # Step 2: Weighted combination
    # Experience: 30% (shows you're in the field and growing)
    # Problem solving: 35% (core interview readiness)
    # System design: 25% (seniority/maturity indicator)
    # Portfolio: 10% (proof of ability)
    raw_readiness = (
        exp_score * 0.30 +
        ps_score * 0.35 +
        sd_score * 0.25 +
        port_score * 0.10
    )

    # Step 3: Adjust for transition difficulties
    # Role transition: How hard is the jump from current role to target role?
    role_gap = _calculate_role_transition_gap(current_role, target_role)
    # Company transition: How hard is the jump from current company type to target?
    company_gap = _calculate_company_transition_gap(current_role, quiz_responses.get("targetCompany", ""))

    adjusted_readiness = raw_readiness - role_gap - company_gap

    # Step 4: Apply floor & ceiling
    ceiling = 75
    floor = 45
    final_score = max(floor, min(ceiling, adjusted_readiness))

    return {
        "score": int(final_score),
        "breakdown": {
            "experience_component": int(exp_score),
            "problem_solving_component": int(ps_score),
            "system_design_component": int(sd_score),
            "portfolio_component": int(port_score),
            "raw_readiness_weighted": int(raw_readiness),
            "role_transition_gap": role_gap,
            "adjusted_readiness": int(adjusted_readiness),
            "floor": floor,
            "ceiling": ceiling,
            "final_score": int(final_score),
        }
    }


def _score_experience_simple(experience: str, current_role: str) -> float:
    """
    Experience readiness: 0-100 scale

    Base score by years:
    - 0 years: 10 (just starting)
    - 0-2 years: 30 (early career, still learning)
    - 3-5 years: 50 (mid-level, productive)
    - 5-8 years: 70 (experienced, can mentor)
    - 8+ years: 90 (senior, domain expert)

    Role multiplier:
    - SWE (product/service): 1.0x (most relevant experience)
    - DevOps: 1.0x (equally relevant)
    - QA/Support: 0.90x (non-traditional start, needs more prep)
    """
    base_scores = {
        "0": 10,
        "0-2": 30,
        "3-5": 50,
        "5-8": 70,
        "8+": 90
    }
    base = base_scores.get(experience, 30)

    role_multipliers = {
        "swe-product": 1.0,
        "swe-service": 1.0,
        "devops": 1.0,
        "qa-support": 0.90,
    }
    multiplier = role_multipliers.get(current_role, 0.95)

    return min(100, base * multiplier)


def _score_problem_solving_simple(problem_solving: str) -> float:
    """
    Problem solving readiness: 0-100 scale

    Based on interview problem practice (last 3 months):
    - 0-10: 20 (needs lots of practice, interview-unprepared)
    - 11-50: 50 (decent practice, okay for interviews)
    - 51-100: 75 (strong foundation, good interview readiness)
    - 100+: 95 (very ready, competitive for top roles)
    """
    scores = {
        "0-10": 20,
        "11-50": 50,
        "51-100": 75,
        "100+": 95
    }
    return scores.get(problem_solving, 20)


def _score_system_design_simple(system_design: str, experience: str) -> float:
    """
    System design readiness: 0-100 scale

    Varies by experience level because system design typically comes with years.
    A junior can't credibly have "multiple" design discussions.

    JUNIOR (0-2 years):
    - multiple: 30 (suspicious, probably inflated)
    - once: 40 (some exposure)
    - learning: 30 (self-study)
    - not-yet: 15 (expected, will learn)

    MID (3-5 years):
    - multiple: 70 (legitimate, some design work)
    - once: 55 (participated in designs)
    - learning: 40 (active learning phase)
    - not-yet: 25 (gap for mid-level)

    SENIOR (5+ years):
    - multiple: 95 (expected for senior)
    - once: 75 (some design work but less)
    - learning: 55 (always learning)
    - not-yet: 35 (gap for senior)
    """
    exp_level = _get_experience_level(experience)

    if exp_level == "junior":
        scores = {"multiple": 30, "once": 40, "learning": 30, "not-yet": 15}
    elif exp_level == "mid":
        scores = {"multiple": 70, "once": 55, "learning": 40, "not-yet": 25}
    else:  # senior
        scores = {"multiple": 95, "once": 75, "learning": 55, "not-yet": 35}

    return scores.get(system_design, 15)


def _score_portfolio_simple(portfolio: str) -> float:
    """
    Portfolio/projects visibility: 0-100 scale

    Based on GitHub/GitLab activity:
    - active-5+: 90 (strong portfolio, constantly improving)
    - limited-1-5: 60 (some proof of work)
    - inactive: 30 (old work, lost momentum)
    - none: 10 (no public proof)
    """
    scores = {
        "active-5+": 90,
        "limited-1-5": 60,
        "inactive": 30,
        "none": 10
    }
    return scores.get(portfolio, 10)


def _get_current_company_difficulty(current_role: str) -> float:
    """
    Infer current company difficulty from current role.

    Mapping based on typical company types for each role:
    - swe-product: Works at product company (medium-high bar) = 6
    - swe-service: Works at service company (moderate bar) = 4
    - devops: Infrastructure role (could be anywhere) = 5 (middle ground)
    - qa-support: Support/QA role (usually service companies) = 4
    """
    role_company_difficulty = {
        "swe-product": 6,      # Product companies are competitive
        "swe-service": 4,      # Service companies are moderate
        "devops": 5,           # Infrastructure (could be anywhere)
        "qa-support": 4,       # QA/Support typically at service companies
    }
    return role_company_difficulty.get(current_role, 5)  # Default to middle ground


def _get_target_company_difficulty(target_company: str) -> float:
    """
    Target company difficulty scale (0-10 deduction).
    """
    company_difficulty = {
        "faang": 10,
        "unicorns": 6,
        "product": 6,
        "startups": 2,
        "service": 4,
        "better-service": 4,
        "any-tech": 1,
        "evaluating": 0,
        "not-sure": 0,
        "faang-longterm": 10,
    }
    company_lower = target_company.lower() if target_company else "evaluating"
    for key, difficulty in company_difficulty.items():
        if key in company_lower:
            return difficulty
    return 0


def _calculate_company_transition_gap(current_role: str, target_company: str) -> float:
    """
    Company transition difficulty.

    Positive value = harder transition (deduction)
    Negative value = easier transition (bonus)

    Gap = Target Company Difficulty - Current Company Difficulty

    Examples:
    - SWE-Product (6) → FAANG (10): 10 - 6 = +4 (harder, deduct 4)
    - SWE-Service (4) → Startups (2): 2 - 4 = -2 (easier, bonus 2)
    - SWE-Product (6) → Product (6): 6 - 6 = 0 (same, no gap)
    """
    current_difficulty = _get_current_company_difficulty(current_role)
    target_difficulty = _get_target_company_difficulty(target_company)

    gap = target_difficulty - current_difficulty

    # Only penalize for harder transitions, don't reward for easier ones
    # (to avoid inflating scores too much)
    return max(0, gap)


def _calculate_role_transition_gap(current_role: str, target_role: str) -> float:
    """
    Role transition difficulty: How much harder is the jump?

    Deduction scale (0-10 points to subtract from readiness):

    EASY TRANSITIONS (0-2 point deduction):
    - SWE-Product → Backend/Fullstack SDE (same company type)
    - SWE-Service → Backend/Fullstack SDE (same base skills)

    MODERATE TRANSITIONS (3-5 point deduction):
    - SWE-Product → Senior Backend (same skills, harder goal)
    - DevOps → Backend SDE (different focus, same company)

    HARD TRANSITIONS (5-8 point deduction):
    - QA → Backend SDE (different skill set entirely)
    - DevOps → Data/ML (different domain)

    VERY HARD TRANSITIONS (8-10+ point deduction):
    - QA → Tech Lead (biggest gap)
    - QA → Staff Engineer
    """
    gap_map = {
        # Same family, easy transitions
        ("swe-product", "backend-sde"): 1,
        ("swe-product", "fullstack-sde"): 1,
        ("swe-service", "backend-sde"): 2,
        ("swe-service", "fullstack-sde"): 2,
        ("devops", "backend-sde"): 4,

        # Same family, leveling up (harder)
        ("swe-product", "senior-backend"): 4,
        ("swe-product", "tech-lead"): 6,
        ("swe-service", "senior-backend"): 5,
        ("swe-service", "tech-lead"): 7,
        ("devops", "tech-lead"): 5,

        # Different family transitions (hard)
        ("qa-support", "backend-sde"): 8,
        ("qa-support", "fullstack-sde"): 8,
        ("qa-support", "data-ml"): 7,

        # QA to senior roles (very hard)
        ("qa-support", "senior-backend"): 9,
        ("qa-support", "tech-lead"): 10,
        ("qa-support", "staff"): 10,

        # Data/ML transitions
        ("devops", "data-ml"): 4,
        ("swe-product", "data-ml"): 3,
        ("swe-service", "data-ml"): 4,
    }

    # Look up specific transition
    gap = gap_map.get((current_role, target_role), None)

    if gap is None:
        # Estimate: if target role is senior-level, add gap penalty
        target_lower = target_role.lower()
        if any(x in target_lower for x in ["senior", "tech-lead", "staff", "principal"]):
            gap = 5  # Generic senior penalty
        else:
            gap = 3  # Generic entry/mid penalty

    return gap


def _get_experience_level(experience: str) -> str:
    """Categorize experience into: junior, mid, or senior"""
    if experience in ["0", "0-2"]:
        return "junior"
    elif experience in ["3-5"]:
        return "mid"
    else:  # 5-8, 8+
        return "senior"


def _calculate_nontech_score_simple(quiz_responses: Dict[str, Any]) -> Dict[str, Any]:
    """
    NON-TECH PROFESSIONAL SCORING

    Non-tech people are transitioning to tech, so scoring emphasizes:
    1. Code comfort level (what they've already learned)
    2. Steps taken (bootcamp, course, projects)
    3. Time commitment (can they sustain?)
    4. Work experience (relevant skills transferable?)

    LOGIC:
    1. Score each component (0-100)
    2. Combine with equal weights (25% each)
    3. Apply floor (45%) and ceiling (70%)
    """

    experience = quiz_responses.get("experience", "0")
    code_comfort = quiz_responses.get("codeComfort", "complete-beginner")
    steps_taken = quiz_responses.get("stepsTaken", "just-exploring")
    time_per_week = quiz_responses.get("timePerWeek", "0-2")
    target_role = quiz_responses.get("targetRole", "backend")

    # Step 1: Score components
    comfort_score = _score_code_comfort_simple(code_comfort)
    steps_score = _score_steps_taken_simple(steps_taken)
    time_score = _score_time_commitment_simple(time_per_week)
    exp_score = _score_nontech_experience_simple(experience)

    # Step 2: Equal weighting (25% each)
    # All four components equally important for career changers
    raw_readiness = (
        comfort_score * 0.25 +
        steps_score * 0.25 +
        time_score * 0.25 +
        exp_score * 0.25
    )

    # Step 3: Adjust for transition difficulties
    # Role gap: Senior roles harder for career changers
    target_lower = target_role.lower()
    if any(x in target_lower for x in ["tech-lead", "staff", "senior"]):
        role_gap = 5  # Senior roles harder for career changers
    else:
        role_gap = 0  # Entry/mid roles no extra penalty

    # Company gap: Inferred from being non-tech (assume they're not in tech companies)
    # Non-tech people are transitioning, so all target companies face a base penalty
    # But we can still use company transition logic
    current_background = quiz_responses.get("currentRole", "other")  # Maps to currentRole in API
    company_gap = _calculate_company_transition_gap(current_background, quiz_responses.get("targetCompany", ""))

    adjusted_readiness = raw_readiness - role_gap - company_gap

    # Step 4: Apply floor & ceiling (lower ceiling for non-tech)
    ceiling = 70
    floor = 45
    final_score = max(floor, min(ceiling, adjusted_readiness))

    return {
        "score": int(final_score),
        "breakdown": {
            "code_comfort_component": int(comfort_score),
            "steps_taken_component": int(steps_score),
            "time_commitment_component": int(time_score),
            "experience_component": int(exp_score),
            "raw_readiness_weighted": int(raw_readiness),
            "role_transition_gap": role_gap,
            "adjusted_readiness": int(adjusted_readiness),
            "floor": floor,
            "ceiling": ceiling,
            "final_score": int(final_score),
        }
    }


def _score_code_comfort_simple(code_comfort: str) -> float:
    """
    Code comfort level: 0-100 scale

    - confident: 80 (can solve simple problems)
    - learning: 55 (following tutorials, struggling alone)
    - beginner: 35 (understand concepts, can't write code yet)
    - complete-beginner: 15 (haven't tried yet)
    """
    scores = {
        "confident": 80,
        "learning": 55,
        "beginner": 35,
        "complete-beginner": 15
    }
    return scores.get(code_comfort, 15)


def _score_steps_taken_simple(steps_taken: str) -> float:
    """
    Learning path progress: 0-100 scale

    - bootcamp: 85 (structured, intensive learning)
    - completed-course: 75 (structured learning)
    - built-projects: 70 (hands-on learning)
    - self-learning: 55 (less structured)
    - just-exploring: 20 (not serious yet)
    """
    scores = {
        "bootcamp": 85,
        "completed-course": 75,
        "built-projects": 70,
        "self-learning": 55,
        "just-exploring": 20
    }
    return scores.get(steps_taken, 20)


def _score_time_commitment_simple(time_per_week: str) -> float:
    """
    Time commitment: 0-100 scale

    - 10+: 90 (full-time devotion)
    - 6-10: 70 (serious part-time)
    - 3-5: 45 (casual learning)
    - 0-2: 20 (not really committed)
    """
    scores = {
        "10+": 90,
        "6-10": 70,
        "3-5": 45,
        "0-2": 20
    }
    return scores.get(time_per_week, 20)


def _score_nontech_experience_simple(experience: str) -> float:
    """
    Professional experience (transferable skills): 0-100 scale

    Career changers with experience have:
    - Professional maturity
    - Work ethic proven
    - Sometimes transferable skills (data, problem-solving, communication)

    - 5+: 75 (substantial experience, mature mindset)
    - 3-5: 60 (good experience, understands work world)
    - 2-3: 45 (some experience)
    - 0-2: 30 (junior, early career)
    - 0: 20 (fresh grad, no work experience)
    """
    scores = {
        "5+": 75,
        "3-5": 60,
        "2-3": 45,
        "0-2": 30,
        "0": 20
    }
    return scores.get(experience, 20)
