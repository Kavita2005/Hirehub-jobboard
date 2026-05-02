# HireHub — Job Board

A complete, production-ready job board application built with **React + Node.js + Express + MongoDB**.

## 📌 About HireHub

HireHub is a modern, full-stack job board platform designed to bridge the gap between talented job seekers and forward-thinking employers. Whether you're a professional looking for your next career opportunity or a company searching for top talent, HireHub provides a seamless, intuitive experience from discovery to application.

Built with scalability and performance in mind, HireHub offers a clean and responsive interface powered by a robust REST API backend. Employers can effortlessly post and manage job listings, while job seekers can search, filter, and save opportunities tailored to their skills and preferences — all within a secure, role-based authentication system.

HireHub is not just a job board — it's a complete hiring ecosystem built for the modern workforce.

## 🌐 Live Demo

👉 **[https://hirehub-jobboard-sq3o.vercel.app/](https://hirehub-jobboard-sq3o.vercel.app/)**

---

## 🚀 Features

- **Authentication** — JWT-based signup/login with role-based access (Job Seeker & Employer)
- **Job Listings** — Browse, filter, and search jobs by title, category, type, and location
- **Post Jobs** — Employers can create, manage, and delete job listings
- **Save Jobs** — Job seekers can bookmark jobs to their dashboard
- **Dashboard** — Personalized dashboard for both employers and job seekers
- **Pagination** — Efficient server-side pagination
- **Responsive** — Mobile-first, fully responsive UI

---

## 🗂 Project Structure

```
jobboard/
├── backend/               # Node.js + Express API
│   ├── models/
│   │   ├── User.js        # User schema (bcrypt hashed passwords)
│   │   └── Job.js         # Job schema with text search index
│   ├── routes/
│   │   ├── auth.js        # /api/auth — signup, login, me
│   │   └── jobs.js        # /api/jobs — CRUD + filters
│   ├── middleware/
│   │   └── auth.js        # JWT protect middleware
│   ├── server.js          # Express app entry point
│   └── package.json
│
├── frontend/              # React + Vite app
│   ├── src/
│   │   ├── components/    # Navbar, JobCard
│   │   ├── context/       # AuthContext (global user state)
│   │   ├── hooks/         # Axios API instance
│   │   ├── pages/         # Home, Jobs, JobDetail, Login, Signup, PostJob, Dashboard
│   │   ├── App.jsx        # Routes + layout
│   │   └── index.css      # Design system + global styles
│   ├── index.html
│   ├── vite.config.js
│   └── vercel.json        # SPA routing fix for Vercel
│
├── render.yaml            # Render.com deploy config
└── README.md
```

---

## ⚡ Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)

### 1. Clone & Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — add your MONGODB_URI and JWT_SECRET
npm run dev   # runs on http://localhost:5000
```

### 2. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api (already set)
npm run dev   # runs on http://localhost:5173
```

---

## 🌐 Deployment

### Backend → Render.com

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo, set **Root Directory** to `backend`
4. Set environment variables:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — any strong random string (e.g. `openssl rand -base64 32`)
   - `CLIENT_URL` — your Vercel frontend URL (add after step below)
5. Deploy!

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo, set **Root Directory** to `frontend`
3. Set environment variable:
   - `VITE_API_URL` — your Render backend URL + `/api` (e.g. `https://jobboard-api.onrender.com/api`)
4. Deploy!

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Register new user |
| POST | `/api/auth/login` | No | Login, get JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/jobs` | No | List jobs (filters, pagination) |
| GET | `/api/jobs/:id` | No | Single job detail |
| POST | `/api/jobs` | Employer | Create job listing |
| PUT | `/api/jobs/:id` | Owner | Update job |
| DELETE | `/api/jobs/:id` | Owner | Soft delete job |
| GET | `/api/jobs/user/my-jobs` | Employer | My posted jobs |
| POST | `/api/jobs/:id/save` | Yes | Toggle save job |

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcryptjs |
| Validation | express-validator |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📝 Key Design Decisions

- **JWT in localStorage** — Simple for demo; for production use httpOnly cookies
- **Soft delete** — Jobs are deactivated (`isActive: false`), not permanently deleted
- **Text indexes** — MongoDB text indexes enable full-text job search
- **Role-based access** — Employer vs. job seeker roles enforced on both frontend and backend
- **Password hashing** — bcryptjs with salt rounds of 12 in a pre-save hook
