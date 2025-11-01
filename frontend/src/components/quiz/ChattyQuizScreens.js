// Configuration for chatty quiz screens with grouped questions
import React from 'react';
import {
  GraduationCap,
  Briefcase,
  Buildings,
  Clock,
  Trophy,
  TrendUp,
  CurrencyInr,
  Heart,
  ShieldCheck,
  Users,
  Target,
  Database,
  Stack,
  ChartBar,
  ChartLineUp,
  Code,
  CloudArrowUp,
  Wrench,
  Rocket,
  ArrowsClockwise,
  Lightbulb,
  CheckCircle,
  SuitcaseSimple,
  Briefcase as BriefcaseAlt,
  MonitorPlay,
  PaintBrush,
  Bank,
  UserCircle,
  BookOpen,
  FolderOpen,
  Presentation,
  Timer,
  GitBranch
} from 'phosphor-react';

// Tech Professional Path - Questions for users who selected 'tech' background
export const TECH_QUIZ_SCREENS = [
  // Screen 1: WHO YOU ARE
  {
    id: 'who-you-are',
    initialChatText: "Hey there! Let's start by understanding where you are today in your tech journey.",
    questions: [
      {
        id: 'currentRole',
        question: "What's your current role in the tech world?",
        options: [
          { value: 'swe-product', label: 'Software Engineer - Product Company', icon: <Briefcase size={24} weight="duotone" /> },
          { value: 'swe-service', label: 'Software Engineer - Service Company', icon: <Buildings size={24} weight="duotone" /> },
          { value: 'devops', label: 'DevOps / Cloud / Infrastructure Engineer', icon: <CloudArrowUp size={24} weight="duotone" /> },
          { value: 'qa-support', label: 'QA / Support / Other Technical Role', icon: <Wrench size={24} weight="duotone" /> }
        ]
      },
      {
        id: 'experience',
        question: 'How many years have you been in the tech industry?',
        options: [
          { value: '0-2', label: '0-2 years', icon: <Clock size={24} weight="duotone" /> },
          { value: '2-3', label: '2-3 years', icon: <Timer size={24} weight="duotone" /> },
          { value: '3-5', label: '3-5 years', icon: <Briefcase size={24} weight="duotone" /> },
          { value: '5-8', label: '5-8 years', icon: <TrendUp size={24} weight="duotone" /> },
          { value: '8+', label: '8+ years', icon: <Trophy size={24} weight="duotone" /> }
        ]
      },
      {
        id: 'currentSkill',
        question: 'Where are you currently investing most of your learning time?',
        dynamicOptions: true,
        optionsByRole: {
          'swe-product': [
            { value: 'backend', label: 'Backend development & APIs', icon: <Database size={24} weight="duotone" /> },
            { value: 'frontend', label: 'Frontend development & UI', icon: <MonitorPlay size={24} weight="duotone" /> },
            { value: 'fullstack', label: 'Full-stack development', icon: <Stack size={24} weight="duotone" /> },
            { value: 'system-design', label: 'System design & architecture', icon: <ChartLineUp size={24} weight="duotone" /> }
          ],
          'swe-service': [
            { value: 'enterprise', label: 'Enterprise stack (Java/.NET)', icon: <Buildings size={24} weight="duotone" /> },
            { value: 'web', label: 'Web development', icon: <Code size={24} weight="duotone" /> },
            { value: 'database', label: 'Database & backend work', icon: <Database size={24} weight="duotone" /> },
            { value: 'learning-product', label: 'Learning product company skills', icon: <TrendUp size={24} weight="duotone" /> }
          ],
          'devops': [
            { value: 'cloud', label: 'Cloud platforms (AWS/Azure/GCP)', icon: <CloudArrowUp size={24} weight="duotone" /> },
            { value: 'containers', label: 'Container & orchestration (Docker/K8s)', icon: <Stack size={24} weight="duotone" /> },
            { value: 'cicd', label: 'CI/CD & automation', icon: <GitBranch size={24} weight="duotone" /> },
            { value: 'iac', label: 'Infrastructure as Code', icon: <Code size={24} weight="duotone" /> }
          ],
          'qa-support': [
            { value: 'automation', label: 'Test automation & QA', icon: <Wrench size={24} weight="duotone" /> },
            { value: 'sysadmin', label: 'System administration', icon: <Buildings size={24} weight="duotone" /> },
            { value: 'learning-dev', label: 'Learning software development', icon: <BookOpen size={24} weight="duotone" /> },
            { value: 'infrastructure', label: 'Infrastructure & operations', icon: <CloudArrowUp size={24} weight="duotone" /> }
          ]
        }
      }
    ],
    chatResponseMap: {
      currentRole: {
        'swe-product': "Great! Product companies offer amazing learning opportunities and cutting-edge tech stacks.",
        'swe-service': "Got it! Many engineers successfully transition from service to product companies. Let's chart your path forward.",
        'devops': "Awesome! DevOps and infrastructure engineers are in incredibly high demand right now.",
        'qa-support': "Perfect! Many successful engineers started in QA/support roles. Let's build your advancement path."
      },
      experience: {
        '0-2': "Early career is the best time to build strong foundations! The investments you make now will compound for years.",
        '2-3': "Great timing! You're building solid experience. This is when intentional skill development pays off.",
        '3-5': "You're at a sweet spot! This is when career trajectories really diverge based on strategic choices.",
        '5-8': "Solid experience! Time to optimize and level up to senior roles or high-growth opportunities.",
        '8+': "Impressive journey! With 8+ years, you can target staff/principal roles or technical leadership positions."
      }
    }
  },

  // Screen 2: WHERE YOU WANT TO GO
  {
    id: 'where-you-want-to-go',
    initialChatText: "Perfect! Now let's talk about your aspirations and where you want to go next.",
    questions: [
      {
        id: 'primaryGoal',
        question: "What's your main career goal right now?",
        options: [
          { value: 'better-company', label: 'Move to a better company (same level)', icon: <Buildings size={24} weight="duotone" /> },
          { value: 'level-up', label: 'Level up (senior role / promotion)', icon: <TrendUp size={24} weight="duotone" /> },
          { value: 'higher-comp', label: 'Higher compensation', icon: <CurrencyInr size={24} weight="duotone" /> },
          { value: 'switch-domain', label: 'Switch to different tech domain', icon: <ArrowsClockwise size={24} weight="duotone" /> },
          { value: 'upskilling', label: 'Upskilling in current role', icon: <Rocket size={24} weight="duotone" /> }
        ]
      },
      {
        id: 'targetRole',
        question: "What's your dream role?",
        options: [
          { value: 'senior-backend', label: 'Senior Backend Engineer', icon: <Database size={24} weight="duotone" /> },
          { value: 'senior-fullstack', label: 'Senior Full-Stack Engineer', icon: <Stack size={24} weight="duotone" /> },
          { value: 'backend-sde', label: 'Backend / API Engineer', icon: <Database size={24} weight="duotone" /> },
          { value: 'fullstack-sde', label: 'Full-Stack Engineer', icon: <Stack size={24} weight="duotone" /> },
          { value: 'data-ml', label: 'Data / ML Engineer', icon: <ChartBar size={24} weight="duotone" /> },
          { value: 'tech-lead', label: 'Tech Lead / Staff Engineer', icon: <ChartLineUp size={24} weight="duotone" /> }
        ]
      },
      {
        id: 'targetCompany',
        question: 'What kind of company are you targeting?',
        options: [
          { value: 'faang', label: 'FAANG / Big Tech', icon: <Target size={24} weight="duotone" /> },
          { value: 'unicorns', label: 'Product Unicorns/Scaleups', icon: <Rocket size={24} weight="duotone" /> },
          { value: 'startups', label: 'High Growth Startups', icon: <Lightbulb size={24} weight="duotone" /> },
          { value: 'better-service', label: 'Better Service Company', icon: <Buildings size={24} weight="duotone" /> },
          { value: 'evaluating', label: 'Still evaluating', icon: <Target size={24} weight="duotone" /> }
        ]
      }
    ],
    chatResponseMap: {
      primaryGoal: {
        'better-company': "Smart move! A better company can be a career multiplier - stronger teams, better learning, more opportunities.",
        'level-up': "Love the ambition! Senior+ roles come with significant comp bumps and increased market value.",
        'higher-comp': "100% valid! Many engineers are underpaid. Let's optimize your compensation to match your skills.",
        'switch-domain': "Exciting! Switching domains can open entirely new opportunities. Timing and preparation are key.",
        'upskilling': "Great mindset! Strategic upskilling can lead to promotions and make you indispensable in your role."
      },
      targetRole: {
        'senior-backend': "Great choice! Senior backend roles offer high impact, excellent compensation, and clear career growth.",
        'senior-fullstack': "Versatile path! Senior full-stack engineers are highly sought after with strong compensation.",
        'backend-sde': "Solid choice! Backend engineering is always in demand with great career prospects.",
        'fullstack-sde': "Versatile! Full-stack roles offer broad learning and lots of opportunities across companies.",
        'data-ml': "Future-focused! Data & ML roles are exploding with cutting-edge problems and high compensation.",
        'tech-lead': "Leadership track! Staff+ roles combine technical depth with impact - gateway to principal/architect."
      },
      targetCompany: {
        'faang': "Top tier! FAANG offers unmatched comp and resume value. Hard to crack but worth the effort.",
        'unicorns': "Great target! Unicorns often match FAANG comp with more impact and better work-life balance.",
        'startups': "High growth, high learning! Perfect if you want rapid growth and don't mind some uncertainty.",
        'better-service': "Pragmatic! Better service companies can be stepping stones to product companies or FAANG.",
        'evaluating': "That's okay! Let's assess your profile first - clarity often comes after understanding your strengths."
      }
    }
  },

  // Screen 3: YOUR READINESS
  {
    id: 'your-readiness',
    initialChatText: "Almost there! Let's assess your current preparation level to identify focus areas.",
    questions: [
      {
        id: 'problemSolving',
        question: 'How much have you been practicing coding problems recently?',
        helperText: 'Think about the last 3 months on platforms like LeetCode or HackerRank',
        options: [
          { value: '100+', label: 'Very Active (100+ problems)', icon: <Trophy size={24} weight="duotone" /> },
          { value: '51-100', label: 'Moderately Active (50-100 problems)', icon: <CheckCircle size={24} weight="duotone" /> },
          { value: '11-50', label: 'Somewhat Active (10-50 problems)', icon: <Code size={24} weight="duotone" /> },
          { value: '0-10', label: 'Not Active (0-10 problems)', icon: <Clock size={24} weight="duotone" /> }
        ]
      },
      {
        id: 'systemDesign',
        question: 'How comfortable are you with system design?',
        conditional: true,
        showIf: (responses) => responses.problemSolving !== '0-10',
        options: [
          { value: 'multiple', label: 'Led design discussions', icon: <ChartLineUp size={24} weight="duotone" /> },
          { value: 'once', label: 'Participated in discussions', icon: <Users size={24} weight="duotone" /> },
          { value: 'learning', label: 'Self-learning only', icon: <BookOpen size={24} weight="duotone" /> },
          { value: 'not-yet', label: 'Not yet, will learn', icon: <Lightbulb size={24} weight="duotone" /> }
        ]
      },
      {
        id: 'portfolio',
        question: 'How active is your GitHub / GitLab profile?',
        helperText: 'Projects show practical experience to recruiters',
        options: [
          { value: 'active-5+', label: 'Active (5+ public repos)', icon: <GitBranch size={24} weight="duotone" /> },
          { value: 'limited-1-5', label: 'Limited (1-5 repos)', icon: <FolderOpen size={24} weight="duotone" /> },
          { value: 'inactive', label: 'Inactive (old activity)', icon: <Clock size={24} weight="duotone" /> },
          { value: 'none', label: 'No portfolio yet', icon: <Lightbulb size={24} weight="duotone" /> }
        ]
      }
    ],
    chatResponseMap: {
      problemSolving: {
        '100+': "Wow! You're putting in serious work. 100+ problems puts you in top percentile for interview readiness!",
        '51-100': "Great consistency! You're building strong problem-solving muscles and good interview readiness.",
        '11-50': "Good start! You've got the foundation - now let's ramp up consistency to excel at interviews.",
        '0-10': "No worries! Many successful engineers start here. Let's build a solid, consistent practice routine together."
      },
      systemDesign: {
        'multiple': "Excellent! Leading design discussions shows senior-level thinking. You're ahead of most candidates.",
        'once': "Good exposure! Real-world experience is valuable. Now let's deepen those system design skills.",
        'learning': "Smart! Self-learning shows initiative. Let's move from theory to practice with mock interviews.",
        'not-yet': "Perfect timing! System design is very learnable. I'll guide you based on your experience level."
      },
      portfolio: {
        'active-5+': "Fantastic! An active portfolio is your best resume. Make sure READMEs are polished and projects are well-documented.",
        'limited-1-5': "Good start! Having a few projects shows initiative. Focus on quality over quantity - add tests and documentation.",
        'inactive': "Time to revive it! Upload recent work or practice projects. Recruiters check GitHub - make it count.",
        'none': "No worries! Creating a portfolio is easier than you think. Start by uploading practice code and course projects."
      }
    }
  }
];

