# Deployment Guide — Ecole Saint Hannibal

This guide walks you through pushing the code to GitHub and hosting the site on Render (free tier).
No coding knowledge is required — just follow each step in order.

---

## What you will end up with

| Service | URL (yours will differ) | Purpose |
|---|---|---|
| **Frontend** | `https://esh-frontend.onrender.com` | The public school website |
| **API** | `https://esh-api.onrender.com` | The backend (data, admin) |
| **Database** | Managed by Render | PostgreSQL — your data |

---

## Part 1 — Push to GitHub

### Step 1 — Create a GitHub account (if you don't have one)
Go to **https://github.com** → click **Sign up** → follow the prompts.

### Step 2 — Create a new repository
1. Click the **+** icon (top right) → **New repository**
2. Name it: `ecole-saint-hannibal` (or whatever you prefer)
3. Set it to **Private** (recommended — keeps your code private)
4. Do **not** add a README or `.gitignore` (the project already has them)
5. Click **Create repository**
6. Copy the repository URL shown — it looks like:
   `https://github.com/YOUR_USERNAME/ecole-saint-hannibal.git`

### Step 3 — Push from Replit
In the Replit Shell (click **Shell** tab at the bottom), run these commands one at a time:

```bash
git remote add origin https://github.com/YOUR_USERNAME/ecole-saint-hannibal.git
git branch -M main
git push -u origin main
```

When prompted, enter your GitHub username and a **Personal Access Token** (not your password).

> **How to get a Personal Access Token:**
> GitHub → Settings → Developer Settings → Personal access tokens → Tokens (classic)
> → Generate new token → tick **repo** → Generate → copy the token immediately.

---

## Part 2 — Deploy on Render

### Step 4 — Create a Render account
Go to **https://render.com** → click **Get Started** → sign up (you can use your GitHub account).

### Step 5 — Deploy using Blueprint (one click for all services)
1. In Render dashboard, click **New** → **Blueprint**
2. Connect your GitHub account if prompted
3. Select the `ecole-saint-hannibal` repository
4. Render will detect the `render.yaml` file automatically
5. Click **Apply** — Render will create:
   - A PostgreSQL database (`esh-db`)
   - The API server (`esh-api`)
   - The frontend static site (`esh-frontend`)

### Step 6 — Set the environment variables

After the Blueprint creates the services, you need to link them together.

#### 6a — Note on auto-generated secrets
Render Blueprint automatically generates secure random values for `JWT_SECRET`
(used to sign admin login tokens). You do not need to set this yourself — Render
handles it. **Never copy or share this value.**

#### 6b — Set FRONTEND_URL on the API service
1. Go to **esh-api** → **Environment**
2. Find `FRONTEND_URL` (it shows as "sync: false — fill in manually")
3. Set its value to your frontend URL, e.g.: `https://esh-frontend.onrender.com`
4. Click **Save Changes** → the API will redeploy automatically

#### 6c — Set VITE_API_BASE_URL on the frontend
1. Go to **esh-frontend** → **Environment**
2. Find `VITE_API_BASE_URL`
3. Set its value to your API URL, e.g.: `https://esh-api.onrender.com`
4. Click **Save Changes** → the frontend will rebuild automatically

> **Tip:** Find the exact URLs in the Render dashboard — each service shows its URL at the top
> of its page once deployed.

### Step 7 — Seed the database (first time only)
The database starts empty. You need to run the seed script once to create your admin account
and initial data.

1. In Render dashboard, go to **esh-api** → **Shell** (or use the Replit Shell)
2. Run:
   ```bash
   pnpm --filter @workspace/scripts run seed
   ```
3. This creates the admin user:
   - **Email:** `admin@ecolesainthannibal.rw`
   - **Password:** `ESH@Admin2025!`

> **Change the admin password immediately** after first login via Admin → Users.

---

## Part 3 — Access your live site

| What | Where |
|---|---|
| Public website | `https://esh-frontend.onrender.com` |
| Admin login | `https://esh-frontend.onrender.com/admin/login` |

---

## Updating content (day-to-day)

The owner **does not need to touch any code** to update the website content.

Simply log in to the admin panel and use the CMS:

| Section | What you can manage |
|---|---|
| **Slides** | Homepage hero slider images and text |
| **Actualités** | News articles (create, edit, delete, publish/unpublish) |
| **Événements** | School events |
| **Galerie** | Photo albums and photos |
| **Personnel** | Staff directory and photos |
| **Classes** | Class pages (Nursery N1–N3, Primary P1–P6) |
| **Ressources** | Downloadable documents |
| **Messages** | Contact form submissions from parents |
| **Paramètres** | School name, phone, address, social media links, announcement banner |

---

## Updating the website code (for developers)

When a developer makes code changes:

1. Push to GitHub (the same `main` branch)
2. Render detects the push and automatically redeploys both services

No manual steps needed — Render's auto-deploy handles it.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| Site shows a blank page | Check the `VITE_API_BASE_URL` is set correctly on the frontend service |
| Admin login fails | Make sure the database seed ran (Step 7) |
| API returns errors | Check `DATABASE_URL` is linked — go to esh-api → Environment |
| Free tier goes to sleep | Render free tier suspends after 15 min of inactivity; first load may take 30–60 seconds |
| Need a custom domain | Render dashboard → your service → Settings → Custom Domains |

---

## Free tier limits (Render)

- **Web services:** Spin down after 15 minutes of inactivity (first request is slow)
- **PostgreSQL:** 1 GB storage, 90-day free period — upgrade to paid ($7/month) before it expires
- **Static sites:** Always free, no limits

To avoid the sleep delay, upgrade the API service to the **Starter** plan ($7/month) in Render dashboard.

---

*Last updated: May 2026*
