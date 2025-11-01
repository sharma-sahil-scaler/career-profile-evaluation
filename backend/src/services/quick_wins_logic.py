from typing import Any, Dict, List, Tuple


def _create_quick_win(title: str, description: str, icon: str = "lightbulb", priority: int = 50) -> Dict[str, Any]:
    return {
        "title": title,
        "description": description,
        "icon": icon,
        "_priority": priority
    }


def _determine_user_level(quiz_responses: Dict[str, Any]) -> str:
    experience = quiz_responses.get("experience", "0")
    problem_solving = quiz_responses.get("problemSolving", "0-10")
    system_design = quiz_responses.get("systemDesign", "not-yet")
    portfolio = quiz_responses.get("portfolio", "none")
    current_role = quiz_responses.get("currentRole", "")

    if experience in ["5+", "5-8", "8+"]:
        return "advanced"

    if experience == "3-5":
        experience_signals = 0
        if portfolio in ["active-5+", "limited-1-5"]: experience_signals += 1
        if current_role in ["swe-product", "devops"]: experience_signals += 1
        if system_design in ["once", "multiple"]: experience_signals += 1
        if problem_solving in ["51-100", "100+"]: experience_signals += 1

        if experience_signals >= 2:
            return "advanced"

    if experience in ["0", "0-2"]:
        if problem_solving in ["0-10"] and portfolio == "none":
            return "beginner"
        return "intermediate"

    return "intermediate"


