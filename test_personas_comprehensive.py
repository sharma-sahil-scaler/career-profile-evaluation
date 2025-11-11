#!/usr/bin/env python3
"""
Comprehensive Persona Testing Script
======================================

Tests the Free Profile Evaluation system with 12 distinct personas.
Tests one persona at a time, measuring API response and backend logic output.

Usage:
    python test_personas_comprehensive.py <persona_number>
    python test_personas_comprehensive.py 1          # Test Tech-Junior-Backend
    python test_personas_comprehensive.py all        # Test all 12 personas
    python test_personas_comprehensive.py --help     # Show help

Requirements:
    - Backend running at http://localhost:8000/career-profile-tool/api/evaluate
    - PostgreSQL with cache database
    - OPENAI_API_KEY environment variable set
"""

import json
import sys
import time
import requests
from datetime import datetime
from typing import Dict, Any, Optional
from pathlib import Path

# Color codes for terminal output
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


def print_header(text: str):
    """Print a formatted header."""
    print(f"\n{Colors.BOLD}{Colors.HEADER}{'='*80}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.HEADER}{text.center(80)}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.HEADER}{'='*80}{Colors.ENDC}\n")


def print_subheader(text: str):
    """Print a formatted subheader."""
    print(f"\n{Colors.BOLD}{Colors.CYAN}{text}{Colors.ENDC}")
    print(f"{Colors.CYAN}{'-' * len(text)}{Colors.ENDC}")


def print_success(text: str):
    """Print success message."""
    print(f"{Colors.GREEN}✓ {text}{Colors.ENDC}")


def print_error(text: str):
    """Print error message."""
    print(f"{Colors.RED}✗ {text}{Colors.ENDC}")


def print_info(text: str):
    """Print info message."""
    print(f"{Colors.BLUE}ℹ {text}{Colors.ENDC}")


def print_warning(text: str):
    """Print warning message."""
    print(f"{Colors.YELLOW}⚠ {text}{Colors.ENDC}")


# ============================================================================
# PERSONA DEFINITIONS
# ============================================================================

