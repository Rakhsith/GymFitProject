# GymFit – Gym Fitness Management System
 Done by : RAKHSITH SENTHUR E 23BIT079
GymFit is a 3-tier full-stack **fitness management platform** designed as a startup-level product for university software engineering projects. It uses a modern dashboard UI, Node.js/Express backend, and SQLite for persistent storage.

## Tech Stack

- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Node.js, Express.js
- Database: SQLite (file-based `gymfit.db` auto-created on first run)

## Features

- Authentication
  - User registration & login
  - Password hashing with bcrypt
  - JWT-based user-specific data isolation

- Fitness Calculations
  - BMI with classification
  - BMR (male/female)
  - Daily calorie estimation
  - Protein, carbs, fats macros

- Planning & Diet
  - Personalized veg / non-veg diet plans
  - Goal-based: weight loss, muscle gain, maintenance
  - Activity-level aware plans

- Workout Management
  - Workout CRUD (add, edit, delete)
  - Difficulty & muscle-group tagging
  - Weekly scheduler with rest day handling

- Progress Tracking
  - Weight history with date-wise entries
  - Charts using Chart.js
  - Visual trend analysis

- AI-based Virtual Assistant
  - Chat-style UI
  - Rule-based engine for:
    - Membership plans
    - Workout schedules
    - Diet recommendations
    - Gym timings & rules
    - Platform navigation
  - Logic is clearly separated to be future AI/ML-ready

- Feedback / Contact
  - Feedback form
  - Sends emails to `gymfit@gmail.com` using Node + Nodemailer
  - Messages persisted in SQLite

## Architecture

- 3-Tier
  - **Presentation layer**
    - Frontend HTML/CSS/JS
    - Backend controllers & routes
  - **Business layer**
    - Services: `authService`, `calculatorService`, `dietService`, `workoutService`, `progressService`, `assistantService`, `feedbackService`
  - **Data layer**
    - Models: `userModel`, `workoutModel`, `progressModel`, `dietModel`, `feedbackModel`
    - SQLite via `config/db.js`

- Clean separation of concerns
  - Frontend only calls REST APIs
  - Backend separates routing, controllers, services, and models
  - SQLite DB is auto-initialized with tables on first run

- RESTful APIs
  - `/api/auth`
  - `/api/calculators`
  - `/api/diet`
  - `/api/workouts`
  - `/api/progress`
  - `/api/assistant`
  - `/api/feedback`

## Folder Structure

```text
backend/
  app.js
  package.json
  config/
  models/
  services/
  controllers/
  routes/
  data/

frontend/
  *.html
  css/
  js/

database/
  gymfit.db (auto-created)
