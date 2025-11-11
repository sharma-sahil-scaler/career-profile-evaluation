"""
Persona matching logic - maps quiz responses to one of 12 core personas
with realistic timelines and content recommendations
"""

import json
from pathlib import Path
from typing import Dict, Any, Tuple


def load_personas() -> Dict[str, Any]:
    """Load persona configuration from JSON"""
    personas_path = Path(__file__).parent.parent / "config" / "personas.json"
    with open(personas_path, "r") as f:
        return json.load(f)


def _normalize_value(value: str) -> str:
    """Normalize quiz response values for matching"""
    if not value:
        return ""
    return value.lower().replace(" ", "-").replace(".", "")


def _calculate_match_score(
    user_data: Dict[str, str],
    persona_criteria: Dict[str, list]
) -> float:
    """
    Calculate match score for persona based on matching criteria

    Weights:
    - targetRole: 35%
    - experience: 25%
    - background: 30%
    - currentRole: 10%
    """

    score = 0
    total_weight = 0

    # Weight mapping
    weights = {
        "targetRole": 0.35,
        "experience": 0.25,
        "background": 0.30,
        "currentRole": 0.10
    }

    for field, weight in weights.items():
        total_weight += weight
        criteria_values = persona_criteria.get(field, [])
        user_value = user_data.get(field, "")

        if not criteria_values or not user_value:
            continue

        # Normalize for comparison
        user_normalized = _normalize_value(user_value)
        criteria_normalized = [_normalize_value(v) for v in criteria_values]

        # Exact match = 1.0, partial match = 0.5, no match = 0
        if user_normalized in criteria_normalized:
            score += weight * 1.0
        elif any(user_normalized.startswith(c.split("-")[0]) for c in criteria_normalized):
            score += weight * 0.5

    return score / total_weight if total_weight > 0 else 0


def get_matching_persona(
    background: str,
    experience: str,
    target_role: str,
    current_role: str
) -> Tuple[str, Dict[str, Any]]:
    """
    Match quiz responses to best persona

    Returns:
        Tuple of (persona_id, persona_config)
    """

    personas_config = load_personas()
    personas = personas_config.get("persona_definitions", {})

    user_data = {
        "background": background,
        "experience": experience,
        "targetRole": target_role,
        "currentRole": current_role
    }

    # Calculate scores for all personas
    scores = {}
    for persona_id, persona_config in personas.items():
        criteria = persona_config.get("matching_criteria", {})
        score = _calculate_match_score(user_data, criteria)
        scores[persona_id] = score

    # Find best match
    best_persona_id = max(scores, key=scores.get)
    best_persona = personas.get(best_persona_id, {})

    return best_persona_id, best_persona


def get_timeline_config(
    persona_id: str,
    card_type: str,
    company_type: str = "any-tech"
) -> Dict[str, Any]:
    """
    Get timeline config for persona, card type, and company type

    Company types: faang, unicorns, product, service, startups, any-tech

    Returns:
        Dict with min_months, max_months, timeline_text
    """

    personas_config = load_personas()
    personas = personas_config.get("persona_definitions", {})

    persona = personas.get(persona_id, {})
    timeline_config = persona.get("timeline_config", {})
    card_timeline = timeline_config.get(card_type, {})

    # Try to get company-type specific timeline
    company_modifiers = card_timeline.get("company_modifiers", {})
    if company_type in company_modifiers:
        return company_modifiers[company_type]

    # Fallback to base timeline
    base_timeline = card_timeline.get("base", {})
    if base_timeline:
        return base_timeline

    # Ultimate fallback if not found
    return {
        "min_months": 3,
        "max_months": 6,
        "timeline_text": "3-6 months"
    }


def get_job_recommendations(persona_id: str, card_type: str) -> Dict[str, Any]:
    """
    Get hardcoded job recommendations for persona and card type

    Returns:
        Dict with key_focus and milestones
    """

    personas_config = load_personas()
    personas = personas_config.get("persona_definitions", {})

    persona = personas.get(persona_id, {})
    recommendations = persona.get("job_recommendations", {})
    card_recommendation = recommendations.get(card_type, {})

    # Fallback if not found
    if not card_recommendation:
        return {
            "key_focus": "Build your skills and prepare for the target role",
            "milestones": [
                "Focus on mastering core technical skills",
                "Build portfolio projects",
                "Practice interviews",
                "Prepare to transition"
            ]
        }

    return card_recommendation
