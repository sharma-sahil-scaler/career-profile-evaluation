# Quiz Questions & Options

Complete list of all questions and answer options presented to users in the Free Profile Evaluation quiz.

---

## Initial Screen: Background Selection

### Question: "What's your current background?"

| Option Value | Display Text |
|---|---|
| `tech` | Tech Professional (Already working in tech) |
| `non-tech` | Non-Tech / Career Switcher (Looking to transition into tech) |

---

## For Tech Professionals

### Screen 1: WHO YOU ARE

#### Q1: `currentRole` — "What's your current role in the tech world?"

| Option Value | Display Text |
|---|---|
| `swe-product` | Software Engineer - Product Company |
| `swe-service` | Software Engineer - Service Company |
| `devops` | DevOps / Cloud / Infrastructure Engineer |
| `qa-support` | QA / Support / Other Technical Role |

#### Q2: `experience` — "How many years have you been in the tech industry?"

| Option Value | Display Text |
|---|---|
| `0-2` | 0-2 years |
| `2-3` | 2-3 years |
| `3-5` | 3-5 years |
| `5-8` | 5-8 years |
| `8+` | 8+ years |

#### Q3: `currentSkill` — "Where are you currently investing most of your learning time?"

**Options vary based on `currentRole`:**

**If role = SWE - Product:**
| Option Value | Display Text |
|---|---|
| `backend` | Backend development & APIs |
| `frontend` | Frontend development & UI |
| `fullstack` | Full-stack development |
| `system-design` | System design & architecture |

**If role = SWE - Service:**
| Option Value | Display Text |
|---|---|
| `enterprise` | Enterprise stack (Java/.NET) |
| `web` | Web development |
| `database` | Database & backend work |
| `learning-product` | Learning product company skills |

**If role = DevOps:**
| Option Value | Display Text |
|---|---|
| `cloud` | Cloud platforms (AWS/Azure/GCP) |
| `containers` | Container & orchestration (Docker/K8s) |
| `cicd` | CI/CD & automation |
| `iac` | Infrastructure as Code |

**If role = QA / Support:**
| Option Value | Display Text |
|---|---|
| `automation` | Test automation & QA |
| `sysadmin` | System administration |
| `learning-dev` | Learning software development |
| `infrastructure` | Infrastructure & operations |

---

### Screen 2: WHERE YOU WANT TO GO

#### Q4: `primaryGoal` — "What's your main career goal right now?"

| Option Value | Display Text |
|---|---|
| `better-company` | Move to a better company (same level) |
| `level-up` | Level up (senior role / promotion) |
| `higher-comp` | Higher compensation |
| `switch-domain` | Switch to different tech domain |
| `upskilling` | Upskilling in current role |

#### Q5: `targetRole` — "What's your dream role?"

| Option Value | Display Text |
|---|---|
| `senior-backend` | Senior Backend Engineer |
| `senior-fullstack` | Senior Full-Stack Engineer |
| `backend-sde` | Backend / API Engineer |
| `fullstack-sde` | Full-Stack Engineer |
| `data-ml` | Data / ML Engineer |
| `tech-lead` | Tech Lead / Staff Engineer |

#### Q6: `targetCompany` — "What kind of company are you targeting?"

| Option Value | Display Text |
|---|---|
| `faang` | FAANG / Big Tech |
| `unicorns` | Product Unicorns/Scaleups |
| `startups` | High Growth Startups |
| `better-service` | Better Service Company |
| `evaluating` | Still evaluating |

---

### Screen 3: YOUR READINESS

#### Q7: `problemSolving` — "How much have you been practicing coding problems recently?"
*Helper text: "Think about the last 3 months on platforms like LeetCode or HackerRank"*

| Option Value | Display Text |
|---|---|
| `100+` | Very Active (100+ problems) |
| `51-100` | Moderately Active (50-100 problems) |
| `11-50` | Somewhat Active (10-50 problems) |
| `0-10` | Not Active (0-10 problems) |

#### Q8: `systemDesign` — "How comfortable are you with system design?"
**⚠️ CONDITIONAL: Only shown if `problemSolving ≠ '0-10'`**

| Option Value | Display Text |
|---|---|
| `multiple` | Led design discussions |
| `once` | Participated in discussions |
| `learning` | Self-learning only |
| `not-yet` | Not yet, will learn |

#### Q9: `portfolio` — "How active is your GitHub / GitLab profile?"
*Helper text: "Projects show practical experience to recruiters"*

| Option Value | Display Text |
|---|---|
| `active-5+` | Active (5+ public repos) |
| `limited-1-5` | Limited (1-5 repos) |
| `inactive` | Inactive (old activity) |
| `none` | No portfolio yet |

