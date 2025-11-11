"""
Persona matcher for the 25-persona system.

Tech: 4 current roles × 5 experience levels = 20 personas
Non-Tech: 5 target roles × 1 code comfort = 5 personas

Total: 25 personas
"""

import json
from typing import Tuple, Dict, Any, Optional
from pathlib import Path


def load_personas():
    """Load personas from config file."""
    personas_path = Path(__file__).parent.parent / "config" / "personas.json"
    with open(personas_path, "r") as f:
        data = json.load(f)
    return data["personas"]


PERSONAS = load_personas()


def get_matching_persona(
    background: str,
    currentRole: Optional[str] = None,
    currentSkill: Optional[str] = None,
    experience: Optional[str] = None,
    targetRole: Optional[str] = None,
    targetCompany: Optional[str] = None,
    codeComfort: Optional[str] = None
) -> Tuple[str, Dict[str, Any]]:
    """
    Match user to a persona from the 25-persona system.

    Args:
        background: "tech" or "non-tech"
        currentRole: (tech only) "swe-product" | "swe-service" | "devops" | "qa-support"
        currentSkill: (tech only) role-specific skill
        experience: "0-2" | "2-3" | "3-5" | "5-8" | "8+" (tech) or "0" | "0-2" | "2-3" | "3-5" | "5+" (non-tech)
        targetRole: "backend-sde" | "fullstack-sde" | etc (tech) or "frontend" | "backend" | "fullstack" | "data-ml" | "not-sure" (non-tech)
        targetCompany: "faang" | "unicorns" | etc
        codeComfort: (non-tech only) "confident" | "learning" | "beginner" | "complete-beginner"

    Returns:
        Tuple of (persona_id, persona_config)
    """

    if background == "tech":
        return _match_tech_persona(
            current_role=currentRole,
            experience=experience
        )
    else:  # non-tech
        return _match_nontech_persona(
            target_role=targetRole,
            code_comfort=codeComfort
        )


def _match_tech_persona(
    current_role: str,
    experience: str
) -> Tuple[str, Dict[str, Any]]:
    """
    Match tech user to one of 20 tech personas.

    Formula: {currentRole}_{experience_level}

    Examples:
    - swe_product + 0-2 years → "swe_product_junior"
    - devops + 5-8 years → "devops_senior"
    - qa-support + 8+ years → "qa_support_expert"
    """

    # Normalize experience to level name
    experience_mapping = {
        "0-2": "junior",
        "2-3": "mid1",
        "3-5": "mid2",
        "5-8": "senior",
        "8+": "expert"
    }

    # Normalize currentRole to persona name
    role_mapping = {
        "swe-product": "swe_product",
        "swe-service": "swe_service",
        "devops": "devops",
        "qa-support": "qa_support"
    }

    experience_level = experience_mapping.get(experience, "mid2")
    role_prefix = role_mapping.get(current_role, "swe_product")

    persona_id = f"{role_prefix}_{experience_level}"

    persona = PERSONAS.get(persona_id)
    if not persona:
        # Fallback to default
        persona_id = "swe_product_mid2"
        persona = PERSONAS.get(persona_id)

    return persona_id, persona


def _match_nontech_persona(
    target_role: Optional[str] = None,
    code_comfort: Optional[str] = None
) -> Tuple[str, Dict[str, Any]]:
    """
    Match non-tech user to one of 5 non-tech personas.

    Formula: nontech_{targetRole}

    For non-tech users, experience is applied dynamically within the persona,
    not as a separate persona identifier.

    Examples:
    - targetRole: frontend → "nontech_frontend"
    - targetRole: backend → "nontech_backend"
    - targetRole: not-sure → "nontech_exploring"
    """

    # Normalize targetRole
    role_mapping = {
        "frontend": "frontend",
        "backend": "backend",
        "fullstack": "fullstack",
        "data-ml": "dataml",
        "not-sure": "exploring",
        "exploring": "exploring"
    }

    role_key = role_mapping.get(target_role, "exploring")
    persona_id = f"nontech_{role_key}"

    persona = PERSONAS.get(persona_id)
    if not persona:
        # Fallback to exploring
        persona_id = "nontech_exploring"
        persona = PERSONAS.get(persona_id)

    return persona_id, persona


def get_timeline_config(
    persona_id: str,
    card_type: str,
    company_type: Optional[str] = None
) -> Dict[str, Any]:
    """
    Get timeline config for a specific card.

    Args:
        persona_id: e.g., "swe_product_junior"
        card_type: "target", "alternative_1_easier_company", "alternative_2_different_role"
        company_type: (legacy, not used in v3) - kept for backwards compatibility

    Returns:
        Dict with timeline_text, min_months, max_months
    """

    persona = PERSONAS.get(persona_id)
    if not persona:
        return {
            "min_months": 4,
            "max_months": 6,
            "timeline_text": "4-6 months"
        }

    card_config = persona.get("cards", {}).get(card_type)
    if not card_config:
        return {
            "min_months": 4,
            "max_months": 6,
            "timeline_text": "4-6 months"
        }

    # In v3, timeline is calculated dynamically, not stored in config
    # This function returns the card config for reference
    return {
        "copy": card_config.get("copy", ""),
        "goal": card_config.get("goal", ""),
        "action_items": card_config.get("action_items", []),
        "milestones": card_config.get("milestones", [])
    }


def get_alternative_role(
    persona_id: str,
    target_role: str
) -> Optional[str]:
    """
    Get the alternative role recommendation for this persona.

    Args:
        persona_id: e.g., "swe_product_junior"
        target_role: user's current target role

    Returns:
        Alternative role, or None if not defined
    """

    persona = PERSONAS.get(persona_id)
    if not persona:
        return None

    role_recommendations = persona.get("role_recommendations", {})
    target_to_alt = role_recommendations.get("target_to_alternative_role", {})

    return target_to_alt.get(target_role)
