"""
Job opportunity generation with alt path logic.

Generates 3 career timeline cards:
1. Target role + target company (user's stated goal)
2. Same role + easier company (stepping stone)
3. Different role + target company (alternative specialization)

For non-tech exploring users: Shows 2 intern roles (frontend + backend)
"""

from typing import Dict, List, Any, Optional, Tuple
from src.models.models import JobOpportunityCard, RecommendedRole
from src.services.persona_matcher import (
    get_matching_persona,
    get_alternative_role
)
from src.services.timeline_logic import calculate_timeline_for_card


def _format_role_display(role: str, company_type: Optional[str] = None) -> str:
    """Format role ID to display text."""
    role_display_map = {
        "backend-sde": "Backend Engineer",
        "fullstack-sde": "Full-Stack Engineer",
        "senior-backend": "Senior Backend Engineer",
        "senior-fullstack": "Senior Full-Stack Engineer",
        "data-ml": "Data / ML Engineer",
        "tech-lead": "Tech Lead / Staff Engineer",
        "devops": "DevOps / SRE Engineer",
        "frontend": "Frontend Engineer",
        "qa-automation": "QA Automation Engineer",
        "architect": "Solutions Architect"
    }

    display = role_display_map.get(role, role.replace("-", " ").title())

    if company_type:
        company_display = _format_company_display(company_type)
        return f"{display} @ {company_display}"

    return display


def _format_company_display(company_type: str) -> str:
    """Format company type to display text."""
    company_display_map = {
        "faang": "FAANG / Big Tech",
        "unicorns": "Product Unicorns",
        "product": "Product Companies",
        "startups": "High-Growth Startups",
        "better-service": "Service Companies",
        "any-tech": "Any Tech Company",
        "service": "Service Companies",
        "faang-longterm": "FAANG / Big Tech",
        "not-sure": "Top Tech Company"
    }

    return company_display_map.get(company_type, company_type)


def _get_easier_company(target_company: str) -> str:
    """
    Get next easier company in hierarchy.

    Hierarchy: FAANG → Unicorns → Product → Startups → Service → Startups
    For beginners (any-tech, not-sure): downgrade to service companies
    """
    hierarchy = {
        "faang": "unicorns",
        "unicorns": "product",
        "product": "startups",
        "startups": "better-service",
        "better-service": "better-service",
        "any-tech": "better-service",
        "service": "service",
        "faang-longterm": "product",
        "not-sure": "better-service",
        "evaluating": "better-service"
    }

    return hierarchy.get(target_company, "better-service")


def _generate_exploring_cards(persona_id: str) -> List[JobOpportunityCard]:
    """
    Generate 2 intern cards for non-tech users who are exploring.

    Users still exploring should try both frontend and backend to decide.
    """

    return [
        JobOpportunityCard(
            title="Frontend Engineer (Intern)",
            role="frontend",
            copy="Want to test if you enjoy building UIs? This is perfect for exploring. Frontend is visual, immediate feedback, and beginner-friendly.",
            goal="Complete 2-3 frontend projects and decide if this specialization excites you.",
            action_items=[
                "Build a simple to-do app with React",
                "Create a portfolio website to showcase your work",
                "Learn responsive design principles"
            ],
            key_focus="Understanding user interfaces and learning JavaScript fundamentals",
            milestones=[
                "Month 1: HTML, CSS, JavaScript basics",
                "Month 2: Learn React or Vue framework",
                "Month 3: Build frontend projects and decide your path"
            ],
            min_months=3,
            max_months=6,
            timeline_text="3-6 months",
            card_type="intern_explore_1"
        ),
        JobOpportunityCard(
            title="Backend Engineer (Intern)",
            role="backend",
            copy="Prefer building APIs and databases? Backend is the foundation. It's trickier but more powerful and lucrative.",
            goal="Complete 2-3 backend projects and decide if this specialization excites you.",
            action_items=[
                "Build a simple REST API with Node.js or Python",
                "Learn database design and SQL",
                "Understand how frontend and backend communicate"
            ],
            key_focus="Understanding server-side logic, databases, and API design",
            milestones=[
                "Month 1: Python/Node.js basics and databases",
                "Month 2: Build simple API projects",
                "Month 3: Decide between frontend, backend, or full-stack"
            ],
            min_months=3,
            max_months=6,
            timeline_text="3-6 months",
            card_type="intern_explore_2"
        )
    ]


