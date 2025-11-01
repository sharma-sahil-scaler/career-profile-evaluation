from typing import Any, Dict, List
import hashlib
from src.utils.label_mappings import format_job_title, get_role_label, get_company_label


def _get_seniority_level(quiz_responses: Dict[str, Any]) -> str:
    experience = quiz_responses.get("experience", "0-2")
    problem_solving = quiz_responses.get("problemSolving", "0-10")
    system_design = quiz_responses.get("systemDesign", "not-yet")
    portfolio = quiz_responses.get("portfolio", "none")
    current_role = quiz_responses.get("currentRole", "")

    if experience in ["5-8", "8+"] and system_design == "multiple":
        return "staff"
    if experience in ["5-8", "8+"]:
        return "senior"

    if experience == "3-5":
        experience_signals = 0
        if problem_solving in ["51-100", "100+"]: experience_signals += 2
        if system_design in ["once", "multiple"]: experience_signals += 2
        if portfolio in ["active-5+", "limited-1-5"]: experience_signals += 1
        if current_role in ["swe-product", "devops"]: experience_signals += 1
        if experience_signals >= 3:
            return "senior"

    if experience == "3-5":
        if (problem_solving == "0-10" and
            portfolio == "none" and
            current_role == "swe-service"):
            return "junior"

        return "mid"
    return "junior"


JOB_TEMPLATES = {
    "backend_junior": [
        "Java/Python, REST APIs, SQL, strong DSA fundamentals",
        "Go/Python, microservices basics, distributed systems interest",
        "Node.js or Java, API design, testing, debugging skills",
    ],
    "backend_mid": [
        "Microservices, Kafka, Redis, 3+ years production experience",
        "System design knowledge, database optimization, API scaling",
        "Distributed systems, event-driven architecture, mentoring juniors",
    ],
    "backend_senior": [
        "Microservices at scale, trade-off analysis, architecture decisions",
        "High-throughput systems, cross-team collaboration, technical leadership",
        "System architecture, 10M+ scale, strategic technical direction",
    ],

    "fullstack_junior": [
        "React + Node.js, REST APIs, SQL, strong fundamentals",
        "JavaScript/TypeScript, frontend + backend, testing, cloud basics",
        "MERN or Django + React, API design, deployment",
    ],
    "fullstack_mid": [
        "React + Node.js, system design, 3+ years production",
        "End-to-end ownership, microservices, database optimization",
        "Architecture decisions, scalability, mentor juniors, cloud platforms",
    ],
    "fullstack_senior": [
        "Technical leadership, architecture, cross-team projects, 5+ years",
        "Frontend + backend at scale, strategic decisions, org impact",
        "Full-stack architecture, mentoring, performance optimization expertise",
    ],

    "frontend_junior": [
        "React, JavaScript, CSS, API integration, testing",
        "React/Vue, responsive design, REST APIs, version control",
        "HTML/CSS/JavaScript, React basics, mobile-first design",
    ],
    "frontend_mid": [
        "React + TypeScript, state management, performance optimization",
        "Component architecture, testing, accessibility, 3+ years",
        "React, Next.js, GraphQL, cross-browser compatibility",
    ],
    "frontend_senior": [
        "Frontend architecture, design systems, technical leadership",
        "React ecosystem, performance, mentor engineers, strategic decisions",
        "UI architecture, scalability, cross-team impact, 5+ years",
    ],

    "data_junior": [
        "Python, SQL, Airflow, data pipelines, ETL basics",
        "Python, Pandas, scikit-learn, model deployment basics",
        "SQL, Python, data visualization, business insights",
    ],
    "data_mid": [
        "Spark, Airflow, data lakes, 3+ years experience",
        "PyTorch/TensorFlow, MLOps, model deployment, scaling",
        "Python, ML models, A/B testing, production deployments",
    ],
    "data_senior": [
        "Data architecture, large-scale pipelines, technical leadership",
        "ML systems, model optimization, cross-functional leadership",
        "Data strategy, ML infrastructure, org-wide impact",
    ],

    "devops_junior": [
        "AWS/GCP, Docker, CI/CD, Linux, scripting",
        "Kubernetes, monitoring, incident response, automation",
        "AWS services, infrastructure as code, basic networking",
    ],
    "devops_mid": [
        "Kubernetes, Terraform, monitoring, 3+ years production",
        "Site reliability, incident management, automation, on-call",
        "AWS/GCP/Azure, infrastructure design, cost optimization",
    ],
    "devops_senior": [
        "Platform engineering, reliability, technical leadership, 5+ years",
        "Cloud infrastructure, team mentoring, strategic planning",
        "Infrastructure architecture, cross-team impact, org strategy",
    ],

    "tech_lead": [
        "Technical direction, architecture, team mentoring, delivery",
        "Team leadership, project planning, technical decisions, hiring",
        "Technical strategy, cross-team collaboration, architecture",
    ],

    "architect": [
        "System design, scalability, cloud architecture, technical consulting",
        "Enterprise architecture, strategic planning, org-wide impact",
        "Distributed systems, technical roadmaps, architecture reviews",
    ],
}


def _get_tech_stack_from_profile(quiz_responses: Dict[str, Any]) -> str:
    current_skill = quiz_responses.get("currentSkill", "")
    target_role = quiz_responses.get("targetRole", "")

    if current_skill in ["backend", "database"]:
        return "backend"
    elif current_skill in ["frontend", "web"]:
        return "frontend"
    elif current_skill == "fullstack":
        return "fullstack"
    elif current_skill in ["system-design"]:
        return "architecture"
    elif current_skill in ["cloud", "containers", "cicd", "iac"]:
        return "devops"
    elif target_role in ["data-ml", "data-engineer"]:
        return "data"

    if target_role in ["backend-sde", "backend", "backend-dev", "backend-fullstack", "senior-backend"]:
        return "backend"
    elif target_role in ["fullstack-sde", "fullstack", "fullstack-dev", "senior-fullstack"]:
        return "fullstack"
    elif target_role in ["data-ml", "data-engineer"]:
        return "data"
    elif target_role in ["tech-lead"]:
        return "architecture"

    return "fullstack"


def _get_template_key(tech_stack: str, seniority: str) -> str:
    template_seniority = "senior" if seniority == "staff" else seniority

    if seniority == "staff" and tech_stack == "architecture":
        return "architect"
    if seniority in ["senior", "staff"] and tech_stack == "architecture":
        return "tech_lead"

    if tech_stack == "devops":
        return f"devops_{template_seniority}"
    elif tech_stack == "data":
        return f"data_{template_seniority}"
    elif tech_stack == "frontend":
        return f"frontend_{template_seniority}"
    elif tech_stack in ["backend", "fullstack", "architecture"]:
        return f"{tech_stack}_{template_seniority}"

    return f"fullstack_{template_seniority}"


def generate_job_opportunities(background: str, quiz_responses: Dict[str, Any]) -> List[str]:

    seniority = _get_seniority_level(quiz_responses)
    tech_stack = _get_tech_stack_from_profile(quiz_responses)

    target_role = quiz_responses.get("targetRole", "")
    target_company = quiz_responses.get("targetCompany", "")
    job_title_prefix = format_job_title(target_role, target_company)
    template_key = _get_template_key(tech_stack, seniority)
    templates = JOB_TEMPLATES.get(template_key, JOB_TEMPLATES.get("fullstack_mid", []))
    opportunities = []
    for requirement in templates[:7]:
        opportunity = f"{job_title_prefix} - {requirement}"
        opportunities.append(opportunity)

    return opportunities