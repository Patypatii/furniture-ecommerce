# 🔧 Vercel Monorepo Configuration Guide

## ❌ Error: "exited with 127"
This error means "command not found" - the `cd ..` command is causing issues in Vercel's build environment.

## ✅ Correct Vercel Settings

### Option 1: Root Directory = Repository Root (Recommended)

**In Vercel Dashboard:**

1. Go to **Project Settings** → **General**
2. **Root Directory:** Leave **EMPTY** (or set to `.`)
   - This means Vercel runs commands from the repository root
3. **Framework Preset:** Next.js
4. **Build Command:** (Auto-detected or use the one in `frontend/vercel.json`)
5. **Output Directory:** `frontend/.next`
6. **Install Command:** (Leave empty - Vercel auto-detects)

**Updated `frontend/vercel.json`:**
```json
{
  "buildCommand": "npm run build --workspace=shared && npm run build --workspace=frontend",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### Option 2: Root Directory = frontend (Alternative)

If you want to keep Root Directory as `frontend`:

1. **Root Directory:** `frontend`
2. **Build Command:** 
   ```bash
   cd .. && npm install && npm run build --workspace=shared && cd frontend && npm run build
   ```
3. **Output Directory:** `.next`
4. **Install Command:** `cd .. && npm install`

**But this is more complex and error-prone.**

## 🎯 Recommended Configuration

### Vercel Dashboard Settings:

| Setting | Value |
|---------|-------|
| **Root Directory** | Empty (repository root) |
| **Framework** | Next.js |
| **Build Command** | (Auto from vercel.json) |
| **Output Directory** | `frontend/.next` |
| **Install Command** | (Auto - leave empty) |

### File: `frontend/vercel.json`
```json
{
  "buildCommand": "npm run build --workspace=shared && npm run build --workspace=frontend",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

## 📋 Step-by-Step Fix

1. **Update `frontend/vercel.json`** (already done ✅)

2. **In Vercel Dashboard:**
   - Go to **Settings** → **General**
   - **Root Directory:** Clear it (set to empty)
   - Save changes

3. **Verify Build Settings:**
   - Go to **Settings** → **Build & Development Settings**
   - **Build Command:** Should auto-detect from `frontend/vercel.json`
   - **Output Directory:** Should be `frontend/.next` or `.next`
   - **Install Command:** Leave empty (auto)

4. **Commit and push:**
   ```bash
   git add frontend/vercel.json
   git commit -m "fix: configure Vercel for monorepo with root directory"
   git push origin main
   ```

## 🔍 Why This Works

- **No `cd ..`:** Commands run from repository root where `package.json` exists
- **npm workspaces:** Native npm workspace commands work reliably
- **Vercel auto-detection:** Vercel handles installation automatically
- **Simpler:** Less complex commands = fewer errors

## 🐛 Troubleshooting

### If build still fails:

1. **Check Root Directory:**
   - Must be empty (repository root)
   - NOT set to `frontend`

2. **Verify package.json exists:**
   - Root: `package.json` ✅
   - `shared/package.json` ✅
   - `frontend/package.json` ✅

3. **Check workspace configuration:**
   - Root `package.json` must have `workspaces: ["shared", "frontend"]`

4. **View full build logs:**
   - Vercel Dashboard → Deployments → Click failed deployment
   - Scroll to see the actual error

## 📚 Related

- See `VERCEL_DEPLOYMENT.md` for complete guide
- See `VERCEL_BUILD_ALTERNATIVE.md` for alternative solutions