def generate_job_opportunities(
    background: str,
    quiz_responses: Dict[str, Any]
) -> List[JobOpportunityCard]:
    """
    Generate 3 career timeline cards for the user.

    For non-tech exploring users: Returns 2 intern cards
    For others: Returns 3 cards (target, alternative_1_easier_company, alternative_2_different_role)

    Args:
        background: "tech" or "non-tech"
        quiz_responses: User's quiz responses

    Returns:
        List of JobOpportunityCard objects
    """

    # Get basic info
    target_role = quiz_responses.get("targetRole")
    target_company = quiz_responses.get("targetCompany", "any-tech")

    # Match to persona
    persona_id, persona = get_matching_persona(
        background=background,
        currentRole=quiz_responses.get("currentRole"),
        currentSkill=quiz_responses.get("currentSkill"),
        experience=quiz_responses.get("experience"),
        targetRole=target_role,
        targetCompany=target_company,
        codeComfort=quiz_responses.get("codeComfort")
    )

    # Handle non-tech exploring case
    if background == "non-tech" and target_role == "not-sure":
        return _generate_exploring_cards(persona_id)

    # Generate 3 cards: target, easier company, different role
    cards = []

    # CARD 1: Target role + target company
    card1_timeline = calculate_timeline_for_card(
        persona_id=persona_id,
        card_type="target",
        quiz_responses=quiz_responses,
        target_company=target_company
    )

    card1 = JobOpportunityCard(
        title=_format_role_display(target_role, target_company),
        role=target_role,
        copy=card1_timeline["copy"],
        goal=card1_timeline["goal"],
        action_items=card1_timeline["action_items"],
        key_focus="Your stated goal - focus on these areas",
        milestones=card1_timeline["milestones"],
        min_months=card1_timeline["min_months"],
        max_months=card1_timeline["max_months"],
        timeline_text=card1_timeline["timeline_text"],
        card_type="target"
    )
    cards.append(card1)

    # CARD 2: Same role + easier company
    easier_company = _get_easier_company(target_company)
    card2_timeline = calculate_timeline_for_card(
        persona_id=persona_id,
        card_type="alternative_1_easier_company",
        quiz_responses=quiz_responses,
        target_company=easier_company
    )

    card2 = JobOpportunityCard(
        title=_format_role_display(target_role, easier_company),
        role=target_role,
        copy=card2_timeline["copy"],
        goal=card2_timeline["goal"],
        action_items=card2_timeline["action_items"],
        key_focus="Easier entry point - faster timeline",
        milestones=card2_timeline["milestones"],
        min_months=card2_timeline["min_months"],
        max_months=card2_timeline["max_months"],
        timeline_text=card2_timeline["timeline_text"],
        card_type="alternative_1_easier_company"
    )
    cards.append(card2)

    # CARD 3: Different role + target company
    alt_role = get_alternative_role(persona_id, target_role)
    if alt_role:
        card3_timeline = calculate_timeline_for_card(
            persona_id=persona_id,
            card_type="alternative_2_different_role",
            quiz_responses=quiz_responses,
            target_company=target_company
        )

        card3 = JobOpportunityCard(
            title=_format_role_display(alt_role, target_company),
            role=alt_role,
            copy=card3_timeline["copy"],
            goal=card3_timeline["goal"],
            action_items=card3_timeline["action_items"],
            key_focus="Alternative specialization - expands your options",
            milestones=card3_timeline["milestones"],
            min_months=card3_timeline["min_months"],
            max_months=card3_timeline["max_months"],
            timeline_text=card3_timeline["timeline_text"],
            card_type="alternative_2_different_role"
        )
        cards.append(card3)

    return cards


