from typing import Dict, List, Tuple, Any


def _calculate_coding_gap_months(problem_solving: str, target_level: str) -> int:
    requirements = {
        "junior": "51-100",
        "mid": "100+",
        "senior": "100+",
    }

    required = requirements.get(target_level, "51-100")

    current_score = {"0-10": 0, "11-50": 1, "51-100": 2, "100+": 3}.get(problem_solving, 0)
    required_score = {"0-10": 0, "11-50": 1, "51-100": 2, "100+": 3}.get(required, 2)

    gap = required_score - current_score

    if gap <= 0:
        return 0

    if gap == 1:
        return 2
    elif gap == 2:
        return 3
    elif gap == 3:
        return 4

    return 0


def _calculate_system_design_gap_months(system_design: str, target_level: str) -> int:
    if target_level == "junior":
        return 0

    requirements = {
        "mid": "once",
        "senior": "multiple"
    }

    required = requirements.get(target_level, "once")

    current_score = {"not-yet": 0, "learning": 0, "once": 1, "multiple": 2}.get(system_design, 0)
    required_score = {"not-yet": 0, "learning": 0, "once": 1, "multiple": 2}.get(required, 1)

    gap = required_score - current_score

    if gap <= 0:
        return 0

    if gap == 1:
        return 3
    elif gap == 2:
        return 5

    return 0


def _calculate_portfolio_gap_months(portfolio: str, target_level: str) -> int:
    requirements = {
        "junior": "limited-1-5",
        "mid": "limited-1-5",
        "senior": "active-5+",
    }

    required = requirements.get(target_level, "limited-1-5")

    current_score = {"none": 0, "inactive": 1, "limited-1-5": 2, "active-5+": 3}.get(portfolio, 0)
    required_score = {"none": 0, "inactive": 1, "limited-1-5": 2, "active-5+": 3}.get(required, 2)

    gap = required_score - current_score

    if gap <= 0:
        return 0

    if gap == 1:
        return 4
    elif gap == 2:
        return 6
    elif gap == 3:
        return 8

    return 0


def _determine_target_level(target_role: str) -> str:
    role_lower = target_role.lower()

    if any(keyword in role_lower for keyword in ["senior", "lead", "staff", "principal", "architect"]):
        return "senior"
    if any(keyword in role_lower for keyword in ["sde-2", "sde2", "mid-level", "mid level", "engineer ii"]):
        return "mid"

    if any(keyword in role_lower for keyword in ["engineer", "developer", "programmer"]) and "junior" not in role_lower:
        return "mid"

    if any(keyword in role_lower for keyword in ["junior", "entry", "associate", "graduate", "intern", "sde-1", "sde1"]):
        return "junior"

    return "mid"


def _identify_key_gap(coding_gap: int, sd_gap: int, portfolio_gap: int) -> str:
    gaps = {
        "coding": coding_gap,
        "system_design": sd_gap,
        "portfolio": portfolio_gap
    }

    max_gap_area = max(gaps, key=gaps.get)
    max_gap_months = gaps[max_gap_area]

    if max_gap_months == 0:
        return "Interview preparation and behavioral practice"

    gap_messages = {
        "coding": "Problem-solving practice needed",
        "system_design": "System design expertise required",
        "portfolio": "Build portfolio projects"
    }

    return gap_messages.get(max_gap_area, "Skill development needed")


