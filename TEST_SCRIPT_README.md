# Comprehensive Persona Testing Script

Complete testing framework for the Free Profile Evaluation system with all 12 user personas.

---

## Overview

The `test_personas_comprehensive.py` script tests the backend API against 12 distinct user personas. Each persona represents a unique combination of background, experience, skills, and goals. The script measures:

1. **API Response Quality** - Response time, status codes, completeness
2. **Backend Logic Output** - Profile strength, interview readiness, recommendations
3. **Response Consistency** - Same input always produces same cached output
4. **Schema Validation** - Ensures response structure matches expected format
5. **Learner View** - Shows exactly what learners would see

---

## Prerequisites

### Required
- Backend running: `http://localhost:8000/career-profile-tool/api/evaluate`
- PostgreSQL database with cache tables running
- `OPENAI_API_KEY` environment variable set
- Python 3.8+
- `requests` library: `pip install requests`

### Optional
- Docker containers running: `docker compose up --build`
- Test database seeded with cache data

---

## Usage

### Test a Single Persona

```bash
python test_personas_comprehensive.py 1
```

Tests persona #1 (Tech-Junior-Backend) and displays:
- Persona profile and quiz responses
- API request payload
- Full response from backend
- Response time
- Schema validation results
- Interview readiness assessment
- What learner would see (all sections)

### Test All 12 Personas

```bash
python test_personas_comprehensive.py all
```

Runs all 12 personas sequentially with 2-second delays between requests:
- Displays each persona result
- Generates summary table at the end
- Shows overall test statistics

### Get Help

```bash
python test_personas_comprehensive.py --help
```

Displays full documentation and usage instructions.

### Test Default (Persona 1)

```bash
python test_personas_comprehensive.py
```

If no argument provided, defaults to testing Persona 1.

---

## 12 Personas Included

### TECH PROFESSIONALS (1-6)

| # | Name | Background | Experience | Interview Readiness | Timeline |
|---|---|---|---|---|---|
| 1 | Tech-Junior-Backend | Service Company | 0-2 yrs | 55-60% | 6-12 mo |
| 2 | Tech-Mid-Product | Product Company | 3-5 yrs | 70-75% | 3-6 mo |
| 3 | Tech-Senior-Specialist | DevOps Expert | 8+ yrs | 68-72% | 6-9 mo |
| 4 | Tech-Mid-Service | Service Company | 2-3 yrs | 58-63% | 6-12 mo |
| 5 | Tech-QA-Pivoting | QA/Testing | 3-5 yrs | 62-66% | 6-9 mo |
| 6 | Tech-Early-Explorer | Product Company | 0-2 yrs | 48-52% | 12-18 mo |

### NON-TECH PROFESSIONALS (7-12)

| # | Name | Background | Steps Taken | Interview Readiness | Timeline |
|---|---|---|---|---|---|
| 7 | Non-Tech-Bootcamp | Career Switcher | Bootcamp | 65-70% | 3-6 mo |
| 8 | Non-Tech-Ops | Operations/Consulting | Online Course | 60-65% | 12-18 mo |
| 9 | Non-Tech-Fresh-Grad | Fresh Graduate | Exploring | 35-40% | 12-24 mo |
| 10 | Non-Tech-Designer | Design Professional | Self-Learning | 62-67% | 6-12 mo |
| 11 | Non-Tech-Sales | Sales/Marketing | Built Projects | 48-53% | 18-24 mo |
| 12 | Non-Tech-Finance | Finance Professional | Bootcamp | 68-72% | 3-9 mo |

---

## Sample Output

### Single Persona Test

