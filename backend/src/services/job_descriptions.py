from typing import Any, Dict, List
from src.utils.label_mappings import get_role_label, get_company_label


# ===========================================================================================
# ROLE & COMPANY DIFFICULTY MAPPINGS
# ===========================================================================================

ROLE_DIFFICULTY = {
    # Tech roles
    "backend-sde": 5,
    "fullstack-sde": 6,
    "senior-backend": 7,
    "senior-fullstack": 8,
    "data-ml": 6,
    "tech-lead": 8,

    # Non-tech roles
    "backend": 5,
    "fullstack": 6,
    "frontend": 4,
    "data-ml": 6,
}

COMPANY_DIFFICULTY = {
    "faang": 9,
    "faang-longterm": 9,
    "unicorns": 7,
    "product": 7,
    "service": 4,
    "better-service": 4,
    "startups": 6,
    "any-tech": 3,
    "evaluating": 5,
    "not-sure": 5,
}


# ===========================================================================================
# HELPER FUNCTIONS FOR EXPLORER DETECTION & INFERENCE
# ===========================================================================================

def _is_non_tech_explorer(quiz_responses: Dict[str, Any]) -> bool:
    """Check if non-tech user is exploring (targetRole = 'not-sure')"""
    return quiz_responses.get("targetRole") == "not-sure"


def _is_tech_explorer(quiz_responses: Dict[str, Any]) -> bool:
    """Check if tech user is exploring (targetCompany = 'evaluating')"""
    target_company = quiz_responses.get("targetCompany", "")
    return target_company == "evaluating"


def _infer_target_role_from_comfort(code_comfort: str) -> str:
    """
    Infer best target role for non-tech explorer based on code comfort level.

    Args:
        code_comfort: 'confident', 'learning', 'beginner', or 'complete-beginner'

    Returns:
        Inferred target role: 'backend', 'fullstack', or 'frontend'
    """
    comfort_to_role = {
        "confident": "fullstack",      # Can handle complexity
        "learning": "backend",          # Structured, logic-based
        "beginner": "frontend",         # Visual, easier entry
        "complete-beginner": "frontend" # Visual, easier entry
    }
    return comfort_to_role.get(code_comfort, "frontend")


def _infer_target_role_from_current(current_role: str) -> str:
    """
    Infer best target role for tech explorer based on current role.

    Args:
        current_role: 'swe-product', 'swe-service', 'devops', or 'qa-support'

    Returns:
        Inferred target role
    """
    role_to_target = {
        "swe-product": "backend-sde",      # Know architecture already
        "swe-service": "backend-sde",      # Enterprise background
        "devops": "backend-sde",           # Infrastructure → backend transition
        "qa-support": "backend-sde",       # Testing → backend progression
    }
    return role_to_target.get(current_role, "backend-sde")


def _infer_target_company_for_explorer(background: str, current_company_type: str = None) -> str:
    """
    Infer progression path for company transition.

    For non-tech: Start with "any-tech" (experience first)
    For tech: Progress from current company type
    """
    if background == "non-tech":
        return "any-tech"  # Non-tech explorers start with any tech company

    # Tech explorers: infer based on current
    if current_company_type == "product":
        return "unicorns"  # Product → unicorns/scale-ups
    elif current_company_type == "service":
        return "product"   # Service → product companies
    elif current_company_type == "startup":
        return "unicorns"  # Startup → bigger startups/unicorns
    else:
        return "product"   # Default to product


# ===========================================================================================
# MILESTONE GENERATION BASED ON ACTUAL GAPS
# ===========================================================================================

