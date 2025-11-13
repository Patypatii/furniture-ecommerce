# ⚠️ CRITICAL: Vercel Settings That MUST Be Correct

## 🎯 The Build Works Locally - So This Is 100% A Vercel Configuration Issue

### ✅ REQUIRED Vercel Dashboard Settings

#### 1. Root Directory (MOST IMPORTANT)
**Location:** Settings → General → Root Directory

**MUST BE:** **EMPTY** (not set to `frontend`)

**Why:** 
- If Root Directory = `frontend`, Vercel runs commands from `frontend/` directory
- Workspace commands need to run from repository root where `package.json` with workspaces is located
- If Root Directory = empty, Vercel runs from repository root ✅

**How to Check:**
1. Go to Vercel Dashboard → Your Project → Settings → General
2. Look for "Root Directory" field
3. If it says `frontend`, **DELETE IT** (make it empty)
4. Save changes

#### 2. Build & Development Settings
**Location:** Settings → Build & Development Settings

**Settings:**
- **Build Command:** `npm run build:frontend` (or leave empty to auto-detect from vercel.json)
- **Output Directory:** `frontend/.next`
- **Install Command:** Leave **EMPTY** (Vercel auto-detects `npm install`)

#### 3. Framework Preset
- Should be: **Next.js** (auto-detected)

## 🔍 How to Verify Your Settings

1. **Go to Vercel Dashboard**
2. **Click your project** (`furniture-ecommerce-frontend`)
3. **Click "Settings"** tab
4. **Click "General"** section
5. **Scroll to "Root Directory"**
6. **If it's NOT empty, click "Edit" and clear it**
7. **Save changes**

## 🚀 After Fixing Root Directory

1. **Commit current code:**
   ```bash
   git add frontend/vercel.json package.json
   git commit -m "fix: configure Vercel build with root directory"
   git push origin main
   ```

2. **Vercel will auto-deploy** with correct settings

3. **Build should succeed!**

## 📋 Current Configuration

**File: `frontend/vercel.json`**
```json
{
  "buildCommand": "npm run build:frontend",
  "outputDirectory": "frontend/.next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

**File: `package.json` (root)**
```json
{
  "scripts": {
    "build:frontend": "npm run build --workspace=shared && npm run build --workspace=frontend"
  }
}
```

This configuration works when:
- ✅ Root Directory is **EMPTY** (repository root)
- ✅ Commands run from repository root
- ✅ Workspace commands can find `shared` and `frontend` packages

## ❌ Why Build Fails If Root Directory = `frontend`

When Root Directory = `frontend`:
1. Vercel changes to `frontend/` directory
2. Runs `npm run build:frontend` from `frontend/` directory
3. npm looks for `build:frontend` script in `frontend/package.json`
4. Script doesn't exist there (it's in root `package.json`)
5. Build fails ❌

## ✅ Why Build Works If Root Directory = Empty

When Root Directory = empty:
1. Vercel stays in repository root
2. Runs `npm run build:frontend` from root directory
3. npm finds script in root `package.json` ✅
4. Script runs workspace commands from root ✅
5. Build succeeds ✅

## 🎯 ACTION REQUIRED

**Go to Vercel Dashboard RIGHT NOW and verify Root Directory is EMPTY!**

This is the #1 cause of build failures for monorepos on Vercel.

