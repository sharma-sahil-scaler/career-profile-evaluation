from typing import Any, Dict, Tuple


def _get_target_role_seniority(target_role: str, experience: str) -> str:
    """
    Determine the seniority level of the target role.
    This is used to calculate ROLE-RELATIVE readiness.

    Returns: "entry", "mid", or "senior"
    """
    # Entry-level target roles (0-2 years typically required)
    entry_roles = [
        "backend", "frontend", "fullstack", "data-analyst",
        "junior", "entry", "sde-1", "exploring"
    ]

    # Senior-level target roles (5+ years typically required)
    senior_roles = [
        "tech-lead", "staff", "principal", "architect", "engineering-manager",
        "senior-backend", "senior-fullstack", "senior-frontend", "data-ml"
    ]

    target_lower = target_role.lower() if target_role else "exploring"

    # Check explicit senior roles
    if any(role in target_lower for role in senior_roles):
        return "senior"

    # Check explicit entry roles
    if any(role in target_lower for role in entry_roles):
        return "entry"

    # Default to mid-level (most target roles)
    return "mid"


def _get_target_role_ceiling(background: str) -> int:
    """
    Get the maximum score ceiling for target role readiness.

    Tech roles: 75% (always room for mastery)
    Non-tech roles: 70% (career changers have steeper learning curve)
    """
    if background == "non-tech":
        return 70
    return 75


def _get_role_relative_baseline(background: str) -> int:
    """
    Get the baseline score for role-relative readiness.

    Fixed baseline (not dependent on target role seniority):
    Both Tech & Non-Tech: 45% baseline

    Why 45%?
    - Motivating: Shows everyone has starting potential
    - Fair: Doesn't demotivate complete beginners
    - Aspirational: Room to grow to 70-75% with effort
    """
    return 45  # Same for both tech and non-tech


def _ensure_no_multiple_of_five(score: int, seed: str) -> int:
    import random
    # Don't apply generic floor here; use persona-specific floor above
    score = min(100, score)
    if score % 5 == 0:
        random.seed(hash(seed))
        adjustment = random.choice([1, 2, 3, -1, -2, -3])
        score = score + adjustment
        score = min(100, score)
        if score % 5 == 0:
            score = score + 1 if score < 100 else score - 1

    return score


def _get_experience_score(experience: str, current_role: str) -> int:
    # IMPROVED: Higher base points for all levels (Option 1)
    exp_points = {
        "0": 5,
        "0-2": 18,
        "3-5": 26,
        "5-8": 32,
        "8+": 38
    }.get(experience, 18)

    role_multipliers = {
        "swe-product": 1.0,
        "devops": 1.0,
        "swe-service": 1.0,
        "qa-support": 0.90,
    }

    multiplier = role_multipliers.get(current_role, 0.95)
    return int(exp_points * multiplier)


def _get_system_design_score(system_design: str, experience: str, problem_solving: str) -> Tuple[int, bool]:
    is_contradiction = False

    if system_design == "multiple":
        if problem_solving in ["0-10", "11-50"] or experience in ["0", "0-2"]:
            is_contradiction = True
            system_design = "once"

    experience_years = {"0": 0, "0-2": 1, "3-5": 4, "5-8": 6.5, "8+": 10}.get(experience, 1)

    if experience_years >= 5:
        scores = {
            "multiple": 40,
            "once": 25,
            "learning": 15,
            "not-yet": 5
        }
    else:
        scores = {
            "multiple": 15,
            "once": 12,
            "learning": 8,
            "not-yet": 5
        }

    return scores.get(system_design, 5), is_contradiction


def _get_problem_solving_score(problem_solving: str) -> int:
    # IMPROVED: Higher weights for problem solving practice (Option 3)
    scores = {
        "100+": 17,
        "51-100": 14,
        "11-50": 11,
        "0-10": 4
    }
    return scores.get(problem_solving, 4)


