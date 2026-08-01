# DAS Frontend

React SPA for the DentalCare Dentist Appointment System. The frontend talks only to the Express backend API; it does not call Supabase directly.

## Requirements

- Node.js 20.19 or newer
- npm
- DAS backend API

## Install

```bash
cd das-frontend
npm install
```

## Environment

Local `.env`:

```env
VITE_API_URL=https://das-backend-production-5199.up.railway.app/api
VITE_APP_NAME=DentalCare
```

`VITE_API_URL` can be changed to a local backend during development:

```env
VITE_API_URL=http://localhost:3000/api
```

## Vercel Deployment

Use these Vercel settings:

```text
Root Directory: das-frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Set these Vercel environment variables:

```env
VITE_API_URL=https://das-backend-production-5199.up.railway.app/api
VITE_APP_NAME=DentalCare
```

This project includes `vercel.json` with a rewrite to support React Router browser routes on refresh.

After Vercel deploys, copy the Vercel frontend URL and update Railway backend:

```env
FRONTEND_URL=https://your-vercel-app.vercel.app
```

Then redeploy or restart the Railway backend so CORS allows the frontend.

## Run

Development server:

```bash
npm run dev
```

Default local URL:

```text
http://localhost:5173
```

Production build:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

## Test Accounts

Patient:

```text
phone: 0900000002
password: Test12345!
```

Staff:

```text
password for all staff accounts: Test12345!
```

Staff usernames:

```text
admin
recep
owner
dentist
dentist2
dentist3
```

## Performance Notes

Routes are lazy-loaded in `src/App.jsx` so users only download page code for the route they visit. Vite also separates large vendor groups such as FullCalendar, Recharts, icons, and React into separate chunks.

The unused `axios` dependency was removed because all API calls use the shared `fetch` wrapper in:

```text
src/services/api.js
```