PERSONAS = {
    1: {
        "name": "Tech-Junior-Backend",
        "description": "Early-career backend engineer at service company, learning-focused, startup-bound",
        "background": "tech",
        "quiz_responses": {
            "currentRole": "swe-service",
            "currentRoleLabel": "Software Engineer - Service Company",
            "experience": "0-2",
            "currentSkill": "database",
            "primaryGoal": "better-company",
            "targetRole": "backend-sde",
            "targetRoleLabel": "Backend / API Engineer",
            "targetCompany": "startups",
            "targetCompanyLabel": "High Growth Startups",
            "problemSolving": "11-50",
            "systemDesign": "learning",
            "portfolio": "limited-1-5",
            "mockInterviews": "rarely",
            "currentCompany": "TCS",
        },
        "expected_interview_readiness": (55, 60),
        "expected_timeline_months": (6, 12),
    },
    2: {
        "name": "Tech-Mid-Product",
        "description": "Mid-level full-stack engineer at product company, FAANG-targeting, ambitious",
        "background": "tech",
        "quiz_responses": {
            "currentRole": "swe-product",
            "currentRoleLabel": "Software Engineer - Product Company",
            "experience": "3-5",
            "currentSkill": "fullstack",
            "primaryGoal": "level-up",
            "targetRole": "senior-fullstack",
            "targetRoleLabel": "Senior Full-Stack Engineer",
            "targetCompany": "faang",
            "targetCompanyLabel": "FAANG / Big Tech",
            "problemSolving": "100+",
            "systemDesign": "multiple",
            "portfolio": "active-5+",
            "mockInterviews": "weekly+",
            "currentCompany": "Flipkart",
        },
        "expected_interview_readiness": (70, 75),
        "expected_timeline_months": (3, 6),
    },
    3: {
        "name": "Tech-Senior-Specialist",
        "description": "8+ years DevOps specialist, domain expert, tech lead aspirations",
        "background": "tech",
        "quiz_responses": {
            "currentRole": "devops",
            "currentRoleLabel": "DevOps / Cloud / Infrastructure Engineer",
            "experience": "8+",
            "currentSkill": "cloud",
            "primaryGoal": "upskilling",
            "targetRole": "tech-lead",
            "targetRoleLabel": "Tech Lead / Staff Engineer",
            "targetCompany": "unicorns",
            "targetCompanyLabel": "Product Unicorns/Scaleups",
            "problemSolving": "51-100",
            "systemDesign": "once",
            "portfolio": "limited-1-5",
            "mockInterviews": "rarely",
            "currentCompany": "Accenture",
        },
        "expected_interview_readiness": (68, 72),
        "expected_timeline_months": (6, 9),
    },
    4: {
        "name": "Tech-Mid-Service",
        "description": "Mid-level enterprise engineer, switching from Java/.NET to modern stack",
        "background": "tech",
        "quiz_responses": {
            "currentRole": "swe-service",
            "currentRoleLabel": "Software Engineer - Service Company",
            "experience": "2-3",
            "currentSkill": "enterprise",
            "primaryGoal": "switch-domain",
            "targetRole": "backend-sde",
            "targetRoleLabel": "Backend / API Engineer",
            "targetCompany": "unicorns",
            "targetCompanyLabel": "Product Unicorns/Scaleups",
            "problemSolving": "11-50",
            "systemDesign": "learning",
            "portfolio": "inactive",
            "mockInterviews": "never",
            "currentCompany": "Cognizant",
        },
        "expected_interview_readiness": (58, 63),
        "expected_timeline_months": (6, 12),
    },
    5: {
        "name": "Tech-QA-Pivoting",
        "description": "QA engineer with 3-5 years, learning development, career pivoting",
        "background": "tech",
        "quiz_responses": {
            "currentRole": "qa-support",
            "currentRoleLabel": "QA / Support / Other Technical Role",
            "experience": "3-5",
            "currentSkill": "learning-dev",
            "primaryGoal": "level-up",
            "targetRole": "backend-sde",
            "targetRoleLabel": "Backend / API Engineer",
            "targetCompany": "better-service",
            "targetCompanyLabel": "Better Service Company",
            "problemSolving": "51-100",
            "systemDesign": "learning",
            "portfolio": "limited-1-5",
            "mockInterviews": "monthly",
            "currentCompany": "HCL",
        },
        "expected_interview_readiness": (62, 66),
        "expected_timeline_months": (6, 9),
    },
    6: {
        "name": "Tech-Early-Explorer",
        "description": "0-2 years experience, exploring specializations, undecided, data/ML interested",
        "background": "tech",
        "quiz_responses": {
            "currentRole": "swe-product",
            "currentRoleLabel": "Software Engineer - Product Company",
            "experience": "0-2",
            "currentSkill": "system-design",
            "primaryGoal": "upskilling",
            "targetRole": "data-ml",
            "targetRoleLabel": "Data / ML Engineer",
            "targetCompany": "evaluating",
            "targetCompanyLabel": "Still evaluating",
            "problemSolving": "0-10",
            # systemDesign NOT shown (conditional skipped)
            "portfolio": "none",
            "mockInterviews": "rarely",
            "currentCompany": "Google",
        },
        "expected_interview_readiness": (48, 52),
        "expected_timeline_months": (12, 18),
    },
    7: {
        "name": "Non-Tech-Bootcamp-Backend",
        "description": "Bootcamp graduate, salary/lifestyle motivated, confident, full-time commitment",
        "background": "non-tech",
        "quiz_responses": {
            "currentBackground": "other",
            "experience": "0-2",
            "stepsTaken": "bootcamp",
            "targetRole": "backend",
            "motivation": "salary",
            "targetCompany": "any-tech",
            "targetCompanyLabel": "Any tech company - experience first",
            "codeComfort": "confident",
            "timePerWeek": "10+",
        },
        "expected_interview_readiness": (65, 70),
        "expected_timeline_months": (3, 6),
    },
    8: {
        "name": "Non-Tech-Ops-Career-Switcher",
        "description": "Operations professional with 5+ years, data/ML interested, course-trained",
        "background": "non-tech",
        "quiz_responses": {
            "currentBackground": "operations",
            "experience": "5+",
            "stepsTaken": "completed-course",
            "targetRole": "data-ml",
            "motivation": "interest",
            "targetCompany": "faang-longterm",
            "targetCompanyLabel": "FAANG / Big Tech (long-term)",
            "codeComfort": "learning",
            "timePerWeek": "6-10",
        },
        "expected_interview_readiness": (60, 65),
        "expected_timeline_months": (12, 18),
    },
    9: {
        "name": "Non-Tech-Fresh-Grad-Explorer",
        "description": "Fresh graduate, no experience, exploring, stability-motivated, learning to start",
        "background": "non-tech",
        "quiz_responses": {
            "currentBackground": "other",
            "experience": "0",
            "stepsTaken": "just-exploring",
            "targetRole": "not-sure",
            "motivation": "stability",
            "targetCompany": "not-sure",
            "targetCompanyLabel": "Not sure / Need guidance",
            "codeComfort": "complete-beginner",
            "timePerWeek": "3-5",
        },
        "expected_interview_readiness": (35, 40),
        "expected_timeline_months": (12, 24),
    },
    10: {
        "name": "Non-Tech-Design-To-Frontend",
        "description": "Designer with 3-5 years, self-teaching code, frontend-targeted",
        "background": "non-tech",
        "quiz_responses": {
            "currentBackground": "design",
            "experience": "3-5",
            "stepsTaken": "self-learning",
            "targetRole": "frontend",
            "motivation": "interest",
            "targetCompany": "product",
            "targetCompanyLabel": "Product companies",
            "codeComfort": "learning",
            "timePerWeek": "6-10",
        },
        "expected_interview_readiness": (62, 67),
        "expected_timeline_months": (6, 12),
    },
    11: {
        "name": "Non-Tech-Sales-To-Backend",
        "description": "Sales professional with 2-3 years, project-based learning, lifestyle motivated",
        "background": "non-tech",
        "quiz_responses": {
            "currentBackground": "sales-marketing",
            "experience": "2-3",
            "stepsTaken": "built-projects",
            "targetRole": "backend",
            "motivation": "flexibility",
            "targetCompany": "service",
            "targetCompanyLabel": "Service companies",
            "codeComfort": "beginner",
            "timePerWeek": "3-5",
        },
        "expected_interview_readiness": (48, 53),
        "expected_timeline_months": (18, 24),
    },
    12: {
        "name": "Non-Tech-Finance-Backend-Ambitious",
        "description": "Finance professional with 5+ years, bootcamp-trained, confident, ambitious",
        "background": "non-tech",
        "quiz_responses": {
            "currentBackground": "finance",
            "experience": "5+",
            "stepsTaken": "bootcamp",
            "targetRole": "backend",
            "motivation": "salary",
            "targetCompany": "product",
            "targetCompanyLabel": "Product companies",
            "codeComfort": "confident",
            "timePerWeek": "10+",
        },
        "expected_interview_readiness": (68, 72),
        "expected_timeline_months": (3, 9),
    },
}


