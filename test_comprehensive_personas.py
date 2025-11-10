#!/usr/bin/env python3
"""
COMPREHENSIVE PERSONA TESTING
================================
Tests complete input → output flow for each persona.
Shows ALL user inputs and ALL API outputs to verify options are respected.

Test persona-by-persona to avoid overwhelming OpenAI API.
"""

import requests
import json
import time
from datetime import datetime

BASE_URL = "http://localhost:8000/career-profile-tool/api"

# Define test personas with descriptive names
PERSONAS = {
    "persona_1": {
        "name": "Non-Tech Beginner (0-2 yrs, Career Exploration)",
        "description": "Completely new to tech, exploring bootcamp option",
        "background": "non-tech",
        "inputs": {
            "currentRole": "exploring",
            "experience": "0-2",
            "targetRole": "backend",
            "problemSolving": "0-50",
            "systemDesign": "not-yet",
            "portfolio": "exploring",
            "mockInterviews": "not-done",
            "currentCompany": "education",
            "currentSkill": "0-50",
            "requirementType": "starting-out",
            "targetCompany": "startup",
        }
    },
    "persona_2": {
        "name": "Non-Tech Mid (3-5 yrs, Data Analytics focus)",
        "description": "Operations/Analytics background, targeting data roles",
        "background": "non-tech",
        "inputs": {
            "currentRole": "qa",
            "experience": "3-5",
            "targetRole": "data-analytics",
            "problemSolving": "11-50",
            "systemDesign": "not-yet",
            "portfolio": "limited",
            "mockInterviews": "not-done",
            "currentCompany": "microsoft",
            "currentSkill": "11-50",
            "requirementType": "transition",
            "targetCompany": "faang",
        }
    },
    "persona_6": {
        "name": "Tech Mid (3-5 yrs, DevOps → SRE)",
        "description": "DevOps engineer looking to transition to SRE role",
        "background": "tech",
        "inputs": {
            "currentRole": "devops",
            "experience": "3-5",
            "targetRole": "devops-sre",
            "problemSolving": "51-100",
            "systemDesign": "once",
            "portfolio": "active-5+",
            "mockInterviews": "weekly",
            "currentCompany": "amazon",
            "currentSkill": "51-100",
            "requirementType": "level-up",
            "targetCompany": "faang",
        }
    },
    "persona_7": {
        "name": "Tech Senior (5-8 yrs, Backend → Staff Engineer)",
        "description": "Senior backend engineer targeting Staff/Principal roles",
        "background": "tech",
        "inputs": {
            "currentRole": "backend-swe",
            "experience": "5-8",
            "targetRole": "staff-engineer",
            "problemSolving": "51-100",
            "systemDesign": "regularly",
            "portfolio": "active-100+",
            "mockInterviews": "regularly",
            "currentCompany": "google",
            "currentSkill": "100+",
            "requirementType": "advancement",
            "targetCompany": "faang",
        }
    },
}

def check_health():
    """Verify API is healthy"""
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        return response.status_code == 200
    except:
        return False

def format_section(title):
    """Format a section header"""
    return f"\n{'='*80}\n{title}\n{'='*80}"

def format_subsection(title):
    """Format a subsection header"""
    return f"\n{title}\n{'-'*len(title)}"