def _generate_personalized_milestones(
    background: str,
    quiz_responses: Dict[str, Any],
    target_role: str,
    card_type: str  # "target", "stepping_stone", or "alternative"
) -> List[str]:
    """
    Generate milestones personalized to user's actual gaps and SPECIFIC ROLE.

    Each card gets role-specific milestones so they don't feel repetitive.

    Args:
        background: 'tech' or 'non-tech'
        quiz_responses: User's quiz answers
        target_role: The target role for this card (AFFECTS content)
        card_type: Type of card (affects milestone specificity)

    Returns:
        List of personalized milestones
    """

    milestones = []

    if background == "non-tech":
        code_comfort = quiz_responses.get("codeComfort", "beginner")
        experience = quiz_responses.get("experience", "0")

        # ROLE-SPECIFIC FIRST MILESTONE
        if target_role == "frontend":
            if code_comfort in ["beginner", "complete-beginner"]:
                milestones.append("Month 1-2: Master HTML, CSS, JavaScript fundamentals")
            elif code_comfort == "learning":
                milestones.append("Month 1-2: Build responsive UI projects with React/Vue")
            else:
                milestones.append("Month 1-2: Advanced frontend patterns & accessibility")
        elif target_role == "backend":
            if code_comfort in ["beginner", "complete-beginner"]:
                milestones.append("Month 1-2: Learn backend basics (Python/Node.js, APIs)")
            elif code_comfort == "learning":
                milestones.append("Month 1-2: Build backend services with databases")
            else:
                milestones.append("Month 1-2: Advanced backend architecture & scaling")
        else:  # fullstack or data-ml
            if code_comfort in ["beginner", "complete-beginner"]:
                milestones.append("Month 1-2: Complete full-stack fundamentals (frontend + backend)")
            elif code_comfort == "learning":
                milestones.append("Month 1-2: Build full-stack applications (MERN, LAMP, etc)")
            else:
                milestones.append("Month 1-2: Advanced full-stack patterns & system design")

        # EXPERIENCE-BASED MILESTONE (role-generic progression)
        if experience in ["0", "0-2"]:
            milestones.append("Month 2-3: Create 2-3 projects showcasing this specialization")
            milestones.append("Month 3-4: Practice technical interviews for this role")
        else:
            milestones.append("Month 2-3: Contribute to real projects in this domain")
            milestones.append("Month 3-4: Build professional portfolio in this area")

        # CARD-SPECIFIC CLOSING MILESTONE
        if card_type == "stepping_stone":
            milestones.append(f"Month 4-5: Secure first {target_role} role")
        elif card_type == "alternative":
            milestones.append(f"Month 6+: Transition to advanced {target_role} specializations")

    else:  # tech background
        problem_solving = quiz_responses.get("problemSolving", "0-10")
        system_design = quiz_responses.get("systemDesign", "not-yet")
        portfolio = quiz_responses.get("portfolio", "none")
        experience = quiz_responses.get("experience", "0-2")

        # ROLE-SPECIFIC PROBLEM-SOLVING MILESTONE
        role_focus = "patterns" if target_role in ["backend-sde", "data-ml"] else "algorithms"
        if problem_solving in ["0-10", "11-50"]:
            milestones.append(f"Month 1-2: Practice 50+ {role_focus} for {target_role} interviews")
        elif problem_solving == "51-100":
            milestones.append(f"Month 1-2: Master 100+ advanced {role_focus}")
        else:
            milestones.append(f"Month 1-2: Specialize in {target_role} problem patterns")

        # ROLE-SPECIFIC SYSTEM DESIGN MILESTONE
        if target_role in ["senior-backend", "senior-fullstack", "tech-lead"]:
            if system_design in ["not-yet", "learning"]:
                milestones.append("Month 2-3: Deep dive into system design (Alex Xu, mock interviews)")
            elif system_design == "once":
                milestones.append("Month 2-3: Lead architecture discussions in team")
            else:
                milestones.append("Month 2-3: Design enterprise-scale systems")
        else:
            if system_design in ["not-yet", "learning"]:
                milestones.append(f"Month 2-3: Learn {target_role} specific design patterns")
            elif system_design == "once":
                milestones.append(f"Month 2-3: Apply system design to {target_role} projects")
            else:
                milestones.append(f"Month 2-3: Master {target_role} architecture")

        # ROLE-SPECIFIC PROJECT MILESTONE
        if target_role in ["data-ml"]:
            if portfolio in ["none", "inactive"]:
                milestones.append("Month 3-4: Build 2 end-to-end ML/data projects")
            else:
                milestones.append("Month 3-4: Contribute to open-source ML projects")
        else:
            if portfolio in ["none", "inactive"]:
                milestones.append(f"Month 3-4: Build 2 production-grade {target_role} projects")
            else:
                milestones.append(f"Month 3-4: Contribute to {target_role} open-source")

        # CARD-SPECIFIC CLOSING MILESTONE
        if card_type == "stepping_stone":
            milestones.append(f"Month 4-5: Interview prep for {target_role} positions")
        elif card_type == "alternative":
            milestones.append(f"Month 6-8: Master alternative {target_role} specializations")

    return milestones[:4] if len(milestones) > 4 else milestones


