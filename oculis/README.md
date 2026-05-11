# Oculis Frontend – React + Vite

This is the React + Vite frontend for **Oculis**, a web application that turns a user’s dream or main life goal into a structured, gamified journey. The frontend handles all user interaction, navigation, and visual presentation of the AI‑generated levels and tasks.

## User Flow & Screens

The Oculis frontend guides the user through a narrative, game‑like journey:

- **Intro / Splash Screen**  
  The user first sees a dreamy splash screen with the Oculis logo and a “Start” button to enter the experience.

- **Welcome & Personalization**  
  New users choose a username and select a visual theme, then continue to the main flow.

- **Authentication (Login / Sign Up)**  
  Users can create an account or log in so their data, progress, and generated tasks are stored persistently in the database.

- **Questions Page**  
  The user answers a series of questions about their life, context, and current situation. These answers are later used to personalize the AI output.

- **Dream Page (Goal Definition)**  
  The user writes down their main dream or life goal. A built‑in AI chat acts as a motivational companion, encouraging and supporting the user if they feel stuck or discouraged.

- **Generation Page**  
  The AI takes the user’s dream and answers, then transforms them into a structured journey of personalized levels and tasks.

- **Levels Page (Solar System View)**  
  The journey is visualized as a solar‑system‑like scene:  
  - A sun in the center represents the main dream.  
  - Orbits around the sun represent levels (currently 17 levels).  
  - Each orbit contains tasks, and the levels move like real orbits to reinforce the dreamy, game‑like feeling.

- **Profile Page**  
  The user can view and edit their personal information and preferences.

- **Progress Page**  
  Shows the user’s current level, completed tasks, and overall progress toward their dream.

- **Admin Section**  
  Separate admin views allow managing users and application data, giving control over the system from the frontend UI.

Additional pages and micro‑interactions support the overall feeling of being inside a dream‑like, gamified world focused on personal growth.

## Tech Stack (Frontend)

- React
- Vite
- JavaScript / TypeScript (adjust to what you use)
- CSS (or Tailwind / styled‑components – adjust to your stack)
- React Router (if you use routing)

## Project Structure (Frontend)

Typical structure inside this folder:

```text
oculis/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Route-level pages (Intro, Questions, Dream, Levels, Admin, etc.)
│   ├── hooks/           # Custom hooks (if any)
│   ├── assets/          # Images, icons, logos
│   ├── App.jsx/tsx      # Main app component and routing
│   └── main.jsx/tsx     # Entry point
├── public/              # Static assets
├── index.html
├── vite.config.js
└── package.json
```

(You can update this tree to exactly match your real folders.)

## Scripts

From this `oculis` folder:

```bash
# install dependencies
npm install

# run in development
npm run dev

# build for production
npm run build

# locally preview the production build
npm run preview
```

## Deployment

The frontend is intended to be deployed to GitHub Pages at:

```text
https://roaarh.github.io/Oculis
```

Vite is configured with a base path so assets work under `/Oculis/`:

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Oculis/',
  plugins: [react()],
})
```

When you push changes to the `main` branch, a GitHub Actions workflow (defined in `.github/workflows/deploy.yml` at the root) can build and deploy this frontend to GitHub Pages automatically.