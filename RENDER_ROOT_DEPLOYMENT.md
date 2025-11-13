# 🚀 Render.com Deployment from Root Directory

## 📋 Render.com Settings Configuration

### Step 1: General Settings

1. Go to **Render Dashboard** → Your Service → **Settings**
2. Find **"General"** section

**Settings to configure:**
- **Name:** `furniture-ecommerce` (keep as is or change)
- **Region:** `Oregon (US West)` (or your preferred region)
- **Instance Type:** `Free` (or upgrade if needed)

---

### Step 2: Build & Deploy Settings

1. In Settings, find **"Build & Deploy"** section

**Configure these:**

#### Repository
- **Repository:** `https://github.com/Patypatii/furniture-ecommerce` ✅ (already set)
- **Branch:** `main` ✅ (already set)

#### Root Directory
- **Root Directory:** Leave **EMPTY** or set to `.` (dot)
  - This means Render will run commands from the repository root
  - ⚠️ **Important:** Do NOT set this to `backend`

#### Build Command
- **Current:** `npm install; npm run build`
- **Change to:**
  ```bash
  npm install && turbo run build --filter=@tangerine/shared... --filter=@tangerine/backend
  ```
  
  **Alternative (if turbo doesn't work):**
  ```bash
  npm install && cd backend && npm run build
  ```

#### Start Command
- **Current:** `npm run start`
- **Change to:**
  ```bash
  cd backend && npm start
  ```

#### Pre-Deploy Command
- **Leave empty** (not needed)

#### Auto-Deploy
- **Keep:** `On Commit` ✅ (already enabled)

---

### Step 3: Health Checks

1. In Settings, find **"Health Checks"** section

**Configure:**
- **Health Check Path:** Change from `/healthz` to `/health`
  - Your backend has `/health` endpoint, not `/healthz`

---

### Step 4: Environment Variables

1. In Settings, find **"Environment"** section
2. Click **"Add Environment Variable"** for each one

**Required Variables:**

```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-strong-secret-minimum-32-characters-long
JWT_EXPIRE=7d
```

**CORS Variables (Add your Vercel URLs):**

```bash
FRONTEND_URL=https://your-frontend.vercel.app
ADMIN_URL=https://your-admin.vercel.app
```

**Optional but Recommended:**

```bash
IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
OPENAI_API_KEY=sk-... (for chatbot)
REDIS_URL=your-redis-url (for caching)
```

---

## 📝 Complete Settings Summary

| Setting | Value |
|---------|-------|
| **Root Directory** | Empty (or `.`) |
| **Build Command** | `npm install && turbo run build --filter=@tangerine/shared... --filter=@tangerine/backend` |
| **Start Command** | `cd backend && npm start` |
| **Health Check Path** | `/health` |
| **Branch** | `main` |
| **Auto-Deploy** | On Commit |

---

## 💻 Git Commands to Commit Changes

After making code changes, commit and push:

```bash
# Add all changes
git add .

# Commit with message
git commit -m "feat: configure backend for Render.com deployment from root"

# Push to main branch
git push origin main
```

Render will automatically detect the push and start a new deployment.

---

## 🚀 Deployment Steps

1. ✅ **Update Render.com Settings** (follow steps above)
2. ✅ **Add Environment Variables** in Render Dashboard
3. ✅ **Save all changes** in Render
4. ✅ **Commit and push code:**
   ```bash
   git add .
   git commit -m "feat: configure for Render deployment"
   git push origin main
   ```
5. ✅ **Monitor deployment** in Render Dashboard → Logs
6. ✅ **Test health endpoint:** `https://furniture-ecommerce-fwpa.onrender.com/health`
7. ✅ **Test API:** `https://furniture-ecommerce-fwpa.onrender.com/api/v1`

---

## 🔍 Verification Checklist

After deployment, verify:

- [ ] Build completes successfully (check logs)
- [ ] Health check passes: `/health` returns 200 status
- [ ] API responds: `/api/v1` returns JSON response
- [ ] MongoDB connects (check logs for connection message)
- [ ] CORS works (test from frontend/admin)

---

## 🐛 Troubleshooting

### Build Fails: "Cannot find module @tangerine/shared"
**Solution:** Make sure build command runs from root:
```bash
npm install && turbo run build --filter=@tangerine/shared... --filter=@tangerine/backend
```

### Service Starts but Crashes
**Solution:** Check logs for errors. Common issues:
- Missing environment variables
- MongoDB connection failed
- Port conflict (Render sets PORT automatically)

### Health Check Fails
**Solution:** 
- Verify health check path is `/health` (not `/healthz`)
- Check that server is running on correct port
- Verify MongoDB connection

### CORS Errors
**Solution:** 
- Add `FRONTEND_URL` and `ADMIN_URL` environment variables
- Update backend CORS configuration (already done in code)

---

## 📚 Related Files

- `RENDER_DEPLOYMENT.md` - Alternative deployment from backend directory
- `DEPLOYMENT.md` - Complete deployment guide
- `RENDER_FIX_CHECKLIST.md` - Quick reference checklist