def generate_recommended_roles(
    background: str,
    quiz_responses: Dict[str, Any]
) -> List[RecommendedRole]:
    """
    Generate recommended roles for the RecommendedRole section.

    Same 3 cards as job opportunities, but using RecommendedRole schema.
    """

    # Get basic info
    target_role = quiz_responses.get("targetRole")
    target_company = quiz_responses.get("targetCompany", "any-tech")

    # Match to persona
    persona_id, persona = get_matching_persona(
        background=background,
        currentRole=quiz_responses.get("currentRole"),
        currentSkill=quiz_responses.get("currentSkill"),
        experience=quiz_responses.get("experience"),
        targetRole=target_role,
        targetCompany=target_company,
        codeComfort=quiz_responses.get("codeComfort")
    )

    # For exploring users, show 2 roles instead
    if background == "non-tech" and target_role == "not-sure":
        return _generate_exploring_recommended_roles()

    roles = []

    # CARD 1: Target role + target company
    card1_timeline = calculate_timeline_for_card(
        persona_id=persona_id,
        card_type="target",
        quiz_responses=quiz_responses,
        target_company=target_company
    )

    role1 = RecommendedRole(
        title=_format_role_display(target_role, target_company),
        role=target_role,
        seniority="Entry",  # Would be derived from role ID in production
        reason=f"Your stated target role at {_format_company_display(target_company)}",
        key_gap="Primary focus area",
        milestones=card1_timeline["milestones"],
        timeline_text=card1_timeline["timeline_text"],
        min_months=card1_timeline["min_months"],
        max_months=card1_timeline["max_months"],
        card_type="target",
        confidence="high"
    )
    roles.append(role1)

    # CARD 2: Easier company
    easier_company = _get_easier_company(target_company)
    card2_timeline = calculate_timeline_for_card(
        persona_id=persona_id,
        card_type="alternative_1_easier_company",
        quiz_responses=quiz_responses,
        target_company=easier_company
    )

    role2 = RecommendedRole(
        title=_format_role_display(target_role, easier_company),
        role=target_role,
        seniority="Entry",
        reason=f"Same role, easier entry point at {_format_company_display(easier_company)}",
        key_gap="Faster path to your goal",
        milestones=card2_timeline["milestones"],
        timeline_text=card2_timeline["timeline_text"],
        min_months=card2_timeline["min_months"],
        max_months=card2_timeline["max_months"],
        card_type="alternative_1_easier_company",
        confidence="high"
    )
    roles.append(role2)

    # CARD 3: Different role
    alt_role = get_alternative_role(persona_id, target_role)
    if alt_role:
        card3_timeline = calculate_timeline_for_card(
            persona_id=persona_id,
            card_type="alternative_2_different_role",
            quiz_responses=quiz_responses,
            target_company=target_company
        )

        role3 = RecommendedRole(
            title=_format_role_display(alt_role, target_company),
            role=alt_role,
            seniority="Entry",
            reason=f"Alternative specialization at {_format_company_display(target_company)} - expands your options",
            key_gap="New specialization",
            milestones=card3_timeline["milestones"],
            timeline_text=card3_timeline["timeline_text"],
            min_months=card3_timeline["min_months"],
            max_months=card3_timeline["max_months"],
            card_type="alternative_2_different_role",
            confidence="medium"
        )
        roles.append(role3)

    return roles


def _generate_exploring_recommended_roles() -> List[RecommendedRole]:
    """Generate recommended roles for exploring users."""

    return [
        RecommendedRole(
            title="Frontend Engineer (Intern)",
            role="frontend",
            seniority="Entry",
            reason="Test if you enjoy building user interfaces and frontend development",
            key_gap="Understanding UI fundamentals",
            milestones=[
                "Month 1: HTML, CSS, JavaScript basics",
                "Month 2: Learn React or Vue",
                "Month 3: Build frontend projects"
            ],
            timeline_text="3-6 months",
            min_months=3,
            max_months=6,
            card_type="intern_explore_1",
            confidence="medium"
        ),
        RecommendedRole(
            title="Backend Engineer (Intern)",
            role="backend",
            seniority="Entry",
            reason="Test if you enjoy building APIs, databases, and server-side logic",
            key_gap="Understanding server-side fundamentals",
            milestones=[
                "Month 1: Python/Node.js basics and databases",
                "Month 2: Build simple API projects",
                "Month 3: Decide your specialization"
            ],
            timeline_text="3-6 months",
            min_months=3,
            max_months=6,
            card_type="intern_explore_2",
            confidence="medium"
        )
    ]