def generate_quick_wins(background: str, quiz_responses: Dict[str, Any]) -> List[Dict[str, str]]:
    quick_wins = []
    user_level = _determine_user_level(quiz_responses)

    current_role = quiz_responses.get("currentRole", "")
    experience = quiz_responses.get("experience", "")
    target_role = quiz_responses.get("targetRole", "")
    system_design = quiz_responses.get("systemDesign", "")
    portfolio = quiz_responses.get("portfolio", "")
    problem_solving = quiz_responses.get("problemSolving", "")

    if background == "non-tech":
        if current_role == "non-tech":
            quick_wins.append(_create_quick_win(
                "Start with Programming Basics",
                "Try 'Intro to Python' on Scaler Topics or W3Schools. Build a small automation like Excel-to-CSV script.",
                "code",
                priority=95
            ))
        elif current_role == "it-services":
            quick_wins.append(_create_quick_win(
                "Brush Up Coding Fundamentals",
                "Focus on loops and conditions. Solve 5 beginner problems on HackerRank.",
                "code",
                priority=90
            ))
        elif current_role == "technical":
            quick_wins.append(_create_quick_win(
                "Build a CRUD App",
                "Revisit core CS concepts and build a basic CRUD application using Python or Node.js.",
                "rocket",
                priority=85
            ))

        if experience in ["0", "0-2"]:
            quick_wins.append(_create_quick_win(
                "Build Your First Project",
                "Create a mini-project like a to-do app or calculator to showcase basic skills.",
                "rocket",
                priority=85
            ))
        elif experience == "3-5":
            quick_wins.append(_create_quick_win(
                "Showcase Transition Intent",
                "Add 2-3 measurable projects to your portfolio showing your transition to tech.",
                "trophy",
                priority=80
            ))
        if problem_solving in ["11-50", "51-100", "100+"]:
            if target_role in ["backend", "backend-dev", "backend-sde"]:
                quick_wins.append(_create_quick_win(
                    "Build a Simple REST API",
                    "Create a basic REST API using Flask or Django with 2-3 endpoints. Learn SQL basics.",
                    "code",
                    priority=75
                ))
            elif target_role in ["fullstack", "fullstack-dev", "fullstack-sde"]:
                quick_wins.append(_create_quick_win(
                    "Build a Web App",
                    "Create a simple web app with HTML, CSS, JavaScript. Host it on GitHub Pages or Netlify.",
                    "rocket",
                    priority=75
                ))

        if portfolio in ["none", "no-portfolio"]:
            quick_wins.append(_create_quick_win(
                "Set Up GitHub Profile",
                "Create GitHub account and upload 1-2 practice projects to start building your portfolio.",
                "target",
                priority=70
            ))

    else:
        if problem_solving == "0-10":
            if experience == "8+":
                quick_wins.append(_create_quick_win(
                    "Refresh Interview Skills",
                    f"Your {experience} years building production systems is valuable. Refresh interview skills with 30 easy + 50 medium problems over 6-8 weeks.",
                    "trophy",
                    priority=100
                ))
            elif experience == "5-8":
                quick_wins.append(_create_quick_win(
                    "Sharpen Interview Skills",
                    f"Your {experience} years of experience shows strong fundamentals. Sharpen interview prep with 50-80 problems focusing on common patterns over 6-8 weeks.",
                    "trophy",
                    priority=100
                ))
            elif experience == "3-5" or user_level == "advanced":
                quick_wins.append(_create_quick_win(
                    "Strengthen Interview Prep",
                    f"Your {experience} years of professional experience is valuable. Focus interview prep on 50-100 problems to unlock senior opportunities.",
                    "trophy",
                    priority=100
                ))
            else:
                quick_wins.append(_create_quick_win(
                    "Build Coding Foundation",
                    "Solve 20 easy problems on LeetCode/HackerRank focusing on arrays and strings.",
                    "code",
                    priority=100
                ))
        elif problem_solving == "11-50":
            quick_wins.append(_create_quick_win(
                "Strengthen Problem Solving",
                "Solve 30 medium problems focusing on Trees, Graphs, and Dynamic Programming.",
                "trophy",
                priority=95
            ))
        elif problem_solving == "51-100":
            quick_wins.append(_create_quick_win(
                "Master Advanced Patterns",
                "Solve 20 hard problems and participate in 2 weekly coding contests.",
                "trophy",
                priority=90
            ))

        if system_design == "not-yet" and user_level in ["intermediate", "advanced"]:
            quick_wins.append(_create_quick_win(
                "Start System Design Prep",
                "Read 'Designing Data-Intensive Applications' and design 1 system (URL shortener, Chat app).",
                "books",
                priority=95
            ))
        elif system_design == "once" and user_level == "advanced":
            quick_wins.append(_create_quick_win(
                "Deep Dive System Design",
                "Study 5 real-world system designs (Netflix, Uber, Instagram). Focus on trade-offs and scalability.",
                "books",
                priority=90
            ))
        if experience in ["5-8", "8+"] and user_level in ["intermediate", "advanced"]:
            if system_design in ["once", "multiple"] and problem_solving in ["51-100", "100+"]:
                quick_wins.append(_create_quick_win(
                    "Schedule Mock Interviews",
                    "Book 3-5 mock interviews (Pramp, Interviewing.io) to practice articulating your experience and system design thinking.",
                    "trophy",
                    priority=92
                ))

            quick_wins.append(_create_quick_win(
                "Prepare Leadership Stories",
                "Document 5-7 STAR stories showcasing impact, leadership, and problem-solving from your career. Quantify results.",
                "certificate",
                priority=90
            ))

            if target_role in ["senior-backend", "senior-fullstack", "tech-lead"]:
                quick_wins.append(_create_quick_win(
                    "Research Target Companies",
                    "Deep-dive into 3-5 target companies' tech stacks, culture, and recent engineering blogs. Prepare specific questions.",
                    "lightbulb",
                    priority=88
                ))

        if target_role in ["senior-backend", "senior-fullstack", "tech-lead"]:
            if experience in ["3-5", "5+", "5-8", "8+"]:
                quick_wins.append(_create_quick_win(
                    "Senior Role Interview Prep",
                    "Complete 90-day prep: 60 problems + 20 system design + 10 behavioral questions.",
                    "trophy",
                    priority=95
                ))
        elif target_role == "tech-lead" and experience in ["5+", "5-8", "8+"]:
            quick_wins.append(_create_quick_win(
                "Leadership Preparation",
                "Write 3 design docs for past projects. Practice team collaboration and mentoring.",
                "certificate",
                priority=85
            ))

        if portfolio == "none" and user_level != "beginner":
            quick_wins.append(_create_quick_win(
                "Build GitHub Presence",
                "Create GitHub account and upload 3-5 well-documented projects from your work.",
                "rocket",
                priority=75
            ))
        elif portfolio in ["limited-1-5", "limited-1to5"]:
            quick_wins.append(_create_quick_win(
                "Expand Portfolio Quality",
                "Add README, tests, and CI/CD to existing projects. Host 1 project live.",
                "rocket",
                priority=70
            ))
        if experience in ["3-5", "5+", "5-8", "8+"] and user_level in ["intermediate", "advanced"]:
            quick_wins.append(_create_quick_win(
                "Build Technical Brand",
                "Write 3 technical blog posts or create tutorial videos on topics you've mastered.",
                "certificate",
                priority=65
            ))

    if len(quick_wins) < 3:
        fallback_wins = []

        if background == "tech":
            if not any("problem" in w.get("title", "").lower() or "coding" in w.get("title", "").lower() or "interview" in w.get("title", "").lower() for w in quick_wins):
                if user_level != "advanced" and experience not in ["5-8", "8+"]:
                    fallback_wins.append(_create_quick_win(
                        "Practice Coding Regularly",
                        "Set aside 1 hour daily for coding practice. Focus on consistency over intensity.",
                        "code",
                        priority=50
                    ))

            if not any("system design" in w.get("title", "").lower() or "design" in w.get("description", "").lower() for w in quick_wins):
                if user_level == "advanced" and system_design in ["once", "multiple"]:
                    fallback_wins.append(_create_quick_win(
                        "Document System Design Decisions",
                        "Write 2-3 design docs for systems you've built. Practice explaining trade-offs.",
                        "books",
                        priority=50
                    ))
                else:
                    fallback_wins.append(_create_quick_win(
                        "Learn System Design Basics",
                        "Start with fundamentals: Load balancers, databases, caching. Watch 2-3 beginner videos this week.",
                        "books",
                        priority=50
                    ))

            if not any("project" in w.get("title", "").lower() or "portfolio" in w.get("title", "").lower() for w in quick_wins):
                if portfolio in ["active-5+"]:
                    if user_level != "advanced":
                        fallback_wins.append(_create_quick_win(
                            "Document Architecture Decisions",
                            "Add architectural diagrams and decision logs to your top 2 projects.",
                            "rocket",
                            priority=50
                        ))
                elif portfolio in ["limited-1-5"]:
                    fallback_wins.append(_create_quick_win(
                        "Polish Existing Projects",
                        "Add comprehensive READMEs, demo videos, and production deployment.",
                        "rocket",
                        priority=50
                    ))
                elif portfolio == "none":
                    if user_level != "advanced" and experience not in ["5-8", "8+"]:
                        fallback_wins.append(_create_quick_win(
                            "Build One Strong Project",
                            "Create one production-grade project with tests, documentation, and live deployment.",
                            "rocket",
                            priority=50
                        ))

            fallback_wins.append(_create_quick_win(
                "Prepare for Behavioral Interviews",
                "Use STAR method to prepare 5 stories showcasing leadership, problem-solving, and teamwork.",
                "trophy",
                priority=45
            ))

            fallback_wins.append(_create_quick_win(
                "Update Your Resume",
                "Quantify achievements (reduced load time by 40%, handled 10K+ users). Use action verbs.",
                "certificate",
                priority=40
            ))
        else:
            # Non-tech fallbacks
            if not any("basic" in w.get("title", "").lower() or "programming" in w.get("title", "").lower() for w in quick_wins):
                fallback_wins.append(_create_quick_win(
                    "Complete One Online Course",
                    "Finish a beginner-friendly course on Python, JavaScript, or SQL this month.",
                    "code",
                    priority=50
                ))

            if not any("project" in w.get("title", "").lower() for w in quick_wins):
                fallback_wins.append(_create_quick_win(
                    "Build Your First Tech Project",
                    "Create a simple project like a calculator, to-do list, or personal website.",
                    "rocket",
                    priority=50
                ))

            fallback_wins.append(_create_quick_win(
                "Network with Tech Professionals",
                "Join 2-3 tech communities (Reddit, Discord, LinkedIn). Ask questions and share learnings.",
                "trophy",
                priority=45
            ))

            fallback_wins.append(_create_quick_win(
                "Set Learning Goals",
                "Define specific, measurable goals: 'Learn Python basics in 4 weeks' vs 'Learn programming'.",
                "target",
                priority=40
            ))
        for fallback in fallback_wins:
            if len(quick_wins) >= 5:
                break
            if not any(fallback["title"] == w.get("title") for w in quick_wins):
                quick_wins.append(fallback)
    quick_wins.sort(key=lambda x: x["_priority"], reverse=True)
    clean_wins = []
    for win in quick_wins[:5]:
        clean_wins.append({
            "title": win["title"],
            "description": win["description"],
            "icon": win["icon"]
        })

    return clean_wins