def test_persona(persona_key, persona_data):
    """Test a single persona and show complete output"""

    print(format_section(f"🧑 {persona_data['name']}"))
    print(f"Description: {persona_data['description']}\n")

    # ========== SHOW USER INPUTS ==========
    print(format_subsection("📥 USER INPUT OPTIONS"))
    inputs = persona_data['inputs'].copy()
    for key, value in inputs.items():
        print(f"   {key:20} = {value}")

    # ========== PREPARE REQUEST ==========
    payload = {
        "background": persona_data["background"],
        "quizResponses": inputs,
        "goals": {
            "requirementType": [inputs.get("requirementType", "advancement")],
            "targetCompany": inputs.get("targetCompany", "faang"),
            "topicOfInterest": ["career-growth", "skill-development"]
        }
    }

    # ========== SEND REQUEST ==========
    print(format_subsection("⏳ Calling API..."))
    print(f"   Request timestamp: {datetime.now().isoformat()}\n")

    try:
        response = requests.post(
            f"{BASE_URL}/evaluate",
            json=payload,
            timeout=120
        )

        if response.status_code != 200:
            print(f"   ❌ API Error: {response.status_code}")
            print(f"   {response.text}")
            return False

        data = response.json()
        evaluation = data.get("profile_evaluation", {})

        # ========== SHOW SCORES ==========
        print(format_subsection("📊 ASSESSMENT SCORES"))

        # Profile Strength
        profile_strength = evaluation.get('profile_strength_score', 'N/A')
        print(f"   Profile Strength Score:      {profile_strength}%")

        # Interview Readiness (nested in interview_readiness object)
        interview_readiness = evaluation.get('interview_readiness', {})
        tech_readiness = interview_readiness.get('technical_interview_percent', 'N/A')
        hr_readiness = interview_readiness.get('hr_behavioral_percent', 'N/A')
        print(f"   Technical Interview Score:   {tech_readiness}%")
        print(f"   HR/Behavioral Score:         {hr_readiness}%")

        # Peer Comparison
        peer_comp = evaluation.get('peer_comparison', {})
        peer_metrics = peer_comp.get('metrics', {})
        peer_strength = peer_metrics.get('profile_strength_percent', 'N/A')
        print(f"   Peer Comparison Strength:    {peer_strength}%")

        # ========== SHOW CAREER TIMELINE ==========
        print(format_subsection("📅 CAREER TIMELINE"))
        timeline = evaluation.get('timeline_to_goal', {})
        if timeline:
            print(f"   Total Timeline:              {timeline.get('total_timeline_months_text', 'N/A')}")
            print(f"   Min Months:                  {timeline.get('min_months_total', 'N/A')}")
            print(f"   Max Months:                  {timeline.get('max_months_total', 'N/A')}")
            print(f"   Key Milestones:")
            for milestone in timeline.get('key_milestones', []):
                print(f"      • {milestone}")

        # ========== SHOW RECOMMENDED ROLES (WITH FILTERING) ==========
        print(format_subsection("🎯 TOP 3 RECOMMENDED ROLES (With Filtering Applied)"))
        roles = evaluation.get('recommended_roles_based_on_interests', [])

        if not roles:
            print("   ⚠️  No roles recommended")
        else:
            for i, role in enumerate(roles[:3], 1):  # Only show top 3
                title = role.get('title', 'N/A')
                seniority = role.get('seniority', 'N/A')
                timeline = role.get('timeline_text', 'N/A')
                gap = role.get('key_gap', 'N/A')

                print(f"\n   {i}. {title} ({seniority})")
                print(f"      Timeline: {timeline}")
                print(f"      Key Gap:  {gap}")

        # ========== SHOW QUICK WINS ==========
        print(format_subsection("⚡ QUICK WINS"))
        quick_wins = evaluation.get('quick_wins', [])
        if quick_wins:
            for win in quick_wins[:3]:  # Show top 3
                print(f"   • {win}")

        # ========== VERIFY ROLE FILTERING ==========
        print(format_subsection("✅ ROLE FILTERING VERIFICATION"))

        target_role = inputs.get('targetRole', '').lower()
        current_role = inputs.get('currentRole', '').lower()
        experience = inputs.get('experience', '')

        if roles:
            top_role_title = roles[0].get('title', '').lower()

            # Check if target role is prioritized
            if target_role and target_role in top_role_title:
                print(f"   ✅ TARGET ROLE RESPECTED: '{target_role}' found in top recommendation")
            elif target_role:
                print(f"   ℹ️  Target role '{target_role}' not in top role, but recommendations may include it")

            # Check if current role is considered
            if current_role and current_role in top_role_title:
                print(f"   ✅ CURRENT ROLE CONSIDERED: '{current_role}' present in recommendations")

            # Check experience level alignment
            if experience and "8+" in experience:
                seniority = roles[0].get('seniority', '').lower()
                if any(x in seniority for x in ['staff', 'principal', 'senior', 'director']):
                    print(f"   ✅ EXPERIENCE LEVEL RESPECTED: Senior experience aligned with senior roles")

        print(f"\n   ✅ Test completed successfully\n")
        return True

    except Exception as e:
        print(f"   ❌ Error: {str(e)}\n")
        return False

def main():
    print("\n" + "="*80)
    print("🧪 COMPREHENSIVE PERSONA TESTING")
    print("="*80)
    print("Testing complete input → output flow for each persona")
    print("Each test shows user inputs and all API outputs\n")

    # Check API health first
    print("⏳ Checking API health...")
    if not check_health():
        print("❌ API is not healthy. Please ensure Docker containers are running.")
        return False
    print("✅ API is healthy\n")

    results = {}

    # Test personas one at a time
    for persona_key in ["persona_1", "persona_2", "persona_6", "persona_7"]:
        if persona_key not in PERSONAS:
            continue

        persona_data = PERSONAS[persona_key]
        success = test_persona(persona_key, persona_data)
        results[persona_key] = success

        # Wait between tests to avoid overwhelming API
        if persona_key != "persona_7":
            print("⏳ Waiting 3 seconds before next test...\n")
            time.sleep(3)

    # ========== FINAL SUMMARY ==========
    print(format_section("📋 TEST SUMMARY"))
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    print(f"\n✅ Passed: {passed}/{total}\n")

    for persona_key, success in results.items():
        status = "✅" if success else "❌"
        name = PERSONAS[persona_key]['name']
        print(f"   {status} {name}")

    print("\n" + "="*80)

if __name__ == "__main__":
    main()