# ============================================================================
# API INTERACTION
# ============================================================================

def derive_problem_solving_from_code_comfort(code_comfort: str) -> str:
    """
    Derive problemSolving score from codeComfort level (for non-tech users).

    Matches frontend logic in evaluationLogic.js
    """
    mapping = {
        "confident": "51-100",
        "learning": "11-50",
        "beginner": "0-10",
        "complete-beginner": "0-10",
    }
    return mapping.get(code_comfort, "0-10")


def infer_portfolio_from_problem_solving(problem_solving: str) -> str:
    """
    Infer portfolio status from problem solving level (for non-tech users).

    Matches frontend logic in evaluationLogic.js
    """
    mapping = {
        "51-100": "limited-1-5",
        "11-50": "inactive",
        "0-10": "none",
    }
    return mapping.get(problem_solving, "none")


def map_requirement_type(goal_key: str, goal_value: str) -> str:
    """
    Map primaryGoal (tech) or motivation (non-tech) to requirementType.

    For tech: primaryGoal -> requirementType (direct mapping)
    For non-tech: motivation -> requirementType (direct mapping)
    """
    return goal_value  # Direct mapping - the value IS the requirementType


def build_request_payload(persona: Dict[str, Any]) -> Dict[str, Any]:
    """
    Build the API request payload from persona data.

    EXACTLY mirrors frontend transformation logic from evaluationLogic.js
    to ensure test script matches real frontend behavior.
    """
    background = persona["background"]
    quiz = persona["quiz_responses"]

    if background == "tech":
        # ===== TECH PROFESSIONAL FLOW =====
        # Based on evaluationLogic.js lines 50-74

        # Extract values from quiz responses
        currentRole = quiz["currentRole"]
        currentRoleLabel = quiz.get("currentRoleLabel", "")
        experience = quiz["experience"]
        currentSkill = quiz["currentSkill"]
        primaryGoal = quiz["primaryGoal"]
        targetRole = quiz["targetRole"]
        targetRoleLabel = quiz.get("targetRoleLabel", "")
        targetCompany = quiz["targetCompany"]
        targetCompanyLabel = quiz.get("targetCompanyLabel", "")
        problemSolving = quiz["problemSolving"]
        systemDesign = quiz.get("systemDesign", "not-yet")  # Default if not provided
        portfolio = quiz["portfolio"]
        currentCompany = quiz.get("currentCompany", "")

        # Map primaryGoal to requirementType
        requirementType = map_requirement_type("primaryGoal", primaryGoal)

        # Build quizResponses with ALL fields
        quiz_responses = {
            "currentRole": currentRole,
            "currentRoleLabel": currentRoleLabel,
            "experience": experience,
            "currentSkill": currentSkill,
            "primaryGoal": primaryGoal,
            "targetRole": targetRole,
            "targetRoleLabel": targetRoleLabel,
            "targetCompany": targetCompany,
            "targetCompanyLabel": targetCompanyLabel,
            "problemSolving": problemSolving,
            "systemDesign": systemDesign,
            "portfolio": portfolio,
            "mockInterviews": "never",  # HARDCODED in frontend
            "requirementType": requirementType,
            "currentCompany": currentCompany,
        }

        payload = {
            "background": "tech",
            "quizResponses": quiz_responses,
            "goals": {
                "requirementType": [],  # Empty array in frontend
                "targetCompany": "Not specified",  # Default in frontend
                "topicOfInterest": []  # Empty array in frontend
            }
        }

    else:
        # ===== NON-TECH PROFESSIONAL FLOW =====
        # Based on evaluationLogic.js lines 91-114

        # Extract values from quiz responses
        currentBackground = quiz["currentBackground"]
        experience = quiz["experience"]
        stepsTaken = quiz["stepsTaken"]
        targetRole = quiz["targetRole"]
        motivation = quiz["motivation"]
        targetCompany = quiz["targetCompany"]
        targetCompanyLabel = quiz.get("targetCompanyLabel", "")
        codeComfort = quiz["codeComfort"]
        timePerWeek = quiz["timePerWeek"]

        # DERIVE problemSolving from codeComfort (frontend logic)
        problemSolving = derive_problem_solving_from_code_comfort(codeComfort)

        # HARDCODED values in frontend
        systemDesign = "not-yet"
        mockInterviews = "never"
        currentCompany = "Transitioning from non-tech background"

        # INFER portfolio from problemSolving
        portfolio = infer_portfolio_from_problem_solving(problemSolving)

        # Map motivation to requirementType
        requirementType = map_requirement_type("motivation", motivation)

        # currentSkill defaults to problemSolving for non-tech users
        currentSkill = problemSolving

        # Build quizResponses with ONLY API-accepted fields
        # NOTE: stepsTaken, codeComfort, timePerWeek, motivation are NOT in API model
        # These are used for derivation only, not sent to API
        quiz_responses = {
            "currentRole": currentBackground,  # Maps to currentRole in request
            "experience": experience,
            "targetRole": targetRole,
            "targetRoleLabel": quiz.get("targetRoleLabel", ""),
            "targetCompany": targetCompany,
            "targetCompanyLabel": targetCompanyLabel,
            # DERIVED/INFERRED fields (from non-tech quiz responses)
            "problemSolving": problemSolving,          # Derived from codeComfort
            "systemDesign": systemDesign,              # Hardcoded to 'not-yet'
            "portfolio": portfolio,                    # Inferred from problemSolving
            "mockInterviews": mockInterviews,          # Hardcoded to 'never'
            "requirementType": requirementType,        # Mapped from motivation
            "currentCompany": currentCompany,          # Hardcoded value
            "currentSkill": currentSkill,              # Defaults to problemSolving
        }

        payload = {
            "background": "non-tech",
            "quizResponses": quiz_responses,
            "goals": {
                "requirementType": [],  # Empty array in frontend
                "targetCompany": "Not specified",  # Default in frontend
                "topicOfInterest": []  # Empty array in frontend
            }
        }

    return payload


