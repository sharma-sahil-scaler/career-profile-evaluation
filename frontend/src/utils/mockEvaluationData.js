// Mock evaluation data for frontend development
// This allows you to work on the results page UI without backend dependency

export const mockEvaluationResults = {
  profile_strength_score: 72,
  profile_strength_status: "Good",
  profile_strength_notes: "Your profile shows solid fundamentals with room for growth. You have a strong foundation in problem-solving and demonstrate good technical awareness. Focus on building more practical projects and deepening your system design knowledge to reach the next level.",

  skill_analysis: {
    strengths: [
      "Strong problem-solving ability with 51-100 problems solved",
      "Good understanding of technical concepts",
      "Active learning mindset with self-directed courses",
      "Analytical thinking and logical reasoning"
    ],
    areas_to_develop: [
      "System design knowledge - currently at beginner level",
      "Portfolio projects - need more real-world implementations",
      "Mock interview practice - limited experience with technical interviews",
      "Code quality and best practices understanding"
    ]
  },

  recommended_tools: [
    {
      name: "LeetCode",
      description: "Continue practicing data structures and algorithms",
      category: "Problem Solving",
      url: "https://leetcode.com"
    },
    {
      name: "System Design Primer",
      description: "Build foundational system design knowledge",
      category: "System Design",
      url: "https://github.com/donnemartin/system-design-primer"
    },
    {
      name: "Pramp",
      description: "Practice mock interviews with peers",
      category: "Interview Prep",
      url: "https://pramp.com"
    },
    {
      name: "GitHub",
      description: "Build and showcase portfolio projects",
      category: "Portfolio",
      url: "https://github.com"
    }
  ],

  experience_benchmark: {
    current_level: "Junior Developer",
    expected_level: "Mid-Level Developer",
    gap_analysis: "You're performing at a junior level with 2-3 years equivalent experience. To reach mid-level, focus on system design, architectural decisions, and leading small projects.",
    years_equivalent: 2.5
  },

  interview_readiness: {
    technical_interview_percent: 65,
    hr_behavioral_percent: 70,
    system_design_percent: 40,
    coding_assessment_percent: 75,
    overall_readiness: "Moderate",
    readiness_notes: "You're well-prepared for coding rounds but need significant work on system design. Behavioral interview skills are decent but could be strengthened with more structured preparation."
  },

  peer_comparison: {
    percentile: 68,
    label: "Above Average",
    summary: "You're performing better than 68% of candidates with similar backgrounds. Your problem-solving skills are a key differentiator.",
    metrics: {
      problem_solving: "Top 30%",
      system_design: "Bottom 40%",
      portfolio: "Average",
      interview_experience: "Below Average"
    }
  },

  success_likelihood: {
    score_percent: 72,
    label: "Good Chance",
    status: "Promising",
    notes: "You have a solid foundation and with focused effort on system design and portfolio projects, you can significantly increase your chances of landing offers from product companies. Estimated timeline: 3-4 months of dedicated preparation."
  },

  quick_wins: [
    {
      title: "Complete System Design Course",
      impact: "High",
      effort: "Medium",
      timeframe: "2-3 weeks",
      description: "Take a structured system design course to fill this critical gap. This will immediately boost your interview readiness."
    },
    {
      title: "Build One Full-Stack Project",
      impact: "High",
      effort: "High",
      timeframe: "3-4 weeks",
      description: "Create a complete project showcasing end-to-end development skills. This demonstrates practical ability to potential employers."
    },
    {
      title: "Practice 5 Mock Interviews",
      impact: "Medium",
      effort: "Low",
      timeframe: "2 weeks",
      description: "Get comfortable with interview formats and receive feedback on your communication and problem-solving approach."
    },
    {
      title: "Update LinkedIn & Resume",
      impact: "Medium",
      effort: "Low",
      timeframe: "1 week",
      description: "Optimize your online presence to attract recruiter attention and showcase your skills effectively."
    }
  ],

  opportunities_you_qualify_for: [
    {
      role: "Backend Developer",
      companies: ["Mid-sized product companies", "Well-funded startups"],
      requirements_match: "75%",
      gaps: ["System design knowledge", "Production experience"],
      notes: "You have strong problem-solving skills which is the primary requirement. Focus on system design to increase your match."
    },
    {
      role: "Full-Stack Developer",
      companies: ["Early-stage startups", "Small product teams"],
      requirements_match: "65%",
      gaps: ["Frontend expertise", "DevOps knowledge", "Full project ownership"],
      notes: "Your backend skills are good, but you'll need to build more frontend competency for full-stack roles."
    },
    {
      role: "SDE-1",
      companies: ["Service-based companies", "IT consultancies"],
      requirements_match: "85%",
      gaps: ["Professional work experience"],
      notes: "You're well-positioned for entry-level roles at service companies. These can provide valuable real-world experience."
    }
  ],

  recommended_roles_based_on_interests: [
    {
      role: "Backend Developer",
      title: "Backend Developer",
      match_score: 85,
      salary_range_inr: "12-18L",
      seniority: "SDE-2",
      department: "Engineering",
      reasoning: "Your problem-solving strength and analytical mindset align perfectly with backend development. You've shown interest in system architecture which is key for this role.",
      learning_path: [
        "Master one backend framework (Node.js/Django/Spring Boot)",
        "Learn database design and optimization",
        "Understand API design principles",
        "Practice building scalable systems"
      ]
    },
    {
      role: "Full-Stack Developer",
      title: "Full-Stack Developer",
      match_score: 78,
      salary_range_inr: "10-16L",
      seniority: "SDE-1",
      department: "Engineering",
      reasoning: "Your versatile skill set and eagerness to learn both frontend and backend technologies make you a strong candidate for full-stack roles.",
      learning_path: [
        "Master React or Vue.js for frontend",
        "Build complete end-to-end applications",
        "Learn REST API design",
        "Understand state management"
      ]
    },
    {
      role: "DevOps Engineer",
      title: "DevOps Engineer",
      match_score: 60,
      salary_range_inr: "15-22L",
      seniority: "SDE-2",
      department: "Infrastructure",
      reasoning: "Your technical background and problem-solving skills provide a foundation for DevOps. However, you'll need to develop expertise in cloud platforms and automation.",
      learning_path: [
        "Learn AWS/Azure/GCP fundamentals",
        "Master Docker and Kubernetes",
        "Understand CI/CD pipelines",
        "Practice infrastructure as code"
      ]
    },
    {
      role: "Data Engineer",
      title: "Data Engineer",
      match_score: 55,
      salary_range_inr: "10-16L",
      seniority: "Junior DE",
      department: "Data Science",
      reasoning: "Your analytical skills translate well to data engineering, but you'll need significant upskilling in data-specific technologies.",
      learning_path: [
        "Learn SQL and database optimization",
        "Understand data pipelines and ETL",
        "Master data warehousing concepts",
        "Learn big data technologies (Spark, Kafka)"
      ]
    },
    {
      role: "Frontend Developer",
      title: "Frontend Developer",
      match_score: 50,
      salary_range_inr: "8-14L",
      seniority: "SDE-1",
      department: "Engineering",
      reasoning: "While your backend skills are strong, frontend development requires additional focus on UI/UX and modern JavaScript frameworks.",
      learning_path: [
        "Master React or Angular",
        "Learn responsive design principles",
        "Understand CSS frameworks",
        "Build interactive user interfaces"
      ]
    }
  ],

  badges: [
    {
      name: "Problem Solver",
      description: "Solved 51+ coding problems",
      icon: "trophy"
    },
    {
      name: "Self Learner",
      description: "Active in self-directed learning",
      icon: "star"
    },
    {
      name: "Growth Mindset",
      description: "Demonstrates commitment to continuous improvement",
      icon: "rocket"
    }
  ]
};

