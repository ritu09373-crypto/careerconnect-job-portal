# CareerConnect

Full-stack job portal for job seekers and recruiters — browse roles, apply with a resume, manage hiring, and optionally score fit with AI.

## Stack

- **Frontend:** React + Vite + React Router
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt

## Quick start

### 1. Prerequisites

- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) **or** update `server/.env` with your Atlas URI

### 2. Backend

```bash
cd server
npm install
npm run seed
npm run dev
```

API runs at `http://localhost:5000`.

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Demo accounts (after seed)

| Role | Email | Password |
|------|-------|----------|
| Recruiter | `recruiter@careerconnect.dev` | `password123` |
| Job seeker | `seeker@careerconnect.dev` | `password123` |

## Features

- Register / login with role-based access (job seeker vs recruiter)
- Browse and filter jobs
- Apply with PDF resume + cover letter
- Track applications
- Recruiter dashboard: create / edit / delete jobs, update candidate status
- Profile management (skills power AI matching)
- Job-match analysis on job details (built-in skill scoring, optional OpenAI via `OPENAI_API_KEY`)

## Environment

See `server/.env.example`. Important keys:

- `MONGO_URI`
- `JWT_SECRET`
- `CORS_ORIGIN`
- `PUBLIC_URL` (resume links)
- `OPENAI_API_KEY` / `OPENAI_MODEL` (optional)
- SMTP vars (optional email notifications)