def make_api_request(payload: Dict[str, Any], api_url: str) -> tuple[bool, Any, float]:
    """
    Make API request to the backend.

    Returns:
        tuple: (success, response_data, response_time)
    """
    try:
        start_time = time.time()
        response = requests.post(
            api_url,
            json=payload,
            timeout=60,
            headers={"Content-Type": "application/json"}
        )
        response_time = time.time() - start_time

        if response.status_code == 200:
            return True, response.json(), response_time
        else:
            return False, {
                "error": f"HTTP {response.status_code}",
                "message": response.text
            }, response_time
    except requests.exceptions.RequestException as e:
        return False, {"error": str(e)}, 0


def validate_response_schema(response: Dict[str, Any]) -> tuple[bool, list]:
    """
    Validate that the API response has the expected structure.

    Returns:
        tuple: (is_valid, list_of_errors)
    """
    errors = []

    # Check top-level structure
    if "profile_evaluation" not in response:
        errors.append("Missing 'profile_evaluation' key in response")
        return False, errors

    pe = response["profile_evaluation"]

    # Required fields
    required_fields = [
        "profile_strength_score",
        "profile_strength_status",
        "current_profile",
        "skill_analysis",
        "interview_readiness",
        "peer_comparison",
        "success_likelihood",
        "quick_wins",
        "recommended_roles_based_on_interests",
    ]

    for field in required_fields:
        if field not in pe:
            errors.append(f"Missing required field: {field}")

    # Validate profile_strength_score
    if "profile_strength_score" in pe:
        score = pe["profile_strength_score"]
        if not isinstance(score, int) or score < 0 or score > 100:
            errors.append(f"Invalid profile_strength_score: {score} (should be 0-100)")

    # Validate interview_readiness
    if "interview_readiness" in pe:
        ir = pe["interview_readiness"]
        if "technical_interview_percent" not in ir:
            errors.append("Missing interview_readiness.technical_interview_percent")
        if "hr_behavioral_percent" not in ir:
            errors.append("Missing interview_readiness.hr_behavioral_percent")

    # Validate quick_wins (should have 3-5 items)
    if "quick_wins" in pe:
        qw = pe["quick_wins"]
        if not isinstance(qw, list):
            errors.append("quick_wins should be a list")
        elif len(qw) < 3 or len(qw) > 5:
            errors.append(f"quick_wins has {len(qw)} items (should be 3-5)")

    return len(errors) == 0, errors