# ===========================================================================================
# TIMELINE ESTIMATION
# ===========================================================================================

def _estimate_timeline(
    background: str,
    current_role_difficulty: int,
    target_role_difficulty: int,
    card_type: str
) -> Dict[str, Any]:
    """
    Estimate months and create human-readable timeline.

    Args:
        background: 'tech' or 'non-tech'
        current_role_difficulty: Current difficulty score (0-10)
        target_role_difficulty: Target difficulty score (0-10)
        card_type: 'stepping_stone', 'target', or 'alternative'

    Returns:
        Dict with: min_months, max_months, timeline_text
    """

    if card_type == "stepping_stone":
        return {
            "min_months": 2,
            "max_months": 4,
            "timeline_text": "2-4 months"
        }

    # Calculate difficulty jump
    difficulty_gap = max(0, target_role_difficulty - current_role_difficulty)

    if background == "non-tech":
        # Non-tech roles take longer due to learning curve
        base_months = 6 + (difficulty_gap * 2)
        max_months = 12 + (difficulty_gap * 2)
    else:
        # Tech transitions are faster
        base_months = 3 + difficulty_gap
        max_months = 9 + (difficulty_gap * 1.5)

    min_months = max(2, int(base_months))
    max_months = max(min_months + 2, int(max_months))

    # Cap at reasonable limits
    min_months = min(min_months, 24)
    max_months = min(max_months, 24)

    timeline_text = f"{min_months}-{max_months} months"

    if card_type == "alternative":
        # Alternative roles take longer (learning new specialization)
        min_months = max(12, min_months)
        max_months = max(18, max_months)
        timeline_text = f"{min_months}-{max_months} months"

    return {
        "min_months": min_months,
        "max_months": max_months,
        "timeline_text": timeline_text
    }


# ===========================================================================================
# KEY FOCUS DETERMINATION
# ===========================================================================================

def _get_key_focus(background: str, quiz_responses: Dict[str, Any], card_type: str) -> str:
    """
    Determine the primary focus/gap for this role.
    """

    if card_type == "stepping_stone":
        return "Build fundamentals and get hands-on experience"

    if background == "non-tech":
        code_comfort = quiz_responses.get("codeComfort", "beginner")
        if code_comfort in ["beginner", "complete-beginner"]:
            return "Master coding fundamentals and build confidence"
        elif code_comfort == "learning":
            return "Build projects and gain real-world experience"
        else:
            return "Deepen specialized skills in target domain"

    else:  # tech
        problem_solving = quiz_responses.get("problemSolving", "0-10")
        system_design = quiz_responses.get("systemDesign", "not-yet")

        if problem_solving in ["0-10", "11-50"]:
            return "Master coding problem-solving skills"
        elif system_design in ["not-yet", "learning"]:
            return "Strengthen system design and architecture knowledge"
        else:
            return "Build production experience and leadership skills"


# ===========================================================================================
# CARD GENERATION
# ===========================================================================================

def _create_job_card(
    title: str,
    role: str,
    key_focus: str,
    milestones: List[str],
    min_months: int,
    max_months: int
) -> Dict[str, Any]:
    """Create a single job opportunity card."""
    return {
        "title": title,
        "role": role,
        "key_focus": key_focus,
        "milestones": milestones,
        "min_months": min_months,
        "max_months": max_months,
        "timeline_text": f"{min_months}-{max_months} months"
    }


