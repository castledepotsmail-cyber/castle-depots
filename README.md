# Castle Depots - E-commerce Platform

A modern full-stack e-commerce platform built with Django REST Framework and Next.js.

## Features

- 🔐 JWT Authentication with Google OAuth
- 🛒 Shopping Cart & Wishlist
- 📦 Order Management
- 👤 User Profiles & Dashboard
- 🎨 Campaign Management
- 📱 Responsive Design
- 🔍 Product Search & Filtering

## Tech Stack

**Backend:**
- Django 5.2.8
- Django REST Framework
- PostgreSQL (Production) / SQLite (Development)
- JWT Authentication
- Gunicorn + WhiteNoise

**Frontend:**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Firebase (Google Auth)

## Deployment

### Backend (Render)

1. **Create Render Web Service:**
   - Connect GitHub repository
   - Root Directory: `server`
   - Build Command: `./build.sh`
   - Start Command: `gunicorn castle_core.wsgi --log-file -`

2. **Environment Variables (Render):**
   ```
   SECRET_KEY=your-secret-key-here
   DEBUG=False
   ALLOWED_HOSTS=your-render-app.onrender.com
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

3. **Get DATABASE_URL from Supabase:**
   - Go to [Supabase](https://supabase.com)
   - Create new project
   - Go to Settings > Database
   - Copy connection string (URI format)
   - Replace `[YOUR-PASSWORD]` with your actual password

### Frontend (Vercel)

1. **Deploy to Vercel:**
   - Connect GitHub repository
   - Root Directory: `client`
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

2. **Environment Variables (Vercel):**
   ```
   NEXT_PUBLIC_API_URL=https://your-render-app.onrender.com/api
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

## Environment Variables Setup

### Supabase Database Setup
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > Database
4. Copy the connection string
5. Use as `DATABASE_URL` in Render

### Firebase Setup (Google Auth)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project
3. Enable Authentication > Google provider
4. Get config from Project Settings > General
5. Add domain to Authorized domains in Authentication settings

### Render Setup
1. Create account at [render.com](https://render.com)
2. Create Web Service from GitHub
3. Set root directory to `server`
4. Add environment variables in dashboard

### Vercel Setup
1. Create account at [vercel.com](https://vercel.com)
2. Import project from GitHub
3. Set root directory to `client`
4. Add environment variables in project settings

## Local Development

1. **Backend:**
   ```bash
   cd server
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

2. **Frontend:**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## Project Structure

```
castle-depots/
├── server/                 # Django backend
│   ├── apps/              # Django apps
│   ├── castle_core/       # Main Django project
│   ├── requirements.txt   # Python dependencies
│   ├── Procfile          # Render deployment
│   └── build.sh          # Build script
└── client/                # Next.js frontend
    ├── src/              # Source code
    ├── public/           # Static assets
    └── package.json      # Node dependencies
```