```
================================================================================
                     Persona #1: Tech-Junior-Backend
================================================================================

Description: Early-career backend engineer at service company, learning-focused, startup-bound
Background: TECH

Quiz Responses
──────────────────────
  currentRole........................ swe-service
  experience......................... 0-2
  currentSkill....................... database
  primaryGoal........................ better-company
  targetRole......................... backend-sde
  ...

Building Request
─────────────────
✓ Request payload built successfully
  Background: tech
  Fields: 10 quiz responses

Calling Backend API
──────────────────────
ℹ Endpoint: http://localhost:8000/career-profile-tool/api/evaluate
✓ API request successful (2.34s)

API Response: Profile Evaluation
────────────────────────────────────

Profile Strength:
  Score: 56% - Good
  Notes: You have solid backend fundamentals but need more practical experience...

Current Profile:
  Title: Your Current Profile
  Summary: You're an early-career backend engineer at a service company...

Skill Analysis:
  Strengths:
    • Database optimization and SQL
    • REST API design
    • Server-side development
  Areas to Develop:
    • System design at scale
    • Full-stack development
    • DevOps practices

Interview Readiness:
  Technical: 57%
  HR/Behavioral: 58%
  Notes: You have the fundamentals but need more algorithm practice...

Peer Comparison:
  Percentile: 52% (Average)
  Description: Early-career engineers at startups with 0-2 years experience

Success Likelihood:
  Score: 56% - Good
  Label: Good likelihood of success within 6-12 months

Quick Wins (Top 3):
  1. Master System Design Patterns
     Practice designing scalable systems at 10K+ user scale...
  2. Build Open Source Presence
     Contribute to 2-3 open source projects in next 3 months...
  3. Practice LeetCode Medium Problems
     Solve 50+ medium difficulty problems in next 6 weeks...

Job Opportunities (Top 3):
  1. Senior Backend Engineer at Razorpay - Payment systems expertise
  2. Backend Engineer at Swiggy - Microservices and scalability
  3. DevOps Engineer at Zomato - Infrastructure and cloud platforms

Recommended Roles:
  • Backend Engineer at Startups (Junior)
    Timeline: 6-9 months
    Key Gap: System design knowledge
  • Full-Stack Engineer (Mid)
    Timeline: 9-12 months
    Key Gap: Frontend development
  • Database Specialist (Junior)
    Timeline: 3-6 months
    Key Gap: Advanced database patterns

Test Results
─────────────────
Response Time: 2.34s
✓ Response time is acceptable
✓ Response schema validation PASSED

Interview Readiness:
  Actual: 57%
  Expected Range: 55-60%
✓ Interview readiness is within expected range
```

### All Personas Summary

```
================================================================================
                              Test Summary
================================================================================

#   Persona                             IR%    Response      Valid
----------------------------------------------------------------------
1   Tech-Junior-Backend                 57%    2.34s         ✓
2   Tech-Mid-Product                    72%    2.45s         ✓
3   Tech-Senior-Specialist              69%    2.56s         ✓
4   Tech-Mid-Service                    61%    2.41s         ✓
5   Tech-QA-Pivoting                    64%    2.39s         ✓
6   Tech-Early-Explorer                 50%    2.33s         ✓
7   Non-Tech-Bootcamp                   67%    2.52s         ✓
8   Non-Tech-Ops                        63%    2.44s         ✓
9   Non-Tech-Fresh-Grad                 38%    2.38s         ✓
10  Non-Tech-Designer                   65%    2.47s         ✓
11  Non-Tech-Sales                      51%    2.40s         ✓
12  Non-Tech-Finance                    70%    2.43s         ✓

Summary Statistics
──────────────────────
Total Personas: 12
Successful Requests: 12/12
Valid Responses: 12/12
✓ All tests completed successfully!
```

---

## What Gets Tested

### 1. API Request Building
- Validates quiz response mapping for both tech and non-tech users
- Ensures all required fields are present
- Converts persona data to correct API format

### 2. API Response Validation
Checks that the response includes:
- ✓ `profile_evaluation` object
- ✓ `profile_strength_score` (0-100)
- ✓ `profile_strength_status` (Excellent/Good/Average/Needs Improvement)
- ✓ `current_profile` with summary and stats
- ✓ `skill_analysis` with strengths and areas to develop
- ✓ `interview_readiness` with technical and HR percentages
- ✓ `peer_comparison` with percentile and context
- ✓ `success_likelihood` with assessment
- ✓ `quick_wins` (3-5 items)
- ✓ `opportunities_you_qualify_for` (recommended jobs)
- ✓ `recommended_roles_based_on_interests` (with timelines)

### 3. Backend Logic
Verifies the backend calculates:
- Independent profile strength scores
- Independent interview readiness scores
- Appropriate quick wins for persona
- Relevant job opportunities in Indian market
- Realistic career timelines
- Peer comparisons with context

### 4. Response Consistency
- Same request always produces same response (checks caching)
- Can run multiple times to verify cache hits
- Response time typically 2-3 seconds (or instant for cache hits)

### 5. Learner Experience
Displays exactly what the learner sees:
- Profile evaluation result
- Interview readiness assessment
- Recommended roles and timelines
- Quick wins to focus on
- Peer comparison context

---

## Expected Interview Readiness Ranges

Each persona has expected interview readiness ranges. The script validates these:

**Tech Professionals:**
- Junior (0-2 yrs): 48-60%
- Mid (2-5 yrs): 58-72%
- Senior (5+ yrs): 68-75%

