# DAS Frontend Setup

React SPA for the DentalCare Dentist Appointment System. The frontend talks only to the Express backend API; it does not call Supabase directly.

## Requirements

- Node.js 18 or newer
- npm
- DAS backend running locally

## Install

```bash
cd das-frontend
npm install
```

## Environment

Create a local `.env` file from the example:

```bash
copy .env.example .env
```

Configure:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=DentalCare
```

If your backend runs on another port, update `VITE_API_URL`.

## Run

Development server:

```bash
npm run dev
```

Default Vite URL:

```text
http://localhost:5173
```

## Current Routes

Public pages:

```text
/                  Landing page
/services          Dental services
/consultation      Consultation form
/login             Patient login
/staff/login       Staff login
/forgot-password   Forgot password and OTP reset
```

Patient pages:

```text
/patient/dashboard
```

Staff placeholders:

```text
/receptionist/dashboard
/dentist/dashboard
/owner/dashboard
/admin/dashboard
```

Protected routes use `AuthContext` and `ProtectedRoute`. Users are redirected based on their role after login.

## Login Test Accounts

Patient:

```text
phone: 0901000001
password: Test12345
```

Admin:

```text
username: admin
password: Admin12345
```

The staff login page is used by `receptionist`, `dentist`, `owner`, and `admin` roles.

## Assets

Project images live in:

```text
src/assets/
```

Images imported by components should be placed there, for example:

```jsx
import heroLogin from "../../assets/hero-login.png";
```

Use `public/` only for files that must be served by a fixed URL and are not imported by React.

## Styling

The app uses pure CSS with BEM naming and CSS custom properties from:

```text
src/styles/base/_variables.css
```

Global CSS entry:

```text
src/styles/main.css
```

Component and page CSS files are colocated with their JSX files.

## API Layer

All API calls go through:

```text
src/services/api.js
```

Auth-specific API calls live in:

```text
src/services/auth.service.js
```

Components should not call `fetch` directly.
