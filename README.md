# Hirely — AI-Powered Job Portal & Hiring Platform

A full-stack job portal built on the MERN stack (MongoDB, Express, React, Node.js). Candidates discover and apply to roles with AI-ready match scoring; recruiters manage companies, publish job listings, and track applicants — all through a modern, responsive interface.

---

## Features

### For everyone (no login required)
- Browse, search, and filter jobs by keyword, location, job type, work mode, and category
- Browse by category and see the latest openings right from the home page
- View full job details, including company info

### For candidates
- Register/login with JWT auth (email verification flow included, off by default for easy local testing)
- Profile with headline, bio, skills, and a resume upload (PDF)
- Apply to jobs with one click (resume required on file)
- Track application status under "Applied Jobs"
- Save/bookmark jobs for later

### For recruiters
- Create and manage one or more companies
- Post, edit, and delete job listings (title, description, skills, salary range, location, job type, category, linked company)
- Dashboard with stats: open postings, total views, applicants
- (Planned) Kanban-style applicant pipeline, AI resume matching, real-time chat

### Platform
- Dark/light theme toggle (persisted per browser)
- Responsive, modern UI with Tailwind CSS + Framer Motion
- Footer with Privacy Policy / Terms of Service pages
- One-time-purchase pricing page (display only — no payment gateway wired up)

---

## Tech stack

**Frontend** — `/client`
- React 19 + Vite
- Tailwind CSS v4
- React Router, TanStack Query (React Query)
- React Hook Form + Zod
- Framer Motion, Lucide icons, react-hot-toast

**Backend** — `/server`
- Node.js + Express
- MongoDB + Mongoose
- JWT auth (httpOnly cookie + bearer token), bcrypt
- Multer for uploads, Cloudinary for resume storage (falls back to local disk if not configured)
- Nodemailer for verification/reset emails (falls back to console logging in dev if SMTP isn't set up)
- Socket.io (wired up, reserved for real-time features)

---

## Project structure

```
Job Portal/
├── client/
│   └── src/
│       ├── pages/          # route-level screens (auth, candidate, recruiter, legal)
│       ├── components/     # shared UI (ui/, layout/, jobs/)
│       ├── context/        # AuthContext, ThemeContext
│       ├── hooks/          # e.g. useSavedJobs
│       └── lib/            # api client, formatting helpers
└── server/
    ├── models/             # User, Job, Company, Application
    ├── controllers/        # route logic
    ├── routes/             # Express routers
    ├── middleware/         # auth, upload, error handling
    ├── services/           # email, file upload
    └── utils/              # helpers + seed.js
```

---

## Getting started

### Prerequisites
- Node.js 18+
- A MongoDB database (local or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### 1. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Fill in `server/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
CLIENT_URL=http://localhost:5173
```

Everything else in `.env.example` is optional — SMTP, Cloudinary, and AI keys all have graceful fallbacks for local development (see comments in the file).

```bash
npm run dev
```

Backend runs at `http://localhost:5000`.

Optionally, seed some demo data (recruiters, companies, and jobs) so the UI isn't empty:

```bash
npm run seed
```

### 2. Frontend setup

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Frontend runs at `http://localhost:5173` (Vite will pick another port if that one's busy — the dev server proxies `/api` to the backend either way). Leave `VITE_API_URL` blank in `client/.env` for local dev; set it to your deployed backend URL only when building for production.

### 3. Open the app

Visit the frontend URL printed in your terminal. Register as either a candidate or a recruiter to get started.

---

## Available scripts

**Backend** (`/server`)
- `npm run dev` — start with nodemon
- `npm start` — start without nodemon
- `npm run seed` — populate demo recruiters, companies, and jobs

**Frontend** (`/client`)
- `npm run dev` — start the Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the production build

---

## Deployment

- **Backend** → Render (or Railway): root directory `server`, build `npm install`, start `npm start`. Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and the Cloudinary/SMTP vars as environment variables.
- **Frontend** → Vercel: root directory `client`, framework preset Vite. Set `VITE_API_URL` to the deployed backend's `/api` URL.
- After both are live, update the backend's `CLIENT_URL` to the deployed frontend URL and redeploy so CORS and cookies work correctly.

## Notes

- Email verification is **off by default** (`REQUIRE_EMAIL_VERIFICATION=false` in `.env`) so you can register and log in immediately without setting up SMTP. Flip it to `true` once real SMTP credentials are configured.
- Job browsing (`GET /api/jobs`, `GET /api/jobs/:id`) is public — only applying and saving jobs require an account.
- File uploads use Cloudinary when `CLOUDINARY_*` env vars are set; otherwise they're saved to `server/uploads/` on disk.
