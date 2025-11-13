# 🚀 Render.com Backend Deployment Guide

## ⚠️ Current Configuration Issues

Based on your Render.com service settings, here are the fixes needed:

### 1. Root Directory
**Current:** Not set (empty)  
**Should be:** `backend`

### 2. Build Command
**Current:** `npm install; npm run build`  
**Should be:** `cd .. && npm install && cd backend && npm run build`

**OR (Better for monorepo):**
```bash
cd .. && npm install && turbo run build --filter=@tangerine/shared... --filter=@tangerine/backend
```

### 3. Start Command
**Current:** `npm run start`  
**Should be:** `npm start` (this is correct, but verify it works)

### 4. Health Check Path
**Current:** `/healthz`  
**Should be:** `/health` (your backend has `/health` endpoint, not `/healthz`)

## 🔧 Step-by-Step Fix

### Step 1: Update Root Directory
1. Go to Render Dashboard → Your Service → Settings
2. Find **"Root Directory"** section
3. Click **"Edit"**
4. Enter: `backend`
5. Click **"Save Changes"**

### Step 2: Update Build Command
1. In Settings, find **"Build Command"**
2. Click **"Edit"**
3. Replace with:
   ```bash
   cd .. && npm install && turbo run build --filter=@tangerine/shared... --filter=@tangerine/backend
   ```
4. Click **"Save Changes"**

**Alternative (if turbo not available):**
```bash
cd .. && npm install && cd backend && npm run build
```

### Step 3: Update Health Check Path
1. In Settings, find **"Health Check Path"**
2. Click **"Edit"**
3. Change from `/healthz` to `/health`
4. Click **"Save Changes"**

### Step 4: Verify Start Command
1. In Settings, find **"Start Command"**
2. Should be: `npm start`
3. This runs `node dist/server.js` from the backend directory

## 🔐 Required Environment Variables

Go to **Settings → Environment** and add these variables:

### Required (Must Have)
```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-strong-secret-min-32-characters-long
JWT_EXPIRE=7d
```

### Important (Recommended)
```bash
# ImageKit
IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# CORS - Add your Vercel URLs
FRONTEND_URL=https://furniture-ecommerce-frontend-chi.vercel.app
ADMIN_URL=https://your-admin.vercel.app
```

### Optional (For Features)
```bash
# OpenAI (for chatbot)
OPENAI_API_KEY=sk-...

# Redis (for caching)
REDIS_URL=your-redis-url
REDIS_PASSWORD=your-redis-password

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# OpenRouter (fallback for chatbot)
OPENROUTER_API_KEY=your-openrouter-key
USE_OPENROUTER_FALLBACK=false
```

## 📋 Complete Render.com Settings Summary

| Setting | Value |
|---------|-------|
| **Name** | `furniture-ecommerce` (or your preferred name) |
| **Region** | Oregon (US West) or your preferred region |
| **Instance Type** | Free (or upgrade for better performance) |
| **Branch** | `main` |
| **Root Directory** | `backend` ⚠️ **IMPORTANT** |
| **Build Command** | `cd .. && npm install && turbo run build --filter=@tangerine/shared... --filter=@tangerine/backend` |
| **Start Command** | `npm start` |
| **Health Check Path** | `/health` |
| **Auto-Deploy** | On Commit (enabled) |

## 🚀 After Configuration

1. **Save all changes** in Render Dashboard
2. **Trigger a manual deploy:**
   - Go to **"Manual Deploy"** tab
   - Click **"Deploy latest commit"**
3. **Monitor the build logs** to ensure it builds successfully
4. **Check health endpoint:** `https://furniture-ecommerce-fwpa.onrender.com/health`

## 🔍 Troubleshooting

### Build Fails with "Command not found: turbo"
**Solution:** Install turbo globally or use alternative build command:
```bash
cd .. && npm install && cd backend && npm run build
```

### Build Fails with "Cannot find module @tangerine/shared"
**Solution:** Make sure build command installs from root:
```bash
cd .. && npm install && turbo run build --filter=@tangerine/shared... --filter=@tangerine/backend
```

### Service starts but health check fails
**Solution:** 
- Verify health check path is `/health` (not `/healthz`)
- Check that server is listening on the correct port (Render sets PORT automatically)
- Verify MongoDB connection (health check returns 503 if DB not connected)

### CORS Errors
**Solution:** Add your Vercel URLs to environment variables:
```bash
FRONTEND_URL=https://furniture-ecommerce-frontend-chi.vercel.app
ADMIN_URL=https://your-admin.vercel.app
```

Then update `backend/src/server.ts` CORS configuration to include these.

### Service spins down (Free tier)
**Solution:** 
- Free tier services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds (cold start)
- Upgrade to paid ($7/month) for always-on service

## 📚 Next Steps

1. ✅ Fix Root Directory → `backend`
2. ✅ Fix Build Command → Use turbo or npm workspaces
3. ✅ Fix Health Check Path → `/health`
4. ✅ Add Environment Variables
5. ✅ Deploy and test
6. ✅ Update CORS in backend code with Vercel URLs
7. ✅ Test API endpoints from frontend/admin

## 🔗 Related Documentation

- See `DEPLOYMENT.md` for complete deployment guide
- See `VERCEL_DEPLOYMENT.md` for frontend/admin setup