// Alternative mock data for non-tech background
export const mockEvaluationResultsNonTech = {
  profile_strength_score: 58,
  profile_strength_status: "Average",
  profile_strength_notes: "You're taking the right steps towards a tech career transition. Your non-tech background brings valuable transferable skills like communication and analytical thinking. Focus on building technical fundamentals and creating portfolio projects to strengthen your profile.",

  skill_analysis: {
    strengths: [
      "Strong communication and stakeholder management skills",
      "Analytical thinking and problem-solving approach",
      "Professional work experience (3-5 years)",
      "Growth mindset and self-learning initiative"
    ],
    areas_to_develop: [
      "Programming fundamentals - need consistent practice",
      "Technical project portfolio - currently limited",
      "Understanding of software development lifecycle",
      "Technical interview preparation"
    ]
  },

  recommended_tools: [
    {
      name: "freeCodeCamp",
      description: "Learn web development from scratch with hands-on projects",
      category: "Learning Platform",
      url: "https://freecodecamp.org"
    },
    {
      name: "Codecademy",
      description: "Interactive coding courses for beginners",
      category: "Learning Platform",
      url: "https://codecademy.com"
    },
    {
      name: "100 Days of Code",
      description: "Build consistency with daily coding practice",
      category: "Challenge",
      url: "https://100daysofcode.com"
    },
    {
      name: "Scrimba",
      description: "Interactive screencasts for learning web development",
      category: "Learning Platform",
      url: "https://scrimba.com"
    }
  ],

  experience_benchmark: {
    current_level: "Career Switcher",
    expected_level: "Junior Developer (Target)",
    gap_analysis: "You're in the early stages of your tech transition. With 6-12 months of dedicated learning and project building, you can reach junior developer level competency.",
    years_equivalent: 0.5
  },

  interview_readiness: {
    technical_interview_percent: 25,
    hr_behavioral_percent: 75,
    system_design_percent: 15,
    coding_assessment_percent: 30,
    overall_readiness: "Early Stage",
    readiness_notes: "Your behavioral interview skills are strong thanks to your professional background. However, you need significant technical preparation before being interview-ready. Focus on coding fundamentals first."
  },

  peer_comparison: {
    percentile: 45,
    label: "Average",
    summary: "You're at par with most career switchers at the early stage. Your professional experience gives you an edge in soft skills, but technical skills need development.",
    metrics: {
      problem_solving: "Average",
      system_design: "Beginner",
      portfolio: "Beginner",
      soft_skills: "Strong"
    }
  },

  success_likelihood: {
    score_percent: 55,
    label: "Moderate Chance",
    status: "Developing",
    notes: "Career transitions take time but are definitely achievable. With consistent effort over 8-12 months, building projects, and structured learning, you can successfully break into tech. Your professional experience is an asset that will help once you build technical skills."
  },

  quick_wins: [
    {
      title: "Complete a Beginner Web Dev Course",
      impact: "High",
      effort: "Medium",
      timeframe: "4-6 weeks",
      description: "Build foundational knowledge in HTML, CSS, and JavaScript through a structured course. This creates a solid base for further learning."
    },
    {
      title: "Build 3 Small Projects",
      impact: "High",
      effort: "Medium",
      timeframe: "6-8 weeks",
      description: "Create simple projects like a todo app, calculator, and portfolio website. These demonstrate practical ability and build confidence."
    },
    {
      title: "Code Daily for 30 Days",
      impact: "Medium",
      effort: "Medium",
      timeframe: "1 month",
      description: "Establish a daily coding habit. Consistency is more important than intensity at this stage."
    },
    {
      title: "Join Tech Communities",
      impact: "Low",
      effort: "Low",
      timeframe: "Ongoing",
      description: "Connect with other learners and developers. Communities provide support, resources, and motivation during your transition."
    }
  ],

  opportunities_you_qualify_for: [
    {
      role: "Junior Frontend Developer",
      companies: ["Early-stage startups", "Digital agencies"],
      requirements_match: "40%",
      gaps: ["Technical skills", "Portfolio projects", "Framework knowledge"],
      notes: "With 6 months of focused learning, you could qualify for junior frontend roles. Your communication skills will be valuable."
    },
    {
      role: "Technical Support Engineer",
      companies: ["SaaS companies", "Tech startups"],
      requirements_match: "65%",
      gaps: ["Basic technical troubleshooting", "Product knowledge"],
      notes: "This could be a good entry point into tech, leveraging your professional experience while building technical skills."
    },
    {
      role: "QA Engineer",
      companies: ["Product companies", "Startups"],
      requirements_match: "55%",
      gaps: ["Testing frameworks", "Automation basics"],
      notes: "QA roles can provide a pathway into tech development. Your analytical skills are a strong foundation."
    }
  ],

  recommended_roles_based_on_interests: [
    {
      role: "Frontend Developer",
      title: "Frontend Developer",
      match_score: 75,
      salary_range_inr: "8-14L",
      seniority: "Junior",
      department: "Engineering",
      reasoning: "Based on your interest in web development and user-facing products, frontend development is a great fit. It's also one of the most accessible paths for career switchers.",
      learning_path: [
        "Master HTML, CSS, and JavaScript fundamentals",
        "Learn a modern framework (React/Vue)",
        "Build responsive, user-friendly interfaces",
        "Understand web accessibility and UX principles"
      ]
    },
    {
      role: "Product Manager (Technical)",
      title: "Product Manager (Technical)",
      match_score: 70,
      salary_range_inr: "15-25L",
      seniority: "APM",
      department: "Product",
      reasoning: "Your professional experience combined with growing technical knowledge makes you well-suited for technical PM roles. You can bridge business and technology.",
      learning_path: [
        "Build technical literacy through coding",
        "Learn product management frameworks",
        "Understand software development processes",
        "Practice product thinking and prioritization"
      ]
    },
    {
      role: "Full-Stack Developer",
      title: "Full-Stack Developer",
      match_score: 60,
      salary_range_inr: "10-18L",
      seniority: "SDE-1",
      department: "Engineering",
      reasoning: "A longer-term goal that leverages your interest in comprehensive solutions. Will require significant upskilling but combines technical and business thinking.",
      learning_path: [
        "Start with frontend development",
        "Learn backend basics (Node.js/Python)",
        "Understand databases and APIs",
        "Build complete end-to-end projects"
      ]
    },
    {
      role: "QA Engineer",
      title: "QA Engineer",
      match_score: 65,
      salary_range_inr: "6-12L",
      seniority: "SDET-1",
      department: "Quality",
      reasoning: "Your attention to detail and analytical skills make QA a natural entry point. This role provides technical exposure while leveraging your systematic thinking.",
      learning_path: [
        "Learn testing fundamentals",
        "Master test automation tools",
        "Understand software testing lifecycle",
        "Practice bug reporting and tracking"
      ]
    },
    {
      role: "Technical Writer",
      title: "Technical Writer",
      match_score: 55,
      salary_range_inr: "8-15L",
      seniority: "Mid-level",
      department: "Content",
      reasoning: "If you have strong writing skills, technical writing combines communication abilities with technical knowledge. It's a unique entry path into tech.",
      learning_path: [
        "Learn technical documentation standards",
        "Understand developer tools and APIs",
        "Practice writing clear technical content",
        "Build a portfolio of documentation samples"
      ]
    }
  ],

  badges: [
    {
      name: "Career Changer",
      description: "Taking the leap into tech",
      icon: "compass"
    },
    {
      name: "Communicator",
      description: "Strong professional communication skills",
      icon: "message"
    },
    {
      name: "Determined",
      description: "Committed to learning and growth",
      icon: "fire"
    }
  ]
};
