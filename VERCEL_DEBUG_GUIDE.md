# 🐛 Vercel Build Debugging Guide

## ❌ Current Issue
Build failing with `npm run build:frontend` but logs are truncated.

## 🔍 How to See Full Error

### Step 1: View Complete Logs
1. Go to **Vercel Dashboard** → **Deployments**
2. Click on the **failed deployment**
3. Click **"View Function Logs"** or scroll to see **ALL logs**
4. Look for the **actual error message** (usually at the end)

### Step 2: Common Errors to Look For

**TypeScript Errors:**
```
error TS2307: Cannot find module '@tangerine/shared'
error TS2339: Property 'X' does not exist on type 'Y'
```

**Build Errors:**
```
Module not found: Can't resolve '@tangerine/shared'
Failed to compile
```

**Turbo Errors:**
```
No tasks found for filter
Command failed
```

## ✅ Current Solution Applied

Changed build command to use npm workspaces directly (more reliable):

```json
"build:frontend": "npm run build --workspace=shared && npm run build --workspace=frontend"
```

## 🔧 Alternative Solutions

### Option 1: Direct Build (If workspaces fail)
```json
"build:frontend": "cd shared && npm run build && cd ../frontend && npm run build"
```

### Option 2: Use Turbo Explicitly
```json
"build:frontend": "turbo run build --filter=@tangerine/shared && turbo run build --filter=@tangerine/frontend"
```

### Option 3: Build Script
Create `scripts/build-frontend.js`:
```javascript
const { execSync } = require('child_process');
execSync('npm run build --workspace=shared', { stdio: 'inherit' });
execSync('npm run build --workspace=frontend', { stdio: 'inherit' });
```

Then:
```json
"build:frontend": "node scripts/build-frontend.js"
```

## 📋 Debugging Checklist

1. **Verify Root Directory:**
   - Vercel Settings → General → Root Directory = **EMPTY**
   - NOT `frontend`

2. **Check package.json files exist:**
   - ✅ Root: `package.json`
   - ✅ `shared/package.json`
   - ✅ `frontend/package.json`

3. **Verify workspaces:**
   - Root `package.json` has: `"workspaces": ["shared", "frontend"]`

4. **Check build scripts:**
   - `shared/package.json` has: `"build": "tsc"`
   - `frontend/package.json` has: `"build": "next build"`

5. **Verify shared builds:**
   - Check if `shared/dist/` exists after build
   - Check if `shared/dist/index.js` exists

6. **Check Next.js config:**
   - `frontend/next.config.js` has: `transpilePackages: ['@tangerine/shared']`

## 🚀 Next Steps

1. **Get the full error:**
   - View complete logs in Vercel Dashboard
   - Copy the exact error message
   - Share it for specific fix

2. **Test locally:**
   ```bash
   # From repository root
   npm install
   npm run build:frontend
   ```
   
   If this works locally but fails on Vercel, it's a configuration issue.

3. **Check Vercel Settings:**
   - Root Directory = Empty
   - Node Version = 20.x (check in Settings → General)

## 💡 Most Likely Issues

1. **Root Directory not empty** - #1 cause of failures
2. **Shared package not building** - Check TypeScript errors in shared
3. **Module resolution** - Next.js can't find @tangerine/shared
4. **TypeScript errors** - Check frontend/src for TS errors

## 📞 What to Share for Help

If build still fails, share:
1. **Complete error message** from Vercel logs
2. **Root Directory setting** (empty or frontend?)
3. **Node version** in Vercel settings
4. **Result of local build** (`npm run build:frontend`)