def _generate_milestones(
    coding_gap: int,
    sd_gap: int,
    portfolio_gap: int,
    total_months: int,
    target_role: str = "",
    quiz_responses: Dict[str, Any] = None
) -> List[str]:
    milestones = []

    current_problem_solving = "0-10"
    target_company = ""
    if quiz_responses:
        current_problem_solving = quiz_responses.get("problemSolving", "0-10")
        target_company = quiz_responses.get("targetCompany", "")

    role_lower = target_role.lower()
    role_focus = ""
    role_projects = ""

    if "backend" in role_lower or "api" in role_lower:
        role_focus = "REST APIs and database optimization"
        role_projects = "API-based projects (e.g., REST API, microservices)"
    elif "frontend" in role_lower or "react" in role_lower or "angular" in role_lower or "vue" in role_lower:
        role_focus = "React/Vue components and responsive design"
        role_projects = "frontend projects (e.g., dashboard, SPA)"
    elif "fullstack" in role_lower or "full-stack" in role_lower or "full stack" in role_lower:
        role_focus = "full-stack development (MERN/MEAN stack)"
        role_projects = "end-to-end projects (frontend + backend + deployment)"
    elif "mobile" in role_lower or "android" in role_lower or "ios" in role_lower:
        role_focus = "mobile app development (React Native/Flutter)"
        role_projects = "mobile apps with native features"
    elif "devops" in role_lower or "sre" in role_lower or "cloud" in role_lower:
        role_focus = "CI/CD pipelines and infrastructure automation"
        role_projects = "DevOps projects (Docker, Kubernetes, CI/CD)"
    elif "data" in role_lower or "ml" in role_lower or "ai" in role_lower:
        role_focus = "data pipelines and ML model development"
        role_projects = "data/ML projects (ETL, model training, deployment)"
    else:
        role_focus = "software development fundamentals"
        role_projects = "production-quality projects"

    if coding_gap > 0:
        if current_problem_solving == "0-10":
            if coding_gap <= 2:
                milestones.append(f"Month 1-{coding_gap}: Build coding foundation (solve 50-100 problems)")
            else:
                milestones.append(f"Month 1-{coding_gap}: Master coding fundamentals (reach 100+ problems)")
        elif current_problem_solving == "11-50":
            if coding_gap <= 2:
                milestones.append(f"Month 1-{coding_gap}: Strengthen problem-solving (reach 50-100 problems)")
            else:
                milestones.append(f"Month 1-{coding_gap}: Build strong foundation (reach 100+ problems)")
        elif current_problem_solving == "51-100":
            milestones.append(f"Month 1-{coding_gap}: Master ADVANCED patterns (solve 100+ problems)")
        else:
            milestones.append(f"Month 1-{coding_gap}: Maintain sharp problem-solving (focus on hard problems)")

    current_month = coding_gap + 1

    if portfolio_gap > 0 and sd_gap > 0:
        overlap_months = max(portfolio_gap, sd_gap)
        milestones.append(
            f"Month {current_month}-{current_month + overlap_months - 1}: "
            f"Build {2 if portfolio_gap <= 2 else 3} {role_projects} + Learn system design patterns"
        )
        current_month += overlap_months
    elif portfolio_gap > 0:
        milestones.append(
            f"Month {current_month}-{current_month + portfolio_gap - 1}: "
            f"Build {2 if portfolio_gap <= 2 else '3-5'} {role_projects}"
        )
        current_month += portfolio_gap
    elif sd_gap > 0:
        milestones.append(
            f"Month {current_month}-{current_month + sd_gap - 1}: "
            f"Master system design focused on {role_focus}"
        )
        current_month += sd_gap

    from src.utils.label_mappings import get_company_label
    company_context = ""
    if target_company:
        company_label = get_company_label(target_company)
        if target_company in ["faang", "big-tech"]:
            company_context = f" for {company_label}"
        elif target_company in ["unicorns", "product"]:
            company_context = f" for product companies"
        elif target_company == "startups":
            company_context = f" for high-growth startups"
        elif target_company == "service":
            company_context = f" for service companies"

    if total_months > current_month:
        milestones.append(f"Month {current_month}-{total_months}: Practice {role_focus} interview questions{company_context} + mock interviews")
    elif coding_gap == 0 and sd_gap == 0 and portfolio_gap == 0:
        milestones.append(f"Month 1-2: Interview prep focusing on {role_focus}{company_context} + company research")

    return milestones


def calculate_timeline_to_role(
    target_role: str,
    quiz_responses: Dict[str, Any]
) -> Dict[str, Any]:
    target_level = _determine_target_level(target_role)

    problem_solving = quiz_responses.get("problemSolving", "0-10")
    system_design = quiz_responses.get("systemDesign", "not-yet")
    portfolio = quiz_responses.get("portfolio", "none")
    experience = quiz_responses.get("experience", "0-2")

    coding_gap_months = _calculate_coding_gap_months(problem_solving, target_level)
    sd_gap_months = _calculate_system_design_gap_months(system_design, target_level)
    portfolio_gap_months = _calculate_portfolio_gap_months(portfolio, target_level)

    base_months = coding_gap_months

    if sd_gap_months > 0 and portfolio_gap_months > 0:
        base_months += max(sd_gap_months, portfolio_gap_months)
    else:
        base_months += sd_gap_months + portfolio_gap_months

    base_months += 1

    experience_multiplier = {
        "0": 1.3,
        "0-2": 1.1,
        "3-5": 1.0,
        "5-8": 0.9,
        "8+": 0.85
    }.get(experience, 1.0)

    target_company = quiz_responses.get("targetCompany", "")
    company_multiplier = {
        "faang": 1.5,
        "big-tech": 1.5,
        "unicorns": 1.3,
        "product": 1.2,
        "startups": 1.0,
        "service": 0.8,
    }.get(target_company, 1.0)

    adjusted_months = int(base_months * experience_multiplier * company_multiplier)

    adjusted_months = max(2, min(12, adjusted_months))

    min_months = max(2, adjusted_months - 1)
    max_months = min(12, adjusted_months + 1)

    total_gaps = coding_gap_months + sd_gap_months + portfolio_gap_months
    if total_gaps == 0:
        confidence = "high"
    elif total_gaps <= 4:
        confidence = "high"
    elif total_gaps <= 6:
        confidence = "medium"
    else:
        confidence = "medium"

    key_gap = _identify_key_gap(coding_gap_months, sd_gap_months, portfolio_gap_months)

    milestones = _generate_milestones(
        coding_gap_months,
        sd_gap_months,
        portfolio_gap_months,
        max_months,
        target_role,
        quiz_responses
    )

    if min_months == max_months:
        timeline_text = f"{min_months} months"
    else:
        timeline_text = f"{min_months}-{max_months} months"

    return {
        "min_months": min_months,
        "max_months": max_months,
        "timeline_text": timeline_text,
        "confidence": confidence,
        "key_gap": key_gap,
        "milestones": milestones
    }


