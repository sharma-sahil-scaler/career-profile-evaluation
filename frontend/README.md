# Free Profile Evaluation

A comprehensive web application for evaluating tech career profiles, designed to help both career switchers and existing tech professionals assess their readiness for target roles.

## Features

### Core Flow
1. **Intake Step – Quiz**
   - Background selection (Non-tech/Career Switcher vs Tech Professional)
   - Manual step-by-step navigation through quiz questions
   - Branching logic with 7 tailored questions for each path
   - Stateful navigation with progress tracking

2. **Goal & Requirement Identification**
   - Flexible form with at least one required field
   - Multiple goal types: upskilling, career transition, higher salary
   - Target company tier
   - **Topics of Interest**: 15 trending tech topics with multi-select capability:
     - AI/ML, Web Development, Mobile Development, Data Science, Cybersecurity
     - Cloud Computing, Blockchain, Game Development, IoT, AR/VR
     - Fintech, Health Tech, EdTech, E-commerce, Automation

3. **Profile Evaluation Results**
   - **Profile Strength Score** (0–100% readiness)
   - **Skill Match vs Skill Gap** analysis
   - **Tool Recommendations** for target roles
   - **Experience Benchmarking** against typical candidates
   - **Interview Readiness Snapshot** (technical, HR)
   - **Peer Comparison** percentile ranking
   - **Likelihood of Success Meter** with visual gauge
   - **Top 3 Quick Wins** actionable steps
   - **Missed Opportunities** simulation
   - **Recommended Roles** based on selected topics of interest
   - **Gamified Badges** system

## Technology Stack

- **Frontend**: React 18 with React Router
- **Styling**: Styled Components for component-based styling
- **State Management**: React Context API with useReducer
- **Animations**: Framer Motion for smooth transitions
- **Build Tool**: Create React App

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd free-profile-evaluation
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Build for Production

```bash
npm run build
```

This builds the app for production to the `build` folder.

## Project Structure

```
src/
├── components/
│   ├── LandingPage.js          # Landing page with start button
│   ├── QuizPage.js            # Main quiz container with routing
│   ├── GoalsPage.js           # Goals and requirements form
│   ├── ResultsPage.js         # Results display container
│   ├── quiz/                  # Quiz-specific components
│   │   ├── BackgroundSelection.js
│   │   ├── NonTechQuiz.js
│   │   ├── TechQuiz.js
│   │   └── QuizQuestion.js
│   └── results/               # Result card components
│       ├── ProfileStrengthCard.js
│       ├── SkillAnalysisCard.js
│       ├── ToolRecommendationsCard.js
│       ├── ExperienceBenchmarkCard.js
│       ├── SalaryReadinessCard.js
│       ├── InterviewReadinessCard.js
│       ├── PeerComparisonCard.js
│       ├── SuccessLikelihoodCard.js
│       ├── QuickWinsCard.js
│       ├── MissedOpportunitiesCard.js
│       ├── LearningResourceCard.js
│       ├── ResumeScoreCard.js
│       └── BadgesCard.js
├── context/
│   └── ProfileContext.js      # State management
├── utils/
│   └── evaluationLogic.js     # Rule-based evaluation algorithms
├── App.js                     # Main app component with routing
├── index.js                   # Entry point
└── index.css                  # Global styles
```

## Evaluation Logic

The application uses rule-based logic to compute various metrics:

- **Profile Strength**: Weighted combination of experience, skills, and commitment
- **Skill Analysis**: Based on target role and current capabilities
- **Salary Readiness**: Market positioning analysis
- **Interview Readiness**: Resume, technical, and behavioral assessment
- **Peer Comparison**: Percentile ranking against similar profiles

## Customization

### Adding New Questions
1. Update the quiz components in `src/components/quiz/`
2. Modify the evaluation logic in `src/utils/evaluationLogic.js`
3. Update the context to handle new response types

### Modifying Evaluation Rules
Edit `src/utils/evaluationLogic.js` to adjust:
- Scoring algorithms
- Skill assessments
- Recommendation logic
- Badge criteria

### Styling Changes
- Global styles: `src/index.css`
- Component styles: Individual styled-components in each component file
- Theme colors: Update CSS variables or styled-component themes

## Future Enhancements

- **Dynamic Evaluation**: Replace static scoring with ML-based assessment
- **User Accounts**: Persistent profiles and progress tracking
- **Advanced Analytics**: Detailed reporting and trend analysis
- **Integration**: Connect with job boards and learning platforms
- **Mobile App**: React Native version for mobile devices

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open an issue on GitHub or contact the development team.
# freeprofileevaluation
# freeprofileevaluation
