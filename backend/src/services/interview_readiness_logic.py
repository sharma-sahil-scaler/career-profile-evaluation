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
    """Calculate readiness for non-tech background users."""

    code_comfort = quiz_responses.get("codeComfort", "complete-beginner")
    steps_taken = quiz_responses.get("stepsTaken", "just-exploring")
    experience = quiz_responses.get("experience", "0")
    current_background = quiz_responses.get("currentBackground", "other")

    # Base from current coding comfort level (most important signal for interview readiness)
    if code_comfort == "confident":
        base = 65  # Can solve problems independently
    elif code_comfort == "learning":
        base = 55  # Can follow tutorials and struggle through
    elif code_comfort == "beginner":
        base = 50  # Understands concepts but can't code yet
    else:  # "complete-beginner"
        base = 45  # Haven't tried yet (floor)

    # Bonus for structured learning path (shows commitment and structure)
    if steps_taken == "bootcamp":
        base += 5  # Intensive structured learning
    elif steps_taken == "completed-course":
        base += 4  # Formal course completion
    elif steps_taken == "built-projects":
        base += 3  # Hands-on practical experience
    elif steps_taken == "self-learning":
        base += 1  # Self-directed but less structured
    # "just-exploring" adds 0

    # Boost for prior work experience (shows maturity and learning ability)
    if experience in ["3-5", "5+"]:
        base += 6  # Career switchers with experience are mature hires
    elif experience == "2-3":
        base += 3  # Some maturity from work experience
    elif experience == "0-2":
        base += 1  # Limited work experience but some maturity
    elif experience == "0":
        base += 0  # Fresh grad - no prior work experience

    # Boost for certain backgrounds (analytical skills transfer to coding)
    if current_background == "operations":
        base += 2  # Operations teaches systematic problem-solving
    elif current_background == "finance":
        base += 2  # Finance teaches precision and analytical thinking
    elif current_background == "design":
        base += 1  # Design thinking helps with problem decomposition
    elif current_background == "sales-marketing":
        base += 0  # Sales/marketing - less direct technical transfer
    elif current_background == "other":
        base += 0  # Other backgrounds

    # Floor at 45, ceiling at 75 for non-tech (they typically need more prep than tech users)
    technical_percent = max(45, min(75, base))

    # HR behavioral for non-tech can be higher (many non-tech have strong soft skills)
    hr_percent = max(45, min(75, technical_percent + 2))

    # Determine confidence level
    confidence = _get_confidence_level(technical_percent, experience, steps_taken)

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
