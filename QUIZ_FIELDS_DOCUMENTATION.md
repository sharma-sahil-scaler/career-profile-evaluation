# CPE Quiz Fields - Complete Documentation

## Summary

This document comprehensively lists all quiz questions, their options, and what the backend actually receives.

---

## TECH BACKGROUND QUIZ FLOW

### Screen 1: "WHO YOU ARE" (3 questions)

#### Question 1: `currentRole` - "What's your current role in the tech world?"
- `swe-product` → Software Engineer - Product Company
- `swe-service` → Software Engineer - Service Company
- `devops` → DevOps / Cloud / Infrastructure Engineer
- `qa-support` → QA / Support / Other Technical Role

#### Question 2: `experience` - "How many years have you been in the tech industry?"
- `0-2` → 0-2 years
- `2-3` → 2-3 years
- `3-5` → 3-5 years
- `5-8` → 5-8 years
- `8+` → 8+ years

#### Question 3: `currentSkill` - "Where are you currently investing most of your learning time?"
**DYNAMIC OPTIONS - Varies by currentRole:**

If `currentRole == swe-product`:
- `backend` → Backend development & APIs
- `frontend` → Frontend development & UI
- `fullstack` → Full-stack development
- `system-design` → System design & architecture

If `currentRole == swe-service`:
- `enterprise` → Enterprise stack (Java/.NET)
- `web` → Web development
- `database` → Database & backend work
- `learning-product` → Learning product company skills

If `currentRole == devops`:
- `cloud` → Cloud platforms (AWS/Azure/GCP)
- `containers` → Container & orchestration (Docker/K8s)
- `cicd` → CI/CD & automation
- `iac` → Infrastructure as Code

If `currentRole == qa-support`:
- `automation` → Test automation & QA
- `sysadmin` → System administration
- `learning-dev` → Learning software development
- `infrastructure` → Infrastructure & operations

---

### Screen 2: "WHERE YOU WANT TO GO" (3 questions)

#### Question 4: `primaryGoal` - "What's your main career goal right now?"
- `better-company` → Move to a better company (same level)
- `level-up` → Level up (senior role / promotion)
- `higher-comp` → Higher compensation
- `switch-domain` → Switch to different tech domain
- `upskilling` → Upskilling in current role

#### Question 5: `targetRole` - "What's your dream role?"
- `senior-backend` → Senior Backend Engineer
- `senior-fullstack` → Senior Full-Stack Engineer
- `backend-sde` → Backend / API Engineer
- `fullstack-sde` → Full-Stack Engineer
- `data-ml` → Data / ML Engineer
- `tech-lead` → Tech Lead / Staff Engineer

#### Question 6: `targetCompany` - "What kind of company are you targeting?"
- `faang` → FAANG / Big Tech
- `unicorns` → Product Unicorns/Scaleups
- `startups` → High Growth Startups
- `better-service` → Better Service Company
- `evaluating` → Still evaluating

---

### Screen 3: "YOUR READINESS" (3 questions)

#### Question 7: `problemSolving` - "How much have you been practicing coding problems recently?" (Last 3 months)
- `100+` → Very Active (100+ problems)
- `51-100` → Moderately Active (50-100 problems)
- `11-50` → Somewhat Active (10-50 problems)
- `0-10` → Not Active (0-10 problems)

#### Question 8: `systemDesign` - "How comfortable are you with system design?"
**CONDITIONAL - Only shown if `problemSolving !== '0-10'`**
- `multiple` → Led design discussions
- `once` → Participated in discussions
- `learning` → Self-learning only
- `not-yet` → Not yet, will learn

#### Question 9: `portfolio` - "How active is your GitHub / GitLab profile?"
- `active-5+` → Active (5+ public repos)
- `limited-1-5` → Limited (1-5 repos)
- `inactive` → Inactive (old activity)
- `none` → No portfolio yet

---

## NON-TECH BACKGROUND QUIZ FLOW

### Screen 1: "WHO YOU ARE" (3 questions)

#### Question 1: `currentBackground` - "What's your current professional background?"
- `sales-marketing` → Sales / Marketing / Business
- `operations` → Operations / Consulting / PM
- `design` → Design (UI/UX / Graphic / Product)
- `finance` → Finance / Accounting / Banking
- `other` → Other Non-Tech / Fresh Grad

#### Question 2: `experience` - "How many years of work experience do you have?"
- `0` → 0 years (Fresh grad)
- `0-2` → 0-2 years
- `2-3` → 2-3 years
- `3-5` → 3-5 years
- `5+` → 5+ years