def _get_portfolio_score(portfolio: str, problem_solving: str) -> int:
    base_scores = {
        "active-5+": 15,
        "limited-1-5": 10,
        "inactive": 5,
        "none": 0
    }
    score = base_scores.get(portfolio, 0)

    if portfolio in ["active-5+", "limited-1-5"] and problem_solving == "0-10":
        score = score // 2

    return score


def _detect_contradictions(quiz_responses: Dict[str, Any]) -> Tuple[bool, str]:
    experience = quiz_responses.get("experience", "0-2")
    problem_solving = quiz_responses.get("problemSolving", "0-10")
    system_design = quiz_responses.get("systemDesign", "not-yet")
    portfolio = quiz_responses.get("portfolio", "none")
    current_role = quiz_responses.get("currentRole", "")

    contradictions = []

    if system_design == "multiple" and problem_solving in ["0-10", "11-50"]:
        contradictions.append(
            "System design expertise requires extensive coding practice. "
            "Focus on solving 100+ problems to match your claimed design experience."
        )

    if experience in ["3-5", "5-8", "8+"] and problem_solving == "0-10":
        if experience == "3-5":
            contradictions.append(
                "Your 3-5 years of professional experience is valuable, but interview preparation "
                "needs immediate focus to unlock senior opportunities. Aim for 100+ problems."
            )
        else:
            contradictions.append(
                "Your experience level doesn't match current interview readiness. "
                "Results may not reflect actual capability without practice."
            )

    if portfolio == "active-5+" and problem_solving == "0-10":
        contradictions.append(
            "Your projects suggest practical experience, but lack of problem-solving practice "
            "may hinder technical interviews. Balance portfolio work with DSA prep."
        )

    if experience in ["0", "0-2"] and system_design == "multiple":
        contradictions.append(
            "System design expertise typically requires 5+ years of production experience. "
            "Your claim may be aspirational - focus on building fundamentals first."
        )

    if contradictions:
        return True, " ".join(contradictions)

    return False, ""


def calculate_profile_strength(background: str, quiz_responses: Dict[str, Any]) -> Dict[str, Any]:
    if background == "non-tech":
        return _calculate_nontech_score(quiz_responses)

    experience = quiz_responses.get("experience", "0-2")
    current_role = quiz_responses.get("currentRole", "swe-service")
    system_design = quiz_responses.get("systemDesign", "not-yet")
    problem_solving = quiz_responses.get("problemSolving", "0-10")
    portfolio = quiz_responses.get("portfolio", "none")
    target_role = quiz_responses.get("targetRole", "backend-sde")

    # Calculate base components
    exp_score = _get_experience_score(experience, current_role)
    sd_score, sd_contradiction = _get_system_design_score(system_design, experience, problem_solving)
    ps_score = _get_problem_solving_score(problem_solving)
    port_score = _get_portfolio_score(portfolio, problem_solving)
    has_contradictions, contradiction_note = _detect_contradictions(quiz_responses)

    # Calculate raw base score
    base_score = exp_score + sd_score + ps_score + port_score
    contradiction_penalty = 0
    if has_contradictions:
        contradiction_penalty = 15

    raw_score = max(0, min(100, base_score - contradiction_penalty))

    # REDESIGN (Option A): TARGET-ROLE RELATIVE with FLOOR & CEILING
    # Philosophy: "You're X% ready to land your TARGET ROLE"
    #
    # Floor: 45% (never demotivate - everyone has potential)
    # Ceiling: 75% (tech) / 70% (non-tech) (always room to grow for mastery)
    #
    # Why this works:
    # - Junior aiming for junior role: Shows 50-60% readiness (achievable!)
    # - Senior aiming for senior role: Shows 70-75% readiness (strong candidate!)
    # - Career switcher: Shows 45-65% readiness (realistic path forward!)

    target_role_level = _get_target_role_seniority(target_role, experience)
    role_baseline = _get_role_relative_baseline(background)  # 45% for all
    role_ceiling = _get_target_role_ceiling(background)  # 75% tech, 70% non-tech

    # Direct floor & ceiling application
    # The raw_score already represents their readiness, just cap it
    final_score = max(role_baseline, min(role_ceiling, raw_score))

    # Add variation and anti-multiple-of-five adjustment
    import random
    seed_string = f"{experience}_{current_role}_{system_design}_{problem_solving}_{portfolio}_{target_role}"
    random.seed(hash(seed_string))
    variation = random.randint(-2, 2)
    final_score = final_score + variation

    final_score = _ensure_no_multiple_of_five(final_score, seed_string)
    final_score = max(role_baseline, min(role_ceiling, final_score))  # Ensure still within bounds

    return {
        "score": int(final_score),
        "has_contradictions": has_contradictions,
        "contradiction_note": contradiction_note,
        "breakdown": {
            "experience": exp_score,
            "system_design": sd_score,
            "problem_solving": ps_score,
            "portfolio": port_score,
            "contradiction_penalty": -contradiction_penalty if contradiction_penalty > 0 else 0,
            "target_role_level": target_role_level,
            "raw_score": int(raw_score),
            "role_baseline": role_baseline,
            "role_ceiling": role_ceiling
        }
    }


