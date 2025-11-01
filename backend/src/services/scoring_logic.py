from typing import Any, Dict, Tuple


def _ensure_no_multiple_of_five(score: int, seed: str) -> int:
    import random
    score = max(45, min(100, score))
    if score % 5 == 0:
        random.seed(hash(seed))
        adjustment = random.choice([1, 2, 3, -1, -2, -3])
        score = score + adjustment
        score = max(45, min(100, score))
        if score % 5 == 0:
            score = score + 1 if score < 100 else score - 1

    return score


def _get_experience_score(experience: str, current_role: str) -> int:
    exp_points = {
        "0": 0,
        "0-2": 10,
        "3-5": 20,
        "5-8": 28,
        "8+": 35
    }.get(experience, 10)

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
    scores = {
        "100+": 15,
        "51-100": 12,
        "11-50": 8,
        "0-10": 3
    }
    return scores.get(problem_solving, 3)


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
    exp_score = _get_experience_score(experience, current_role)
    sd_score, sd_contradiction = _get_system_design_score(system_design, experience, problem_solving)
    ps_score = _get_problem_solving_score(problem_solving)
    port_score = _get_portfolio_score(portfolio, problem_solving)
    has_contradictions, contradiction_note = _detect_contradictions(quiz_responses)

    base_score = exp_score + sd_score + ps_score + port_score
    contradiction_penalty = 0
    if has_contradictions:
        contradiction_penalty = 15
    final_score = max(0, min(100, base_score - contradiction_penalty))

    import random
    seed_string = f"{experience}_{current_role}_{system_design}_{problem_solving}_{portfolio}"
    random.seed(hash(seed_string))
    variation = random.randint(-2, 2)
    final_score = final_score + variation

    final_score = _ensure_no_multiple_of_five(final_score, seed_string)

    return {
        "score": final_score,
        "has_contradictions": has_contradictions,
        "contradiction_note": contradiction_note,
        "breakdown": {
            "experience": exp_score,
            "system_design": sd_score,
            "problem_solving": ps_score,
            "portfolio": port_score,
            "contradiction_penalty": -contradiction_penalty if contradiction_penalty > 0 else 0
        }
    }


def _calculate_nontech_score(quiz_responses: Dict[str, Any]) -> Dict[str, Any]:
    experience = quiz_responses.get("experience", "0")
    code_comfort = quiz_responses.get("codeComfort", "complete-beginner")
    steps_taken = quiz_responses.get("stepsTaken", "just-exploring")
    time_per_week = quiz_responses.get("timePerWeek", "0-2")

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

    total = comfort_score + steps_score + time_score + exp_score

    import random
    seed_string = f"{experience}_{code_comfort}_{steps_taken}_{time_per_week}"
    random.seed(hash(seed_string))
    variation = random.randint(-2, 2)
    final_score = total + variation
    final_score = _ensure_no_multiple_of_five(final_score, seed_string)

    return {
        "score": final_score,
        "has_contradictions": False,
        "contradiction_note": "",
        "breakdown": {
            "code_comfort": comfort_score,
            "steps_taken": steps_score,
            "time_commitment": time_score,
            "experience": exp_score
        }
    }