def _get_stepping_stone_role(
    background: str,
    target_role: str,
    current_experience: str
) -> str:
    """
    Get a 1-level easier role for stepping stone.
    """

    if background == "non-tech":
        # For entry-level, suggest intern/junior versions
        stepping_roles = {
            "backend": "frontend",      # Easier: visual/frontend
            "fullstack": "frontend",    # Easier: specialize in frontend
            "frontend": "frontend",     # Already easy, stick with it
            "data-ml": "frontend",      # Easier: web dev first
        }
        return stepping_roles.get(target_role, "frontend")

    else:  # tech
        # For tech users, suggest lower seniority in current domain
        stepping_roles = {
            "senior-backend": "backend-sde",
            "senior-fullstack": "fullstack-sde",
            "backend-sde": "fullstack-sde",  # Easier: broader skills
            "fullstack-sde": "backend-sde",  # More specialized, then broaden
            "data-ml": "backend-sde",        # Easier: general backend first
            "tech-lead": "senior-backend",
        }
        return stepping_roles.get(target_role, "fullstack-sde")


def _get_alternative_role(
    background: str,
    target_role: str
) -> str:
    """
    Get an alternative specialization for diversity.
    """

    if background == "non-tech":
        alternatives = {
            "backend": "fullstack",
            "fullstack": "backend",
            "frontend": "fullstack",
            "data-ml": "backend",
        }
        return alternatives.get(target_role, "fullstack")

    else:  # tech
        alternatives = {
            "senior-backend": "senior-fullstack",
            "senior-fullstack": "senior-backend",
            "backend-sde": "fullstack-sde",
            "fullstack-sde": "backend-sde",
            "data-ml": "backend-sde",
            "tech-lead": "backend-sde",
        }
        return alternatives.get(target_role, "backend-sde")


def _get_current_company_difficulty(current_role: str) -> int:
    """Infer company difficulty from current role."""
    company_by_role = {
        "swe-product": 7,      # Product companies: 7 difficulty
        "swe-service": 4,      # Service companies: 4 difficulty
        "devops": 6,           # Usually mid-tier companies: 6 difficulty
        "qa-support": 4,       # Service companies: 4 difficulty
    }
    return company_by_role.get(current_role, 5)


# ===========================================================================================
# MAIN FUNCTION: generate_job_opportunities
# ===========================================================================================

