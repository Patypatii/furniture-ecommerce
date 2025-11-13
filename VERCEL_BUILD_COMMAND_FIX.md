# 🔧 Vercel Build Command Override Fix

## ❌ Problem
Vercel is running `npm run build` (from root) instead of our custom build command.

**Error:** `Command "npm run build" exited with 2`

**Why:** When Root Directory is empty, Vercel detects root `package.json` and runs its `build` script (`turbo run build`) which tries to build ALL workspaces including backend.

## ✅ Solution Applied

**Updated `frontend/vercel.json`** to use explicit workspace commands:

```json
{
  "buildCommand": "npm run build --workspace=shared && npm run build --workspace=frontend",
  "outputDirectory": "frontend/.next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

**Added a postbuild step** so Vercel always finds the manifest it expects for the `(shop)` route group:

```json
// frontend/package.json
{
  "scripts": {
    "build": "next build && node scripts/postbuild.js"
  }
}
```

```js
// frontend/scripts/postbuild.js
const fs = require('fs');
const path = require('path');
// Copies `.next/server/app/page_client-reference-manifest.js`
// into `.next/server/app/(shop)/page_client-reference-manifest.js`
```

**Why:** This explicitly builds only `shared` and `frontend`, avoiding the root `build` script that tries to build everything.

## 🎯 Vercel Dashboard Settings

### CRITICAL: Override Build Command in Dashboard

Even with `vercel.json`, you should **explicitly set** the build command in Vercel Dashboard:

1. **Go to:** Vercel Dashboard → Your Project → **Settings** → **Build & Development Settings**

2. **Set Build Command to:**
   ```
   npm run build --workspace=shared && npm run build --workspace=frontend
   ```

3. **Set Output Directory to:**
   ```
   frontend/.next
   ```

4. **Set Install Command to:**
   ```
   npm install
   ```
   (or leave empty for auto)

5. **Root Directory:** Must be **EMPTY**

6. **Save all changes**

## 🔍 Why This Happens

**Root `package.json` has:**
```json
{
  "scripts": {
    "build": "turbo run build"  // ← This builds ALL workspaces
  }
}
```

When Vercel runs from root:
- It sees `package.json` with `build` script
- Runs `npm run build`
- Executes `turbo run build` which tries to build backend, admin, shared, frontend
- Backend build might fail (missing env vars, etc.)
- Overall build fails ❌

**Our fix:**
- Explicitly build only `shared` and `frontend`
- Skip backend and admin
- Build succeeds ✅

## 🚀 Next Steps

1. **Update Vercel Dashboard Settings** (see above)

2. **Commit the code change:**
   ```bash
   git add frontend/vercel.json
   git commit -m "fix: use explicit workspace commands to avoid root build script"
   git push origin main
   ```

3. **Monitor build** - should work now!

## 📋 Alternative: Disable Root Build Script

If you want to keep the root build script for local development, you could create a separate script:

**Root `package.json`:**
```json
{
  "scripts": {
    "build": "turbo run build",
    "build:vercel": "npm run build --workspace=shared && npm run build --workspace=frontend"
  }
}
```

Then use `npm run build:vercel` in vercel.json. But the current solution is cleaner.

## ✅ Verification

After setting build command in Dashboard:
- Build should only show `shared` and `frontend` building
- No backend or admin build attempts
- Build completes successfully

