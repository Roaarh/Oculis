# Oculis – Turn Your Dream Into a Game‑Like Journey

Oculis is a full‑stack web application that transforms a user’s dream or main life goal into a structured, gamified journey. Users describe their dream and answer questions about their life situation; the AI then breaks this goal into personalized levels and tasks stored in a database.

The interface is designed with a dreamy, game‑like aesthetic, guiding users through missions and achievements as they progress toward their goals, making personal growth feel immersive and motivating.

## Project Structure

- `oculis/` – React + Vite frontend (UI, routing, API calls)
- `Backend/` – Node.js + Express API server
- `MySQL` – Relational database storing users, answers, and generated tasks

## Tech Stack

- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express
- **Database:** MySQL
- **AI:** Google Gemini (or your chosen AI API)

## Architecture Highlights

- Frontend consumes REST APIs from the Node.js backend using fetch/axios
- Backend validates user input and orchestrates calls to the AI service
- MySQL stores users, answers, generated tasks, and progress data
- Clear separation between frontend (`oculis/`) and backend (`Backend/`)

## Key Features

- AI‑generated levels and tasks based on the user’s dream and life context
- Dreamy, game‑like UI with animated orbital levels around a central “sun”
- Personalized onboarding with username and theme selection
- Motivational AI chat to support and encourage the user
- Authenticated accounts with saved progress and profile data
- Admin section to manage users, content, and monitor overall activity
- Progress visualization so users can track how far they’ve gone in their journey
## My Role

I designed and built Oculis as a solo developer. I was responsible for:

- Defining the concept, user flow, UI/UX, and admin flows
- Implementing the React + Vite frontend (user side and admin side)
- Building the Node.js + Express backend and REST APIs
- Designing and configuring the MySQL database
- Integrating the AI service for level/task generation and motivational chat
- Implementing the admin section for managing users and application data
- Connecting frontend and backend, handling all data flow and state
- Setting up the project structure, GitHub repository, and deployment pipeline

## TODO / Future Improvements

- Deploy the backend and MySQL database to a cloud provider
- Add email verification and password reset for user accounts
- Refine AI prompts for more detailed and adaptive task generation
- Add analytics for completion rates, engagement, and user behavior
- Implement localization and support for multiple languages
- Add more animations and micro‑interactions to enhance the dreamy feel

## How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Roaarh/Oculis.git
cd Oculis
```

### 2. Run the frontend

```bash
cd oculis
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` (or similar).

### 3. Run the backend

```bash
cd ../Backend
npm install
npm start
```

Make sure your MySQL server is running and your `.env` file is configured with the correct database credentials.

## Live Demo (Frontend Only)

When deployed, the frontend will be available at:

```text
https://roaarh.github.io/Oculis
```

> Note: The backend and database are currently running locally and are not yet deployed online.