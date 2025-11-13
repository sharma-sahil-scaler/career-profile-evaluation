"""
Simplified timeline calculation logic.

Hybrid approach: Uses persona-based timeline as baseline + gap adjustments.
No caps, no convoluted multipliers. Just simple addition of gap months.
"""

import json
from typing import Dict, Any, Optional
from pathlib import Path


def load_personas():
    """Load personas from config file."""
    personas_path = Path(__file__).parent.parent / "config" / "personas.json"
    with open(personas_path, "r") as f:
        data = json.load(f)
    return data["personas"]


PERSONAS = load_personas()


def get_persona(persona_id: str) -> Optional[Dict[str, Any]]:
    """Get persona config by ID."""
    return PERSONAS.get(persona_id)


def calculate_gap_months(
    problem_solving: str,
    system_design: str,
    portfolio: str,
    persona_id: str
) -> int:
    """
    Calculate total gap months by summing individual gaps.

    Simple addition: no multipliers, no complexity.
    Returns total additional months needed beyond base timeline.
    """
    persona = get_persona(persona_id)
    if not persona or "timeline_gap_adjustments" not in persona:
        return 0

    gaps = persona["timeline_gap_adjustments"]

    gap_months = 0
    gap_months += gaps.get("problem_solving", {}).get(problem_solving, 0)
    gap_months += gaps.get("system_design", {}).get(system_design, 0)
    gap_months += gaps.get("portfolio", {}).get(portfolio, 0)

    return gap_months


def apply_experience_adjustment_nontech(
    experience: str,
    base_months: int
) -> int:
    """
    For non-tech users, apply experience adjustment.

    Adjustments:
    - 0 years: +4 months
    - 0-2 years: +2 months
    - 2-3 years: +1 month
    - 3-5 years: baseline (0 months)
    - 5+ years: -1 month
    """
    adjustments = {
        "0": 4,
        "0-2": 2,
        "2-3": 1,
        "3-5": 0,
        "5+": -1
    }

    adjustment = adjustments.get(experience, 0)
    return max(2, base_months + adjustment)  # Never go below 2 months


def calculate_timeline_for_card(
    persona_id: str,
    card_type: str,
    quiz_responses: Dict[str, Any],
    target_company: Optional[str] = None
) -> Dict[str, Any]:
    """
    Calculate timeline for a specific card (target or alternative).

    Args:
        persona_id: e.g., "swe_product_junior" or "nontech_backend"
        card_type: "target", "alternative_1_easier_company", or "alternative_2_different_role"
        quiz_responses: User's quiz answers
        target_company: (optional) For handling company-specific adjustments

    Returns:
        Dictionary with min_months, max_months, timeline_text, copy, goal, action_items, milestones
    """

    persona = get_persona(persona_id)
    if not persona:
        raise ValueError(f"Persona not found: {persona_id}")

    # Get base timeline from persona
    base_months = persona.get("base_timeline_months", 4)

    # Get card-specific config
    card_config = persona["cards"].get(card_type)
    if not card_config:
        raise ValueError(f"Card type not found: {card_type}")

    # Calculate gap adjustments (only for tech users with quiz responses)
    gap_months = 0
    if persona["domain"] == "tech":
        gap_months = calculate_gap_months(
            problem_solving=quiz_responses.get("problemSolving", "0-10"),
            system_design=quiz_responses.get("systemDesign", "not-yet"),
            portfolio=quiz_responses.get("portfolio", "none"),
            persona_id=persona_id
        )

    # Apply card-specific timeline adjustment
    card_adjustment = card_config.get("timeline_adjustment", 0)

    # Apply experience adjustment for non-tech users
    experience_adjustment = 0
    if persona["domain"] == "non-tech":
        experience = quiz_responses.get("experience", "0-2")
        experience_adjustment = persona.get("experience_adjustments", {}).get(experience, 0)

    # Calculate final timeline
    total_adjustment = gap_months + card_adjustment + experience_adjustment
    min_months = max(2, base_months + total_adjustment)  # Never below 2 months
    max_months = min_months + 2  # Always add 2-month buffer for max

    # No upper cap - can be 2-36+ months

    return {
        "min_months": min_months,
        "max_months": max_months,
        "timeline_text": f"{min_months}-{max_months} months",
        "copy": card_config.get("copy", ""),
        "goal": card_config.get("goal", ""),
        "action_items": card_config.get("action_items", []),
        "milestones": card_config.get("milestones", []),
        "card_type": card_type
    }


# Backwards compatibility (if needed)
def calculate_timeline_to_role(target_role: str, quiz_responses: Dict[str, Any]) -> Dict[str, Any]:
    """
    Legacy function for backwards compatibility.
    Matches user to persona and calculates timeline for target role.
    """
    from src.services.persona_matcher import get_matching_persona

    persona_id, _ = get_matching_persona(
        background=quiz_responses.get("background", "tech"),
        currentRole=quiz_responses.get("currentRole"),
        experience=quiz_responses.get("experience"),
        targetRole=quiz_responses.get("targetRole")
    )

    return calculate_timeline_for_card(
        persona_id=persona_id,
        card_type="target",
        quiz_responses=quiz_responses,
        target_company=quiz_responses.get("targetCompany")
    )