def _calculate_nontech_score(quiz_responses: Dict[str, Any]) -> Dict[str, Any]:
    experience = quiz_responses.get("experience", "0")
    code_comfort = quiz_responses.get("codeComfort", "complete-beginner")
    steps_taken = quiz_responses.get("stepsTaken", "just-exploring")
    time_per_week = quiz_responses.get("timePerWeek", "0-2")
    target_role = quiz_responses.get("targetRole", "backend")

    comfort_scores = {
        "confident": 40,
        "learning": 30,
        "beginner": 20,
        "complete-beginner": 10
    }
    comfort_score = comfort_scores.get(code_comfort, 10)

    steps_scores = {
        "completed-course": 25,
        "built-projects": 25,
        "bootcamp": 20,
        "self-learning": 15,
        "just-exploring": 5
    }
    steps_score = steps_scores.get(steps_taken, 5)

    time_scores = {
        "10+": 20,
        "6-10": 15,
        "3-5": 10,
        "0-2": 3
    }
    time_score = time_scores.get(time_per_week, 3)

    exp_scores = {
        "5+": 15,
        "3-5": 12,
        "0-2": 8,
        "0": 5
    }
    exp_score = exp_scores.get(experience, 5)

    raw_score = comfort_score + steps_score + time_score + exp_score

    # REDESIGN (Option A): TARGET-ROLE RELATIVE with FLOOR & CEILING
    # Floor: 45% (never demotivate)
    # Ceiling: 70% (non-tech always needs more room to grow)

    target_role_level = _get_target_role_seniority(target_role, experience)
    role_baseline = _get_role_relative_baseline("non-tech")  # 45% for all
    role_ceiling = _get_target_role_ceiling("non-tech")  # 70% for non-tech

    # Direct floor & ceiling application
    final_score = max(role_baseline, min(role_ceiling, raw_score))

    import random
    seed_string = f"{experience}_{code_comfort}_{steps_taken}_{time_per_week}_{target_role}"
    random.seed(hash(seed_string))
    variation = random.randint(-2, 2)
    final_score = final_score + variation
    final_score = _ensure_no_multiple_of_five(final_score, seed_string)
    final_score = max(role_baseline, min(role_ceiling, final_score))  # Ensure still within bounds

    return {
        "score": int(final_score),
        "has_contradictions": False,
        "contradiction_note": "",
        "breakdown": {
            "code_comfort": comfort_score,
            "steps_taken": steps_score,
            "time_commitment": time_score,
            "experience": exp_score,
            "target_role_level": target_role_level,
            "raw_score": int(raw_score),
            "role_baseline": role_baseline,
            "role_ceiling": role_ceiling
        }
    }