# ============================================================================
# DISPLAY FUNCTIONS
# ============================================================================

def display_persona_info(persona_num: int, persona: Dict[str, Any]):
    """Display persona information before testing."""
    print_header(f"Persona #{persona_num}: {persona['name']}")
    print(f"{Colors.BOLD}Description:{Colors.ENDC} {persona['description']}")
    print(f"{Colors.BOLD}Background:{Colors.ENDC} {persona['background'].upper()}")

    print_subheader("Quiz Responses")
    for key, value in persona["quiz_responses"].items():
        print(f"  {key:.<35} {value}")


def display_api_response(response: Dict[str, Any]):
    """Display the full API response in a readable format."""
    print_subheader("API Response: Profile Evaluation")

    pe = response.get("profile_evaluation", {})

    # Profile Strength
    print(f"\n{Colors.BOLD}Profile Strength:{Colors.ENDC}")
    print(f"  Score: {pe.get('profile_strength_score')}% - {pe.get('profile_strength_status')}")
    print(f"  Notes: {pe.get('profile_strength_notes', 'N/A')}")

    # Current Profile
    print(f"\n{Colors.BOLD}Current Profile:{Colors.ENDC}")
    cp = pe.get("current_profile", {})
    print(f"  Title: {cp.get('title', 'N/A')}")
    print(f"  Summary: {cp.get('summary', 'N/A')[:150]}...")

    # Skill Analysis
    print(f"\n{Colors.BOLD}Skill Analysis:{Colors.ENDC}")
    sa = pe.get("skill_analysis", {})
    print(f"  Strengths:")
    for strength in sa.get("strengths", [])[:3]:
        print(f"    • {strength}")
    print(f"  Areas to Develop:")
    for area in sa.get("areas_to_develop", [])[:3]:
        print(f"    • {area}")

    # Interview Readiness
    print(f"\n{Colors.BOLD}Interview Readiness:{Colors.ENDC}")
    ir = pe.get("interview_readiness", {})
    print(f"  Technical: {ir.get('technical_interview_percent')}%")
    print(f"  HR/Behavioral: {ir.get('hr_behavioral_percent')}%")
    print(f"  Notes: {ir.get('technical_notes', 'N/A')[:150]}...")

    # Peer Comparison
    print(f"\n{Colors.BOLD}Peer Comparison:{Colors.ENDC}")
    pc = pe.get("peer_comparison", {})
    print(f"  Percentile: {pc.get('percentile')}% ({pc.get('label', 'N/A')})")
    print(f"  Description: {pc.get('peer_group_description', 'N/A')[:100]}...")

    # Success Likelihood
    print(f"\n{Colors.BOLD}Success Likelihood:{Colors.ENDC}")
    sl = pe.get("success_likelihood", {})
    print(f"  Score: {sl.get('score_percent')}% - {sl.get('status')}")
    print(f"  Label: {sl.get('label')}")

    # Quick Wins
    print(f"\n{Colors.BOLD}Quick Wins (Top 3):{Colors.ENDC}")
    for i, qw in enumerate(pe.get("quick_wins", [])[:3], 1):
        print(f"  {i}. {qw.get('title')}")
        print(f"     {qw.get('description', 'N/A')[:100]}...")

    # Opportunities
    print(f"\n{Colors.BOLD}Job Opportunities (Top 3):{Colors.ENDC}")
    for i, opp in enumerate(pe.get("opportunities_you_qualify_for", [])[:3], 1):
        print(f"  {i}. {opp}")

    # Recommended Roles
    print(f"\n{Colors.BOLD}Recommended Roles:{Colors.ENDC}")
    for role in pe.get("recommended_roles_based_on_interests", []):
        timeline = f"{role.get('min_months', 0)}-{role.get('max_months', 0)} months"
        print(f"  • {role.get('title')} ({role.get('seniority')})")
        print(f"    Timeline: {timeline}")
        print(f"    Key Gap: {role.get('key_gap')}")