def generate_job_opportunities(background: str, quiz_responses: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Generate 2-3 personalized job opportunity cards based on user profile.

    Returns:
        List of job opportunity dicts with: title, role, key_focus, milestones, timeline_text, min_months, max_months

    Card Strategy:
    - If has target role: 3 cards (target + stepping stone + alternative)
    - If exploring: 2 cards (stepping stone + bigger goal)
    """

    cards = []
    target_role = quiz_responses.get("targetRole", "")
    target_company = quiz_responses.get("targetCompany", "")
    current_role = quiz_responses.get("currentRole", "")
    current_experience = quiz_responses.get("experience", "0-2")

    # Determine if exploring
    is_exploring = False
    if background == "non-tech":
        is_exploring = _is_non_tech_explorer(quiz_responses)
        if is_exploring:
            code_comfort = quiz_responses.get("codeComfort", "beginner")
            target_role = _infer_target_role_from_comfort(code_comfort)
            target_company = "any-tech"
    else:  # tech
        is_exploring = _is_tech_explorer(quiz_responses)
        if is_exploring:
            target_role = _infer_target_role_from_current(current_role)
            target_company = _infer_target_company_for_explorer(background)

    # Get difficulty levels
    current_company_difficulty = _get_current_company_difficulty(current_role) if background == "tech" else 3
    target_role_difficulty = ROLE_DIFFICULTY.get(target_role, 5)
    target_company_difficulty = COMPANY_DIFFICULTY.get(target_company, 5)

    # ===== CASE 1: USER HAS TARGET ROLE (OR NOW HAS INFERRED ROLE) =====

    if not is_exploring:
        # CARD 1: TARGET ROLE (their actual target)
        title = f"{get_role_label(target_role)} @ {get_company_label(target_company)}"
        milestones = _generate_personalized_milestones(background, quiz_responses, target_role, "target")
        timeline = _estimate_timeline(
            background,
            current_company_difficulty,
            target_role_difficulty,
            "target"
        )

        cards.append(_create_job_card(
            title=title,
            role=target_role,
            key_focus=_get_key_focus(background, quiz_responses, "target"),
            milestones=milestones,
            min_months=timeline["min_months"],
            max_months=timeline["max_months"]
        ))

        # CARD 2: STEPPING STONE (1 level easier, easier company)
        stepping_role = _get_stepping_stone_role(background, target_role, current_experience)
        stepping_company = "startups" if target_company_difficulty > 6 else target_company

        title = f"{get_role_label(stepping_role)} @ {get_company_label(stepping_company)}"
        milestones = _generate_personalized_milestones(background, quiz_responses, stepping_role, "stepping_stone")
        timeline = _estimate_timeline(
            background,
            current_company_difficulty,
            ROLE_DIFFICULTY.get(stepping_role, 4),
            "stepping_stone"
        )

        cards.append(_create_job_card(
            title=title,
            role=stepping_role,
            key_focus="Build fundamentals and get hands-on experience",
            milestones=milestones,
            min_months=timeline["min_months"],
            max_months=timeline["max_months"]
        ))

        # CARD 3: ALTERNATIVE SPECIALIZATION
        alt_role = _get_alternative_role(background, target_role)
        alt_company = target_company  # Same difficulty level as target

        title = f"{get_role_label(alt_role)} @ {get_company_label(alt_company)}"
        milestones = _generate_personalized_milestones(background, quiz_responses, alt_role, "alternative")
        timeline = _estimate_timeline(
            background,
            current_company_difficulty,
            ROLE_DIFFICULTY.get(alt_role, 6),
            "alternative"
        )

        cards.append(_create_job_card(
            title=title,
            role=alt_role,
            key_focus=f"Explore alternative specialization: {get_role_label(alt_role)}",
            milestones=milestones,
            min_months=timeline["min_months"],
            max_months=timeline["max_months"]
        ))

    # ===== CASE 2: USER IS EXPLORING =====
    else:
        # CARD 1: ACHIEVABLE ENTRY-LEVEL ROLE (1 step easier)
        entry_role = _get_stepping_stone_role(background, target_role, current_experience)
        entry_company = "startups" if background == "non-tech" else target_company

        title = f"{get_role_label(entry_role)} @ {get_company_label(entry_company)}"
        milestones = _generate_personalized_milestones(background, quiz_responses, entry_role, "stepping_stone")
        timeline = _estimate_timeline(
            background,
            current_company_difficulty,
            ROLE_DIFFICULTY.get(entry_role, 4),
            "stepping_stone"
        )

        cards.append(_create_job_card(
            title=title,
            role=entry_role,
            key_focus="Get your first role quickly with fundamentals",
            milestones=milestones,
            min_months=timeline["min_months"],
            max_months=timeline["max_months"]
        ))

        # CARD 2: BIGGER GOAL (full target role for long-term)
        title = f"{get_role_label(target_role)} @ {get_company_label(target_company)}"
        milestones = _generate_personalized_milestones(background, quiz_responses, target_role, "target")
        timeline = _estimate_timeline(
            background,
            current_company_difficulty,
            ROLE_DIFFICULTY.get(target_role, 5),
            "target"
        )

        cards.append(_create_job_card(
            title=title,
            role=target_role,
            key_focus="Long-term growth path in your area of interest",
            milestones=milestones,
            min_months=timeline["min_months"],
            max_months=timeline["max_months"]
        ))

    return cards
