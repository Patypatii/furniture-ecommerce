# 🚀 Quick Vercel Deployment Guide

## ✅ Build Fix Summary

The build was failing because Vercel was trying to build all workspaces (frontend, backend, admin, shared). 

**Fixed by:**
1. Created `frontend/vercel.json` for frontend deployment
2. Created `admin/vercel.json` for admin deployment
3. Created `.vercelignore` to exclude backend from deployment
4. Updated `DEPLOYMENT.md` with detailed Vercel + Render.com instructions

## 📝 Vercel Configuration

### Frontend (`frontend/vercel.json`)
- **Build Command:** `turbo run build --filter=@tangerine/frontend`
  - This builds frontend and automatically builds shared as a dependency
- **Output Directory:** `.next`
- **Framework:** Next.js (auto-detected)

### Admin (`admin/vercel.json`)
- **Build Command:** `turbo run build --filter=@tangerine/admin`
  - This builds admin and automatically builds shared as a dependency
- **Output Directory:** `dist`
- **Framework:** Vite (SPA with routing rewrites)

## 🔧 Required Environment Variables

### Frontend Project
Set these in Vercel Dashboard → Frontend Project → Settings → Environment Variables:

```bash
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...
```

### Admin Project
Set these in Vercel Dashboard → Admin Project → Settings → Environment Variables:

```bash
VITE_API_URL=https://your-backend.onrender.com/api/v1
```

## 🚀 Deployment Steps

### Step 1: Deploy Frontend

1. **Create Frontend Project in Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - **Root Directory:** Set to `frontend`
   - **Framework:** Next.js (auto-detected)
   - Add environment variables
   - Click "Deploy"

2. **Or deploy via CLI:**
   ```bash
   cd frontend
   npm install -g vercel
   vercel --prod
   ```

### Step 2: Deploy Admin

1. **Create Admin Project in Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import the same GitHub repository
   - **Root Directory:** Set to `admin` ⚠️ **Important!**
   - **Framework:** Other (Vite)
   - Add environment variables
   - Click "Deploy"

2. **Or deploy via CLI:**
   ```bash
   cd admin
   vercel --prod
   ```

### Step 3: Push Changes

```bash
git add .
git commit -m "feat: configure Vercel for frontend and admin deployment"
git push origin main
```

Both projects will auto-deploy on push to `main` branch.

## 🔍 Troubleshooting

### Build Still Failing?

1. **Check Vercel Build Logs:**
   - Go to Vercel Dashboard → Deployments → Click on failed deployment
   - Check the build logs for specific errors

2. **Common Issues:**
   - Missing environment variables → Add them in Vercel Dashboard
   - TypeScript errors → Fix in your code
   - Missing dependencies → Check `package.json` in frontend and shared

3. **Test Build Locally:**
   ```bash
   # From project root
   npm install
   turbo run build --filter=@tangerine/frontend
   ```

### Backend Not Connecting?

1. **Check Backend URL:**
   - Frontend: Ensure `NEXT_PUBLIC_API_URL` points to your Render.com backend
   - Admin: Ensure `VITE_API_URL` points to your Render.com backend
   - Format: `https://your-backend.onrender.com/api/v1`

2. **CORS Issues:**
   - Update backend CORS to include your Vercel domains
   - Add to `backend/src/server.ts`:
   ```typescript
   origin: [
     process.env.FRONTEND_URL || 'http://localhost:3000',
     process.env.ADMIN_URL || 'http://localhost:5173',
    'https://furniture-ecommerce-frontend-chi.vercel.app', // Live frontend (production)
     'https://your-admin.vercel.app', // Add your admin Vercel URL
   ]
   ```

### Admin Routing Issues?

If admin pages show 404 errors:

1. **Check `admin/vercel.json`:**
   - Ensure rewrites are configured correctly
   - Should have: `"source": "/(.*)", "destination": "/index.html"`

2. **Verify Root Directory:**
   - In Vercel Dashboard → Admin Project → Settings
   - Root Directory must be set to `admin`

3. **Check Build Output:**
   - Admin build should output to `dist/` directory
   - Verify `dist/index.html` exists after build

## 📚 Full Documentation

See `DEPLOYMENT.md` for complete deployment guide including Render.com backend setup.

