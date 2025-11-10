from typing import Any, Dict


def calculate_interview_readiness(background: str, quiz_responses: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calculate interview readiness independently (45-80% range).
    NOT dependent on profile_strength_score.

    Based on actual quiz responses:
    - For tech: problemSolving (base), systemDesign, portfolio, experience, currentRole
    - For non-tech: codeComfort (base), stepsTaken, experience, currentBackground

    Returns:
    {
        "technical_interview_percent": int (45-80 for tech, 45-75 for non-tech),
        "hr_behavioral_percent": int (45-75),
        "confidence": str ("high", "medium", "low")
    }
    """

    if background == "tech":
        return _calculate_tech_readiness(quiz_responses)
    else:
        return _calculate_non_tech_readiness(quiz_responses)


def _calculate_tech_readiness(quiz_responses: Dict[str, Any]) -> Dict[str, Any]:
    """Calculate readiness for tech background users."""

    problem_solving = quiz_responses.get("problemSolving", "0-10")
    system_design = quiz_responses.get("systemDesign", "not-yet")
    portfolio = quiz_responses.get("portfolio", "none")
    experience = quiz_responses.get("experience", "0-2")
    current_role = quiz_responses.get("currentRole", "")

    # Base score from problem solving (most important signal)
    if problem_solving == "100+":
        base = 72  # Very active - top preparation
    elif problem_solving == "51-100":
        base = 62  # Well prepared
    elif problem_solving == "11-50":
        base = 52  # Moderately prepared
    else:  # "0-10"
        base = 45  # Not prepared yet (floor)

    # Boost for system design (only if practicing coding)
    if problem_solving != "0-10":
        if system_design == "multiple":
            base += 12  # Led design discussions - senior readiness
        elif system_design == "once":
            base += 6   # Participated
        elif system_design == "learning":
            base += 2   # Self-learning
        # "not-yet" adds 0

    # Boost for experience
    if experience in ["5-8", "8+"]:
        base += 8  # Significant experience
    elif experience == "3-5":
        base += 5  # Good experience
    elif experience == "2-3":
        base += 2  # Some experience
    elif experience == "0-2":
        base += 0  # Early career - not enough to boost readiness (explicit)

    # Small boost for portfolio (shows practical skill)
    if portfolio == "active-5+":
        base += 3
    elif portfolio == "limited-1-5":
        base += 1

    # Adjustment for current role (some roles have better interview prep culture)
    if current_role == "devops":
        base += 2  # DevOps engineers work with modern systems - good for interviews
    elif current_role == "swe-product":
        base += 2  # Product company SWEs have strong interview prep culture
    elif current_role == "swe-service":
        base += 1  # Service company SWEs need to self-prepare for product company interviews
    elif current_role == "qa-support":
        base += 0  # QA/Support roles focus less on interview prep

    # Floor at 45, ceiling at 80 for tech
    technical_percent = max(45, min(80, base))

    # HR behavioral slightly lower but still high if technically strong
    # If technical readiness is high, HR can be within 5 points, otherwise within 10
    if technical_percent >= 65:
        hr_percent = max(45, min(75, technical_percent - 3))
    else:
        hr_percent = max(45, min(75, technical_percent - 5))

    # Determine confidence level
    confidence = _get_confidence_level(technical_percent, experience, problem_solving)

    return {
        "technical_interview_percent": technical_percent,
        "hr_behavioral_percent": hr_percent,
        "confidence": confidence,
    }


def _calculate_non_tech_readiness(quiz_responses: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calculate readiness for non-tech background users (transitioning from other domains).

    NOTE: Non-tech users through the API send the same fields as tech users.
    This uses the available fields to estimate interview readiness.
    """

    problem_solving = quiz_responses.get("problemSolving", "0-10")
    portfolio = quiz_responses.get("portfolio", "exploring")
    experience = quiz_responses.get("experience", "0-2")
    current_role = quiz_responses.get("currentRole", "").lower()
    target_role = quiz_responses.get("targetRole", "").lower()

    # Base score from problem solving intensity (most important signal)
    if problem_solving == "100+":
        base = 70  # Very active coding practice
    elif problem_solving == "51-100":
        base = 60  # Good coding practice
    elif problem_solving == "11-50":
        base = 50  # Moderate coding practice
    else:  # "0-10"
        base = 45  # Minimal coding practice (floor)

    # Boost for portfolio (shows hands-on commitment to tech transition)
    if portfolio == "active-5+":
        base += 8   # Multiple projects - serious commitment
    elif portfolio == "limited-1-5":
        base += 4   # Some projects - showing effort
    elif portfolio == "inactive":
        base += 1   # Old activity - some history
    # "exploring" or others add 0

    # Boost for prior work experience (maturity and learning ability)
    # For non-tech users, prior experience is a strong positive
    if experience in ["5-8", "8+", "5+"]:
        base += 8   # Strong prior experience - mature learner
    elif experience == "3-5":
        base += 5   # Solid experience
    elif experience == "2-3":
        base += 3   # Some experience
    elif experience == "0-2":
        base += 1   # Limited experience
    # "0" years adds 0 - fresh grad

    # Small boost for current role showing any technical exposure
    if current_role in ["qa-support", "qa", "support"]:
        base += 2  # Some QA/support tech exposure

    # Boost based on clear target role (shows career direction)
    if "data" in target_role:
        base += 3   # Data/ML - focused technical path
    elif "backend" in target_role:
        base += 3   # Backend - serious engineering path
    elif "fullstack" in target_role:
        base += 3   # Fullstack - comprehensive technical path
    elif "frontend" in target_role:
        base += 2   # Frontend - web development path
    # "exploring" or "not-sure" adds 0

    # Floor at 45, ceiling at 75 for non-tech users
    technical_percent = max(45, min(75, base))

    # HR behavioral - non-tech often has strong soft skills from prior careers
    if technical_percent >= 65:
        hr_percent = max(45, min(75, technical_percent - 2))
    else:
        hr_percent = max(45, min(75, technical_percent - 5))

    # Determine confidence level
    confidence = _get_confidence_level(technical_percent, experience, problem_solving)

    return {
        "technical_interview_percent": technical_percent,
        "hr_behavioral_percent": hr_percent,
        "confidence": confidence,
    }


def _get_confidence_level(technical_percent: int, experience: str, skill_indicator: str) -> str:
    """Determine confidence level based on readiness scores and experience."""

    # High confidence: 70+% technical AND good experience/skills
    if technical_percent >= 70:
        if experience in ["5-8", "8+"] or skill_indicator in ["100+", "multiple", "bootcamp"]:
            return "high"
        return "medium"

    # Medium confidence: 55-69%
    elif technical_percent >= 55:
        return "medium"

    # Low confidence: below 55
    else:
        return "low"