def calculate_alternative_paths(
    quiz_responses: Dict[str, Any],
    target_role: str
) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    target_level = _determine_target_level(target_role)
    experience = quiz_responses.get("experience", "0-2")

    if target_level == "senior":
        faster_role = "Mid-Level Software Engineer"
        faster_timeline = calculate_timeline_to_role(faster_role, quiz_responses)
        faster_timeline["min_months"] = max(2, faster_timeline["min_months"] - 2)
        faster_timeline["max_months"] = max(3, faster_timeline["max_months"] - 2)
        faster_timeline["timeline_text"] = f"{faster_timeline['min_months']}-{faster_timeline['max_months']} months"
        faster_timeline["role_name"] = faster_role
    elif target_level == "mid":
        faster_role = "Junior Software Engineer"
        faster_timeline = calculate_timeline_to_role(faster_role, quiz_responses)
        faster_timeline["min_months"] = max(2, faster_timeline["min_months"] - 1)
        faster_timeline["max_months"] = max(3, faster_timeline["max_months"] - 1)
        faster_timeline["timeline_text"] = f"{faster_timeline['min_months']}-{faster_timeline['max_months']} months"
        faster_timeline["role_name"] = faster_role
    else:
        faster_role = "Software Engineer Intern"
        faster_timeline = {
            "min_months": 2,
            "max_months": 3,
            "timeline_text": "2-3 months",
            "confidence": "high",
            "key_gap": "Build coding fundamentals",
            "milestones": [
                "Month 1-2: Complete 50 coding problems",
                "Month 3: Build 1-2 projects + Apply for internships"
            ],
            "role_name": faster_role
        }

    role_lower = target_role.lower()

    if "backend" in role_lower or "api" in role_lower:
        alt_role = f"Full-Stack Engineer" if target_level == "mid" else f"{target_level.title()} Full-Stack Engineer"
    elif "frontend" in role_lower or "react" in role_lower:
        alt_role = f"Full-Stack Engineer" if target_level == "mid" else f"{target_level.title()} Full-Stack Engineer"
    elif "fullstack" in role_lower or "full-stack" in role_lower:
        alt_role = f"Backend Engineer" if target_level == "mid" else f"{target_level.title()} Backend Engineer"
    elif "devops" in role_lower or "sre" in role_lower:
        alt_role = f"Backend Engineer" if target_level == "mid" else f"{target_level.title()} Backend Engineer"
    elif "mobile" in role_lower or "android" in role_lower or "ios" in role_lower:
        alt_role = f"Full-Stack Engineer" if target_level == "mid" else f"{target_level.title()} Full-Stack Engineer"
    else:
        alt_role = f"Full-Stack Engineer" if target_level == "mid" else f"{target_level.title()} Full-Stack Engineer"

    alternative_timeline = calculate_timeline_to_role(target_role, quiz_responses)
    alternative_timeline["min_months"] = max(2, alternative_timeline["min_months"] - 1)
    alternative_timeline["max_months"] = max(3, alternative_timeline["max_months"])
    alternative_timeline["timeline_text"] = f"{alternative_timeline['min_months']}-{alternative_timeline['max_months']} months"
    alternative_timeline["role_name"] = alt_role
    alternative_timeline["key_gap"] = "Learn additional tech stack"

    return faster_timeline, alternative_timeline