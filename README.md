# BlogSite (MERN)

BlogSite is a blog app built with the MERN stack (MongoDB, Express, React, Node). It lets users create and read posts, organize them by category, and includes an admin portal for managing content and users.

The editor for writing blogs works a bit like Notion, so writing posts with blocks, headings, lists and tables is easier. The backend is hosted on Railway and the frontend is published to GitHub Pages.

## What it does
- Create, edit, and read blog posts
- Notion-like editor for richer post composition
- User authentication (signup/login)
- Categories and filtered views
- Admin panel to manage users and blogs
- Image upload via Cloudinary

## Tech stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Auth: JSON Web Tokens (JWT)
- Hosting: Frontend on GitHub Pages, Backend on Render

## Quick start (dev)
To run the backend and frontend locally for development.

1. Backend

```bash
cd backend
# create .env file
npm install
npm start
```

2. Frontend

```bash
cd frontend
# create env file for dev or production as needed
# e.g. .env.development or .env.production
# set VITE_BACKEND_API_URL to backend URL
npm install
npm run dev
```

## Deploying the frontend (Github Pages)
- The frontend uses `gh-pages`. Run `npm run deploy` from the `frontend` folder to build and publish the `dist` folder to the `gh-pages` branch. `VITE_BACKEND_API_URL` must be set for production.

## Live demo
Live site: https://labib-islam.github.io/BlogSite_MERN/

## Environment variables
Backend (create `backend/.env`) — required values:

- `DB_CONNECTION` — MongoDB connection string (Mongo URI)
- `JWT_SECRET` — secret used to sign JSON Web Tokens
- `PORT` — optional, port for the backend server (default used if not set)
- `CLOUDINARY_API_KEY` — Cloudinary API key (if using image uploads)
- `CLOUDINARY_API_SECRET` — Cloudinary API secret (if using image uploads)
- `CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name (if using image uploads)

Frontend (create `frontend/.env.production` for production builds)

- `VITE_BACKEND_API_URL` — the base URL for the backend API (this value is read at build time).

## Demo credentials
To quickly login and explore the features

Demo Email: demouser@gmail.com
Demo Password: demouser123