**Non-Tech Career Switchers:**
- Fresh/Exploring: 35-40%
- Learning phase: 48-65%
- Bootcamp trained: 65-72%
- Senior background: 60-72%

---

## Debugging Failed Tests

### API Not Responding
```bash
# Check if backend is running
curl http://localhost:8000/career-profile-tool/api/health

# Check Docker containers
docker compose ps

# View backend logs
docker compose logs backend
```

### Database Connection Issues
```bash
# Check PostgreSQL
docker compose logs postgres

# Verify database exists
docker compose exec postgres psql -U postgres -l

# Check cache table
docker compose exec postgres psql -U postgres -d profile_cache -c "SELECT COUNT(*) FROM response_cache;"
```

### Schema Validation Failures
- Check that OpenAI is returning valid structured output
- Verify `OPENAI_API_KEY` is set and valid
- Check OpenAI API account has no rate limiting
- Review response structure in `backend/src/models/models.py`

### Cache Issues
- First run will be slow (OpenAI call)
- Subsequent runs with same persona should be fast (cache hit)
- If cache not working: `docker compose down -v && docker compose up --build`

---

## Extending the Script

### Add New Persona

```python
PERSONAS[13] = {
    "name": "Your-New-Persona",
    "description": "Description of this persona",
    "background": "tech"  # or "non-tech"
    "quiz_responses": {
        # Add all quiz field responses here
        "currentRole": "swe-product",
        # ... other fields
    },
    "expected_interview_readiness": (65, 70),
    "expected_timeline_months": (6, 9),
}
```

### Add Custom Validation

Add checks to `validate_response_schema()` to verify persona-specific logic.

### Save Results to File

Modify the script to save test results to JSON for further analysis:

```python
import json

# Add at end of main()
with open("test_results.json", "w") as f:
    json.dump(results, f, indent=2, default=str)
```

---

## Performance Metrics

Typical metrics when running all 12 personas:

| Metric | Value | Notes |
|--------|-------|-------|
| Total Time | 40-50 seconds | Includes 2s delays between requests |
| Per Request | 2-3 seconds | First persona slower (no cache) |
| Cache Hit | < 0.5 seconds | If database cache working |
| Success Rate | 100% | All personas should pass |
| Validation Pass Rate | 100% | All responses should be valid |

---

## Integration with CI/CD

Add to your CI/CD pipeline to test before deployments:

```bash
#!/bin/bash
set -e

# Start services
docker compose up -d --build

# Wait for services
sleep 10

# Run persona tests
python test_personas_comprehensive.py all

# Check results
if [ $? -eq 0 ]; then
    echo "✓ All persona tests passed"
else
    echo "✗ Persona tests failed"
    docker compose logs
    exit 1
fi

# Cleanup
docker compose down
```

---

## Related Files

- **[PERSONAS.md](PERSONAS.md)** - Complete persona definitions with context
- **[QUIZ_QUESTIONS_AND_OPTIONS.md](QUIZ_QUESTIONS_AND_OPTIONS.md)** - All quiz questions and answer options
- **[backend/src/api/main.py](backend/src/api/main.py)** - API endpoint implementation
- **[backend/src/services/run_poc.py](backend/src/services/run_poc.py)** - Main evaluation service
- **[backend/src/models/models.py](backend/src/models/models.py)** - Response schema

---

## Troubleshooting

### ModuleNotFoundError: No module named 'requests'

```bash
pip install requests
```

### Connection refused (localhost:8000)

```bash
# Ensure backend is running
docker compose up --build

# Test connectivity
curl http://localhost:8000/career-profile-tool/api/health
```

### Response times very high (> 10s)

- Backend might be slow
- OpenAI API might be rate-limited
- Database query might be slow
- Check `docker compose logs backend`

### Interview readiness outside expected range

- Possible regression in scoring logic
- Check `backend/src/services/interview_readiness_logic.py`
- Verify backend calculations are correct
- Run test again (cache might be stale)

---

## Success Criteria

A successful test run should:

✓ Connect to backend API
✓ Get HTTP 200 response
✓ Receive valid response schema
✓ All required fields present
✓ Scores in expected ranges (0-100)
✓ Response time < 10 seconds
✓ Interview readiness in persona's expected range
✓ At least 3 quick wins
✓ At least 5 job opportunities
✓ At least 1-3 recommended roles

---

## Support

For issues or questions:
1. Check logs: `docker compose logs -f backend`
2. Review response schema: `backend/src/models/models.py`
3. Check persona definitions: `PERSONAS.md`
4. Review quiz structure: `QUIZ_QUESTIONS_AND_OPTIONS.md`