// Non-Tech / Career Switcher Path - Questions for users who selected 'non-tech' background
export const NON_TECH_QUIZ_SCREENS = [
  // Screen 1: WHO YOU ARE
  {
    id: 'who-you-are',
    initialChatText: "Welcome! Let me understand your background so I can create a personalized roadmap for your tech transition.",
    questions: [
      {
        id: 'currentBackground',
        question: "What's your current professional background?",
        options: [
          { value: 'sales-marketing', label: 'Sales / Marketing / Business', icon: <Presentation size={24} weight="duotone" /> },
          { value: 'operations', label: 'Operations / Consulting / PM', icon: <Briefcase size={24} weight="duotone" /> },
          { value: 'design', label: 'Design (UI/UX / Graphic / Product)', icon: <PaintBrush size={24} weight="duotone" /> },
          { value: 'finance', label: 'Finance / Accounting / Banking', icon: <Bank size={24} weight="duotone" /> },
          { value: 'other', label: 'Other Non-Tech / Fresh Grad', icon: <UserCircle size={24} weight="duotone" /> }
        ]
      },
      {
        id: 'experience',
        question: 'How many years of work experience do you have?',
        options: [
          { value: '0', label: '0 years (Fresh grad)', icon: <GraduationCap size={24} weight="duotone" /> },
          { value: '0-2', label: '0-2 years', icon: <Clock size={24} weight="duotone" /> },
          { value: '2-3', label: '2-3 years', icon: <Timer size={24} weight="duotone" /> },
          { value: '3-5', label: '3-5 years', icon: <Briefcase size={24} weight="duotone" /> },
          { value: '5+', label: '5+ years', icon: <Trophy size={24} weight="duotone" /> }
        ]
      },
      {
        id: 'stepsTaken',
        question: "What steps have you taken toward a tech career so far?",
        helperText: "No worries if you're just getting started!",
        options: [
          { value: 'completed-course', label: 'Completed online courses', icon: <CheckCircle size={24} weight="duotone" /> },
          { value: 'self-learning', label: 'Self-learning (YouTube/blogs)', icon: <BookOpen size={24} weight="duotone" /> },
          { value: 'built-projects', label: 'Built 1-2 small projects', icon: <FolderOpen size={24} weight="duotone" /> },
          { value: 'just-exploring', label: "Just exploring, haven't started", icon: <Lightbulb size={24} weight="duotone" /> },
          { value: 'bootcamp', label: 'Attended bootcamp/workshop', icon: <GraduationCap size={24} weight="duotone" /> }
        ]
      }
    ],
    chatResponseMap: {
      currentBackground: {
        'sales-marketing': "Great! Your communication skills are huge advantages in tech. You'll stand out where many engineers struggle.",
        'operations': "Perfect! Operations teaches systematic problem-solving - incredibly valuable for engineering roles.",
        'design': "Awesome! Design thinking and user empathy are gold in tech. Frontend/product engineering are natural fits.",
        'finance': "Nice! Analytical thinking and attention to detail transfer perfectly to programming and systems work.",
        'other': "Welcome! Your unique background will be an advantage. Different perspectives lead to better products."
      },
      experience: {
        '0': "Fresh start! Perfect time to build from the ground up with maximum flexibility in your learning path.",
        '0-2': "Good timing! Your adaptability will help you learn fast while understanding workplace dynamics.",
        '3-5': "Great! Your work experience is a strong foundation. Companies see career switchers as mature hires.",
        '5+': "Impressive! Your maturity and domain knowledge are massive assets that accelerate your transition."
      },
      stepsTaken: {
        'completed-course': "Solid foundation! Now let's focus on building projects and getting interview-ready.",
        'self-learning': "Love the hustle! Let's structure your learning and fill any gaps for interviews.",
        'built-projects': "Excellent! You're ahead of most beginners. Let's polish and position these projects.",
        'just-exploring': "Perfect place to start! With the right roadmap, people go from zero to job-ready in 6-12 months.",
        'bootcamp': "Great investment! Let's build on that momentum with portfolio and interview preparation."
      }
    }
  },

  // Screen 2: WHERE YOU WANT TO GO
  {
    id: 'where-you-want-to-go',
    initialChatText: "Great! Now let's define your goals - your target role, motivation, and company preferences.",
    questions: [
      {
        id: 'targetRole',
        question: 'Which tech role excites you the most?',
        options: [
          { value: 'backend', label: 'Backend Engineer', icon: <Database size={24} weight="duotone" /> },
          { value: 'fullstack', label: 'Full-Stack Engineer', icon: <Stack size={24} weight="duotone" /> },
          { value: 'data-ml', label: 'Data / ML Engineer', icon: <ChartBar size={24} weight="duotone" /> },
          { value: 'frontend', label: 'Frontend Engineer', icon: <MonitorPlay size={24} weight="duotone" /> },
          { value: 'not-sure', label: 'Not sure yet / Exploring', icon: <Lightbulb size={24} weight="duotone" /> }
        ]
      },
      {
        id: 'motivation',
        question: 'What is driving your move to tech?',
        options: [
          { value: 'salary', label: 'Better salary & growth', icon: <CurrencyInr size={24} weight="duotone" /> },
          { value: 'interest', label: 'Interest in technology', icon: <Heart size={24} weight="duotone" /> },
          { value: 'stability', label: 'Job stability & future-proofing', icon: <ShieldCheck size={24} weight="duotone" /> },
          { value: 'flexibility', label: 'Flexibility (remote work)', icon: <Rocket size={24} weight="duotone" /> },
          { value: 'dissatisfied', label: 'Dissatisfied with current career', icon: <ArrowsClockwise size={24} weight="duotone" /> }
        ]
      },
      {
        id: 'targetCompany',
        question: 'What type of company would you love to work for?',
        options: [
          { value: 'any-tech', label: 'Any tech company (experience first)', icon: <Buildings size={24} weight="duotone" /> },
          { value: 'product', label: 'Product companies', icon: <Rocket size={24} weight="duotone" /> },
          { value: 'service', label: 'Service companies', icon: <Briefcase size={24} weight="duotone" /> },
          { value: 'faang-longterm', label: 'FAANG / Big Tech (long-term)', icon: <Target size={24} weight="duotone" /> },
          { value: 'not-sure', label: 'Not sure / Need guidance', icon: <Lightbulb size={24} weight="duotone" /> }
        ]
      }
    ],
    chatResponseMap: {
      targetRole: {
        'backend': "Great choice! Backend is always in demand with clear learning paths and strong salaries.",
        'fullstack': "Versatile! You'll learn end-to-end development with more job opportunities.",
        'data-ml': "Future-proof! Growing fast but can be harder to break into as first role without math background.",
        'frontend': "Creative path! Perfect if you enjoy visual feedback and UX. Tons of jobs for career switchers.",
        'not-sure': "That's fine! I'll help you pick based on your background and learning style."
      },
      motivation: {
        'salary': "Smart! Tech pays 2-3x most industries. Just make sure to find some genuine interest too for the journey.",
        'interest': "Best reason! Genuine interest makes learning easier and is what separates success from burnout.",
        'stability': "Wise choice! Tech is recession-resistant with transferable skills - ultimate job security.",
        'flexibility': "Great perk! Remote work is common and companies compete on work-life balance.",
        'dissatisfied': "Time for change! Just make sure you're running toward tech, not just away from current job."
      },
      targetCompany: {
        'any-tech': "Pragmatic! For first role, experience >> brand. Get your foot in, learn, then level up.",
        'product': "Good goal! Great for learning but competitive. Consider service company as stepping stone.",
        'service': "Smart! Service companies hire more beginners. Spend 1-2 years, then jump to product companies.",
        'faang-longterm': "Dream big! But FAANG as first job is very hard. Better path: any tech → better company → FAANG.",
        'not-sure': "No problem! Focus on ANY engineering role first. After 1-2 years, you'll have more options."
      }
    }
  },

  // Screen 3: YOUR READINESS
  {
    id: 'your-readiness',
    initialChatText: "Almost done! Let's assess where you are today to give you a realistic timeline and focus areas.",
    questions: [
      {
        id: 'codeComfort',
        question: 'How comfortable are you with coding right now?',
        helperText: 'Be honest - this helps me give you the right advice!',
        options: [
          { value: 'confident', label: 'Confident (solve simple problems independently)', icon: <Trophy size={24} weight="duotone" /> },
          { value: 'learning', label: 'Learning (follow tutorials, struggle alone)', icon: <Code size={24} weight="duotone" /> },
          { value: 'beginner', label: "Beginner (understand concepts, can't code yet)", icon: <BookOpen size={24} weight="duotone" /> },
          { value: 'complete-beginner', label: "Complete Beginner (haven't tried yet)", icon: <Lightbulb size={24} weight="duotone" /> }
        ]
      },
      {
        id: 'timePerWeek',
        question: 'How much time can you dedicate each week?',
        helperText: 'This helps me create a realistic timeline for you',
        options: [
          { value: '10+', label: '10+ hours/week', icon: <Trophy size={24} weight="duotone" /> },
          { value: '6-10', label: '6-10 hours/week', icon: <Timer size={24} weight="duotone" /> },
          { value: '3-5', label: '3-5 hours/week', icon: <Clock size={24} weight="duotone" /> },
          { value: '0-2', label: '0-2 hours/week', icon: <Clock size={24} weight="duotone" /> }
        ]
      }
    ],
    chatResponseMap: {
      codeComfort: {
        'confident': "Awesome! You're past the hardest part. Focus on portfolio projects and interview prep. ~3-6 months to job-ready!",
        'learning': "Good progress! Now move from tutorials to building projects independently. ~6-9 months to job-ready.",
        'beginner': "Perfect! Understanding concepts is step one. Start writing code even if it's buggy. ~9-12 months to job-ready.",
        'complete-beginner': "No worries! Everyone starts here. Consistency over intensity. ~12-18 months to job-ready with discipline."
      },
      timePerWeek: {
        '10+': "Wow! This commitment will get you there fast. 6-12 months to job-ready. Just pace yourself!",
        '6-10': "Great! Sustainable pace with steady progress. 9-15 months to job-ready. Stay consistent!",
        '3-5': "Good! Minimum viable pace. Progress will be slower at 12-24 months. Can you carve out more time?",
        '0-2': "Let's be honest - this isn't enough for meaningful progress. Consider starting when you can dedicate more time."
      }
    }
  }
];

// Legacy export for backward compatibility - defaults to non-tech path
export const CHATTY_QUIZ_SCREENS = NON_TECH_QUIZ_SCREENS;

// Helper function to get all question IDs for validation
export const getAllQuestionIds = () => {
  return CHATTY_QUIZ_SCREENS.flatMap(screen =>
    screen.questions.map(q => q.id)
  );
};

// Helper to check if all questions in a screen are answered
export const isScreenComplete = (screenId, responses) => {
  const screen = CHATTY_QUIZ_SCREENS.find(s => s.id === screenId);
  if (!screen) return false;

  // Special handling for goals screen
  if (screen.isGoalsScreen) {
    return true; // Goals screen completion is handled separately
  }

  return screen.questions.every(q => responses[q.id]);
};
