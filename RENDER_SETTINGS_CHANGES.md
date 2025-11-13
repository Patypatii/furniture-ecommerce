# 🎯 Render.com Settings - Exact Changes Needed

## 📍 Where to Make Changes

Go to: **Render Dashboard** → Your Service (`furniture-ecommerce`) → **Settings**

---

## ✅ Changes to Make

### 1. Root Directory
**Location:** Settings → General → Root Directory  
**Action:** Leave **EMPTY** (or set to `.`)  
**Current:** Empty ✅ (Already correct!)

---

### 2. Build Command
**Location:** Settings → Build & Deploy → Build Command  
**Current:** `npm install; npm run build`  
**Change to:**
```bash
npm install && turbo run build --filter=@tangerine/shared... --filter=@tangerine/backend
```

**Steps:**
1. Click "Edit" next to Build Command
2. Delete the current command
3. Paste the new command above
4. Click "Save"

---

### 3. Start Command
**Location:** Settings → Build & Deploy → Start Command  
**Current:** `npm run start`  
**Change to:**
```bash
cd backend && npm start
```

**Steps:**
1. Click "Edit" next to Start Command
2. Delete the current command
3. Paste: `cd backend && npm start`
4. Click "Save"

---

### 4. Health Check Path
**Location:** Settings → Health Checks → Health Check Path  
**Current:** `/healthz`  
**Change to:** `/health`

**Steps:**
1. Click "Edit" next to Health Check Path
2. Change `/healthz` to `/health`
3. Click "Save"

---

### 5. Environment Variables
**Location:** Settings → Environment → Add Environment Variable

**Click "Add Environment Variable" for each:**

#### Required (Must Add):
```
NODE_ENV = production
PORT = 10000
MONGODB_URI = your-mongodb-connection-string
JWT_SECRET = your-secret-min-32-chars
JWT_EXPIRE = 7d
FRONTEND_URL = https://your-frontend.vercel.app
ADMIN_URL = https://your-admin.vercel.app
```

#### Recommended (Add if you have them):
```
IMAGEKIT_PUBLIC_KEY = your-key
IMAGEKIT_PRIVATE_KEY = your-key
IMAGEKIT_URL_ENDPOINT = https://ik.imagekit.io/your-id
STRIPE_SECRET_KEY = sk_live_...
STRIPE_PUBLISHABLE_KEY = pk_live_...
```

---

## 📋 Summary Table

| Setting | Location | Current | Change To |
|---------|----------|---------|-----------|
| **Root Directory** | General | Empty | Keep Empty ✅ |
| **Build Command** | Build & Deploy | `npm install; npm run build` | `npm install && turbo run build --filter=@tangerine/shared... --filter=@tangerine/backend` |
| **Start Command** | Build & Deploy | `npm run start` | `cd backend && npm start` |
| **Health Check** | Health Checks | `/healthz` | `/health` |
| **Environment** | Environment | (Add variables) | See section 5 above |

---

## 💻 After Making Changes

### Step 1: Save in Render
1. Make all changes above
2. Click "Save Changes" for each section
3. All changes are saved automatically

### Step 2: Commit and Push Code
Open your terminal and run:

```bash
# Navigate to your project
cd "C:\Users\patri\Downloads\Tangerine clone\tangerine-furniture-v2"

# Add all changes
git add .

# Commit
git commit -m "feat: configure Render.com deployment from root"

# Push (this triggers auto-deploy)
git push origin main
```

### Step 3: Monitor Deployment
1. Go to Render Dashboard → Your Service → **Logs** tab
2. Watch the build process
3. Wait for "Build successful" message
4. Check for "Service is live" message

### Step 4: Test
1. **Health Check:** https://furniture-ecommerce-fwpa.onrender.com/health
2. **API:** https://furniture-ecommerce-fwpa.onrender.com/api/v1

---

## ✅ Checklist

Before deploying, make sure:

- [ ] Root Directory is empty
- [ ] Build Command updated
- [ ] Start Command updated
- [ ] Health Check Path is `/health`
- [ ] Environment variables added (at least NODE_ENV, PORT, MONGODB_URI, JWT_SECRET)
- [ ] CORS variables added (FRONTEND_URL, ADMIN_URL)
- [ ] All changes saved in Render
- [ ] Code committed and pushed to GitHub

---

## 🆘 Need Help?

- See `RENDER_ROOT_DEPLOYMENT.md` for detailed guide
- See `RENDER_FIX_CHECKLIST.md` for troubleshooting
- Check Render.com logs if deployment fails