#### Question 3: `stepsTaken` - "What steps have you taken toward a tech career so far?"
- `completed-course` → Completed online courses
- `self-learning` → Self-learning (YouTube/blogs)
- `built-projects` → Built 1-2 small projects
- `just-exploring` → Just exploring, haven't started
- `bootcamp` → Attended bootcamp/workshop

---

### Screen 2: "WHERE YOU WANT TO GO" (3 questions)

#### Question 4: `targetRole` - "Which tech role excites you the most?"
- `backend` → Backend Engineer
- `fullstack` → Full-Stack Engineer
- `data-ml` → Data / ML Engineer
- `frontend` → Frontend Engineer
- `not-sure` → Not sure yet / Exploring

#### Question 5: `motivation` - "What is driving your move to tech?"
- `salary` → Better salary & growth
- `interest` → Interest in technology
- `stability` → Job stability & future-proofing
- `flexibility` → Flexibility (remote work)
- `dissatisfied` → Dissatisfied with current career

#### Question 6: `targetCompany` - "What type of company would you love to work for?"
- `any-tech` → Any tech company (experience first)
- `product` → Product companies
- `service` → Service companies
- `faang-longterm` → FAANG / Big Tech (long-term)
- `not-sure` → Not sure / Need guidance

---

### Screen 3: "YOUR READINESS" (2 questions)

#### Question 7: `codeComfort` - "How comfortable are you with coding right now?"
- `confident` → Confident (solve simple problems independently)
- `learning` → Learning (follow tutorials, struggle alone)
- `beginner` → Beginner (understand concepts, can't code yet)
- `complete-beginner` → Complete Beginner (haven't tried yet)

#### Question 8: `timePerWeek` - "How much time can you dedicate each week?"
- `10+` → 10+ hours/week
- `6-10` → 6-10 hours/week
- `3-5` → 3-5 hours/week
- `0-2` → 0-2 hours/week

---

## CRITICAL ISSUE: MISMATCH BETWEEN QUIZ AND API

### What Quiz Collects vs What API Accepts

**TECH USERS - Quiz Collects:**
1. currentRole ✓ (API accepts)
2. experience ✓ (API accepts)
3. currentSkill ✗ (API does NOT accept this)
4. primaryGoal ✓ (mapped to requirementType in API)
5. targetRole ✓ (API accepts)
6. targetCompany ✓ (API accepts)
7. problemSolving ✓ (API accepts)
8. systemDesign ✓ (API accepts)
9. portfolio ✓ (API accepts)

**NON-TECH USERS - Quiz Collects:**
1. currentBackground ✗ (API does NOT accept this)
2. experience ✓ (API accepts)
3. stepsTaken ✗ (API does NOT accept this)
4. targetRole ✓ (API accepts)
5. motivation ✗ (API does NOT accept this)
6. targetCompany ✓ (API accepts)
7. codeComfort ✗ (API does NOT accept this)
8. timePerWeek ✗ (API does NOT accept this)

### Fields API Currently Accepts (from main.py)

```python
class QuizResponses(BaseModel):
    currentRole: str
    experience: str
    targetRole: str
    problemSolving: str
    systemDesign: str
    portfolio: str
    mockInterviews: str          # ← NOT COLLECTED IN QUIZ!
    currentCompany: str
    currentSkill: str
    requirementType: str          # ← Mapped from primaryGoal/motivation
    targetCompany: str
```

---

## What Needs to Be Fixed

1. **Add missing fields to API model** that are collected in the quiz:
   - `currentBackground` (for non-tech)
   - `stepsTaken` (for non-tech)
   - `codeComfort` (for non-tech)
   - `timePerWeek` (for non-tech)
   - `motivation` (for non-tech)
   - `primaryGoal` (for tech)

2. **Remove or make optional** fields that aren't actually collected:
   - `mockInterviews` - NOT in the quiz anymore!

3. **Fix `interview_readiness_logic.py`** to use the actual available fields instead of hallucinating undefined ones like `code_comfort` and `steps_taken` (wrong field names).

---

## Interview Readiness Calculation Fix

Currently the code references:
- `codeComfort` ✗ (should be `codeComfort` from quiz, but not in API yet)
- `stepsTaken` ✗ (should be `stepsTaken` from quiz, but not in API yet)
- `currentBackground` ✗ (not in API)

**The calculation logic needs to be updated to:**
- Use ONLY the fields that are actually in the API payload
- Add the missing non-tech fields to the API model first
- Then use those fields in the calculation