---

## For Non-Tech / Career Switchers

### Screen 1: WHO YOU ARE

#### Q1: `currentBackground` — "What's your current professional background?"

| Option Value | Display Text |
|---|---|
| `sales-marketing` | Sales / Marketing / Business |
| `operations` | Operations / Consulting / PM |
| `design` | Design (UI/UX / Graphic / Product) |
| `finance` | Finance / Accounting / Banking |
| `other` | Other Non-Tech / Fresh Grad |

#### Q2: `experience` — "How many years of work experience do you have?"

| Option Value | Display Text |
|---|---|
| `0` | 0 years (Fresh grad) |
| `0-2` | 0-2 years |
| `2-3` | 2-3 years |
| `3-5` | 3-5 years |
| `5+` | 5+ years |

#### Q3: `stepsTaken` — "What steps have you taken toward a tech career so far?"
*Helper text: "No worries if you're just getting started!"*

| Option Value | Display Text |
|---|---|
| `bootcamp` | Attended bootcamp/workshop |
| `completed-course` | Completed online courses |
| `built-projects` | Built 1-2 small projects |
| `self-learning` | Self-learning (YouTube/blogs) |
| `just-exploring` | Just exploring, haven't started |

---

### Screen 2: WHERE YOU WANT TO GO

#### Q4: `targetRole` — "Which tech role excites you the most?"

| Option Value | Display Text |
|---|---|
| `backend` | Backend Engineer |
| `fullstack` | Full-Stack Engineer |
| `data-ml` | Data / ML Engineer |
| `frontend` | Frontend Engineer |
| `not-sure` | Not sure yet / Exploring |

#### Q5: `motivation` — "What is driving your move to tech?"

| Option Value | Display Text |
|---|---|
| `salary` | Better salary & growth |
| `interest` | Interest in technology |
| `stability` | Job stability & future-proofing |
| `flexibility` | Flexibility (remote work) |
| `dissatisfied` | Dissatisfied with current career |

#### Q6: `targetCompany` — "What type of company would you love to work for?"

| Option Value | Display Text |
|---|---|
| `any-tech` | Any tech company (experience first) |
| `product` | Product companies |
| `service` | Service companies |
| `faang-longterm` | FAANG / Big Tech (long-term) |
| `not-sure` | Not sure / Need guidance |

---

### Screen 3: YOUR READINESS

#### Q7: `codeComfort` — "How comfortable are you with coding right now?"
*Helper text: "Be honest - this helps me give you the right advice!"*

| Option Value | Display Text |
|---|---|
| `confident` | Confident (solve simple problems independently) |
| `learning` | Learning (follow tutorials, struggle alone) |
| `beginner` | Beginner (understand concepts, can't code yet) |
| `complete-beginner` | Complete Beginner (haven't tried yet) |

#### Q8: `timePerWeek` — "How much time can you dedicate each week?"
*Helper text: "This helps me create a realistic timeline for you"*

| Option Value | Display Text |
|---|---|
| `10+` | 10+ hours/week |
| `6-10` | 6-10 hours/week |
| `3-5` | 3-5 hours/week |
| `0-2` | 0-2 hours/week |

---

## Summary Statistics

| Metric | Count |
|---|---|
| Total Questions (Tech Users) | 10 questions + 1 conditional |
| Total Questions (Non-Tech Users) | 9 |
| Conditional Questions | 1 (systemDesign for tech users) |
| Dynamic Questions | 1 (currentSkill changes based on currentRole) |
| Total Unique Options | ~85+ |

---

## Implementation Notes

### Storage Format
All responses are stored in React Context as strings with the option value (e.g., `swe-product`, `100+`, etc.).

### Frontend Code
- **Primary file:** `frontend/src/components/quiz/ChattyQuizScreens.js`
- **Main orchestrator:** `frontend/src/components/quiz/FinalModeQuiz.js`
- **Question display:** `frontend/src/components/quiz/GroupedQuestionScreen.js`
- **Initial screen:** `frontend/src/components/quiz/BackgroundSelectionSplit2.js`

### Backend API Model
Located in `backend/src/api/main.py` - Pydantic model accepts quiz responses for evaluation processing.

---

## Known Issues ⚠️

### Fields Collected but Not Used by Backend
**Non-Tech Users:**
- `currentBackground` - collected but not accepted by API
- `stepsTaken` - collected but not accepted by API
- `codeComfort` - collected but not accepted by API
- `timePerWeek` - collected but not accepted by API
- `motivation` - collected and mapped to `requirementType` internally

**Tech Users:**
- `primaryGoal` - collected, now marked as optional in API

See `QUIZ_FIELDS_DOCUMENTATION.md` for details on this mismatch.
