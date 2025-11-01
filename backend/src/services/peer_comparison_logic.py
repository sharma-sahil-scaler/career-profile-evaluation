from typing import Any, Dict
from src.utils.label_mappings import get_role_label, get_company_label, get_experience_label


def _get_seniority_description(experience: str, current_role: str) -> str:
    if experience in ["8+"]:
        return "Senior"
    elif experience in ["5-8"]:
        return "Mid to Senior-level"
    elif experience in ["3-5"]:
        return "Mid-level"
    elif experience in ["0-2", "0"]:
        return "Junior to Mid-level"
    return "Mid-level"


def generate_peer_group_description(background: str, quiz_responses: Dict[str, Any]) -> str:
    if background == "non-tech":
        code_comfort = quiz_responses.get("codeComfort", "complete-beginner")
        target_role = quiz_responses.get("targetRole", "backend")

        role_label = get_role_label(target_role)

        if code_comfort in ["confident", "learning"]:
            return f"Career switchers transitioning to {role_label} roles"
        else:
            return f"Aspiring tech professionals exploring {role_label} paths"

    experience = quiz_responses.get("experience", "0-2")
    target_role = quiz_responses.get("targetRole", "backend-sde")
    target_company = quiz_responses.get("targetCompany", "")

    seniority_desc = _get_seniority_description(experience, quiz_responses.get("currentRole", ""))

    role_label = get_role_label(target_role)

    company_label = get_company_label(target_company) if target_company else "tech companies"

    return f"{seniority_desc} {role_label}s at {company_label}"


def calculate_potential_percentile(
    current_percentile: int,
    background: str,
    quiz_responses: Dict[str, Any],
    profile_score: int
) -> int:
    potential = current_percentile

    if background == "non-tech":
        code_comfort = quiz_responses.get("codeComfort", "complete-beginner")
        steps_taken = quiz_responses.get("stepsTaken", "just-exploring")

        if code_comfort in ["complete-beginner", "beginner"]:
            potential += 25
        elif code_comfort == "learning":
            potential += 15

        if steps_taken in ["just-exploring", "self-learning"]:
            potential += 10

    else:
        problem_solving = quiz_responses.get("problemSolving", "0-10")
        system_design = quiz_responses.get("systemDesign", "not-yet")
        portfolio = quiz_responses.get("portfolio", "none")
        experience = quiz_responses.get("experience", "0-2")

        if problem_solving == "0-10":
            potential += 20 
        elif problem_solving == "11-50":
            potential += 12
        elif problem_solving == "51-100":
            potential += 5

        if experience in ["3-5", "5-8", "8+"]:
            if system_design == "not-yet":
                potential += 15
            elif system_design == "learning":
                potential += 10
            elif system_design == "once":
                potential += 5

        if portfolio == "none":
            potential += 10
        elif portfolio == "inactive":
            potential += 7
        elif portfolio == "limited-1-5":
            potential += 3
    potential = min(90, potential)
    potential = max(potential, current_percentile + 12)
    potential = min(90, potential)

    return potential