def display_test_results(
    persona_num: int,
    persona: Dict[str, Any],
    response_time: float,
    is_valid: bool,
    validation_errors: list,
    response: Dict[str, Any]
):
    """Display test results and validation."""
    print_subheader("Test Results")

    # API Response Time
    print(f"Response Time: {response_time:.2f}s")
    if response_time > 30:
        print_warning("Response time is quite high (> 30s)")
    else:
        print_success("Response time is acceptable")

    # Schema Validation
    if is_valid:
        print_success("Response schema validation PASSED")
    else:
        print_error("Response schema validation FAILED")
        for error in validation_errors:
            print_error(f"  - {error}")

    # Interview Readiness Check
    if "profile_evaluation" in response:
        pe = response["profile_evaluation"]
        ir_score = pe.get("interview_readiness", {}).get("technical_interview_percent", 0)
        expected_min, expected_max = persona["expected_interview_readiness"]

        print(f"\nInterview Readiness:")
        print(f"  Actual: {ir_score}%")
        print(f"  Expected Range: {expected_min}-{expected_max}%")

        if expected_min <= ir_score <= expected_max:
            print_success("Interview readiness is within expected range")
        else:
            print_warning(f"Interview readiness is outside expected range")


def display_summary_table(results: Dict[int, Dict[str, Any]]):
    """Display a summary table of all test results."""
    print_header("Test Summary")

    print(f"{'#':<3} {'Persona':<35} {'IR%':<6} {'Response':<12} {'Valid':<8}")
    print("-" * 70)

    for persona_num in sorted(results.keys()):
        result = results[persona_num]
        persona = PERSONAS[persona_num]

        # Handle missing response key
        if "response" not in result:
            ir_score = "ERROR"
            response_time = "N/A"
            is_valid = "✗"
        else:
            ir_score = result["response"].get("profile_evaluation", {}).get(
                "interview_readiness", {}
            ).get("technical_interview_percent", "?")
            response_time = f"{result.get('response_time', 0):.2f}s"
            is_valid = "✓" if result.get("is_valid", False) else "✗"

        print(f"{persona_num:<3} {persona['name']:<35} {ir_score:<6} {response_time:<12} {is_valid:<8}")


# ============================================================================
# MAIN EXECUTION
# ============================================================================

