# ✅ Render.com Configuration Fix Checklist (Deploy from Root)

## 🎯 Quick Fix Guide

Based on your current Render.com service settings, here's exactly what to change:

### 1. ✅ Root Directory (KEEP EMPTY)
**Current:** Empty (not set)  
**Action:** **LEAVE IT EMPTY** - This is correct for root deployment

**Steps:**
1. Go to Settings → General
2. Find "Root Directory" 
3. Make sure it's **EMPTY** (or set to `.` if you want to be explicit)
4. Save

---

### 2. ⚠️ Build Command (CRITICAL)
**Current:** `npm install; npm run build`  
**Fix:** Use one of these:

**Option A (Recommended - uses Turbo):**
```bash
npm install && turbo run build --filter=@tangerine/shared... --filter=@tangerine/backend
```

**Option B (Alternative - if Turbo not available):**
```bash
npm install && cd backend && npm run build
```

**Steps:**
1. Go to Settings → Build & Deploy
2. Find "Build Command"
3. Click "Edit"
4. Replace with one of the commands above
5. Save

---

### 3. ⚠️ Health Check Path (IMPORTANT)
**Current:** `/healthz`  
**Fix:** `/health`

**Steps:**
1. Go to Settings → Health Checks
2. Find "Health Check Path"
3. Click "Edit"
4. Change from `/healthz` to `/health`
5. Save

---

### 4. ⚠️ Start Command (NEEDS UPDATE)
**Current:** `npm run start`  
**Fix:** Change to:
```bash
cd backend && npm start
```

**Steps:**
1. Go to Settings → Build & Deploy
2. Find "Start Command"
3. Click "Edit"
4. Change to: `cd backend && npm start`
5. Save

---

### 5. 🔐 Environment Variables (REQUIRED)

Go to **Settings → Environment** and add these:

#### Must Have:
```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-strong-secret-min-32-chars
JWT_EXPIRE=7d
```

#### For CORS (Add your Vercel URLs):
```bash
FRONTEND_URL=https://your-frontend.vercel.app
ADMIN_URL=https://your-admin.vercel.app
```

#### Recommended:
```bash
IMAGEKIT_PUBLIC_KEY=your-key
IMAGEKIT_PRIVATE_KEY=your-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## 📋 Complete Settings Summary

After fixes, your settings should be:

| Setting | Value |
|---------|-------|
| **Root Directory** | Empty (or `.`) |
| **Build Command** | `npm install && turbo run build --filter=@tangerine/shared... --filter=@tangerine/backend` |
| **Start Command** | `cd backend && npm start` |
| **Health Check Path** | `/health` |
| **Branch** | `main` |
| **Auto-Deploy** | On Commit |

---

## 💻 Git Commands

After making code changes, commit and push:

```bash
# Add all changes
git add .

# Commit with message
git commit -m "feat: configure backend for Render.com deployment from root"

# Push to main branch (this triggers auto-deploy)
git push origin main
```

## 🚀 After Making Changes

1. ✅ **Update all settings** in Render Dashboard (see above)
2. ✅ **Add environment variables** (see section 5)
3. ✅ **Save all changes** in Render
4. ✅ **Commit and push code** (see Git Commands above)
5. ✅ **Monitor deployment** in Render Dashboard → Logs tab
6. ✅ **Test health endpoint:** `https://furniture-ecommerce-fwpa.onrender.com/health`
7. ✅ **Test API:** `https://furniture-ecommerce-fwpa.onrender.com/api/v1`

---

## 🔍 Verification

After deployment, check:

- ✅ Build completes successfully
- ✅ Health check passes: `/health` returns 200
- ✅ API responds: `/api/v1` returns JSON
- ✅ CORS works: Frontend/admin can connect
- ✅ Database connects: Check logs for MongoDB connection

---

## 📚 More Help

- See `RENDER_DEPLOYMENT.md` for detailed guide
- See `DEPLOYMENT.md` for complete setup
- Check Render.com logs if issues occur