def test_single_persona(
    persona_num: int,
    api_url: str = "http://localhost:8000/career-profile-tool/api/evaluate"
) -> tuple[bool, Dict[str, Any]]:
    """
    Test a single persona.

    Returns:
        tuple: (success, result_dict)
    """
    if persona_num not in PERSONAS:
        print_error(f"Persona {persona_num} not found (valid: 1-12)")
        return False, {}

    persona = PERSONAS[persona_num]

    # Display persona info
    display_persona_info(persona_num, persona)

    # Build request
    print_subheader("Building Request (Applying Frontend Transformations)")
    payload = build_request_payload(persona)
    print_success("Request payload built successfully")
    print(f"  Background: {payload['background']}")
    print(f"  Fields: {len(payload['quizResponses'])} quiz responses")

    # Show transformations applied
    if persona["background"] == "non-tech":
        print_info("\n  Frontend Transformations Applied:")
        code_comfort = persona["quiz_responses"]["codeComfort"]
        problem_solving = derive_problem_solving_from_code_comfort(code_comfort)
        portfolio = infer_portfolio_from_problem_solving(problem_solving)
        print(f"    • codeComfort '{code_comfort}' → problemSolving '{problem_solving}'")
        print(f"    • problemSolving '{problem_solving}' → portfolio '{portfolio}'")
        print(f"    • systemDesign hardcoded → 'not-yet'")
        print(f"    • mockInterviews hardcoded → 'never'")
        print(f"    • currentCompany hardcoded → 'Transitioning from non-tech background'")
        motivation = persona["quiz_responses"]["motivation"]
        print(f"    • motivation '{motivation}' → requirementType '{motivation}'")
    else:
        print_info("\n  Frontend Transformations Applied:")
        primary_goal = persona["quiz_responses"]["primaryGoal"]
        print(f"    • primaryGoal '{primary_goal}' → requirementType '{primary_goal}'")
        print(f"    • mockInterviews hardcoded → 'never'")
        print(f"    • Label fields preserved (currentRole, targetRole, targetCompany)")

    # Make API request
    print_subheader("Calling Backend API")
    print_info(f"Endpoint: {api_url}")

    success, response_data, response_time = make_api_request(payload, api_url)

    if not success:
        print_error(f"API request failed: {response_data.get('error')}")
        return False, {
            "persona_num": persona_num,
            "persona_name": persona["name"],
            "success": False,
            "error": response_data.get("error"),
            "response_time": response_time,
        }

    print_success(f"API request successful ({response_time:.2f}s)")

    # Validate response schema
    is_valid, validation_errors = validate_response_schema(response_data)

    # Display results
    display_api_response(response_data)
    display_test_results(persona_num, persona, response_time, is_valid, validation_errors, response_data)

    return True, {
        "persona_num": persona_num,
        "persona_name": persona["name"],
        "success": True,
        "response": response_data,
        "response_time": response_time,
        "is_valid": is_valid,
        "validation_errors": validation_errors,
    }


def main():
    """Main entry point."""
    if len(sys.argv) > 1:
        arg = sys.argv[1]

        if arg in ["--help", "-h"]:
            print(__doc__)
            return

        if arg.lower() == "all":
            print_header("Testing All 12 Personas")
            results = {}

            for persona_num in range(1, 13):
                print(f"\n{Colors.BOLD}Testing Persona {persona_num}/12...{Colors.ENDC}\n")
                success, result = test_single_persona(persona_num)
                results[persona_num] = result

                # Add delay between requests to avoid rate limiting
                time.sleep(2)

            # Display summary
            display_summary_table(results)

            # Summary statistics
            print_subheader("Summary Statistics")
            total = len(results)
            successful = sum(1 for r in results.values() if r.get("success"))
            valid = sum(1 for r in results.values() if r.get("is_valid"))

            print(f"Total Personas: {total}")
            print(f"Successful Requests: {successful}/{total}")
            print(f"Valid Responses: {valid}/{total}")

            if successful == total:
                print_success("All tests completed successfully!")

            return

        try:
            persona_num = int(arg)
            test_single_persona(persona_num)
        except ValueError:
            print_error(f"Invalid argument: {arg}")
            print_info("Usage: python test_personas_comprehensive.py <1-12|all|--help>")
    else:
        # Test persona 1 by default
        print_info("No persona specified, testing Persona 1 (Tech-Junior-Backend)")
        print_info("Usage: python test_personas_comprehensive.py <1-12|all|--help>\n")
        test_single_persona(1)


if __name__ == "__main__":
    main()
