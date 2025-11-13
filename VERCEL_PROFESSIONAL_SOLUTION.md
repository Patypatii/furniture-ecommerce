# 🎯 Professional Vercel Monorepo Solution

## ✅ The Right Way to Deploy Monorepos on Vercel

### Problem Analysis
- Build commands failing with workspace syntax
- Root directory configuration issues
- Turbo not being used effectively

### Professional Solution

**Key Principle:** Use Turbo properly - it's already in your project and designed for monorepos.

## 📝 Changes Made

### 1. Root `package.json` - Added Build Script
```json
{
  "scripts": {
    "build:frontend": "turbo run build --filter=@tangerine/shared...@tangerine/frontend"
  }
}
```

**Why:** 
- Single command that handles dependencies automatically
- Turbo's `...` syntax builds shared AND frontend in correct order
- Works from repository root

### 2. `frontend/vercel.json` - Simplified
```json
{
  "buildCommand": "npm run build:frontend",
  "outputDirectory": "frontend/.next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

**Why:**
- Simple command that runs from root
- Vercel auto-detects framework
- Output directory is explicit

## 🔧 Vercel Dashboard Configuration

### Critical Settings:

1. **Root Directory:** 
   - **MUST BE EMPTY** (repository root)
   - NOT `frontend`
   - This is the #1 cause of failures

2. **Build & Development Settings:**
   - **Build Command:** `npm run build:frontend` (auto from vercel.json)
   - **Output Directory:** `frontend/.next`
   - **Install Command:** Leave empty (auto)

3. **Framework Preset:**
   - Next.js (auto-detected)

## 🚀 Why This Works

1. **Turbo Handles Dependencies:**
   - `--filter=@tangerine/shared...@tangerine/frontend` means:
     - Build shared first
     - Then build frontend (which depends on shared)
   - Turbo's `dependsOn: ["^build"]` ensures correct order

2. **Single Command:**
   - No complex chaining
   - No `cd` commands
   - No workspace syntax issues

3. **Runs from Root:**
   - All package.json files accessible
   - Workspace resolution works
   - Turbo can find all packages

## 📋 Verification Checklist

Before deploying, verify:

- [ ] Root Directory in Vercel is **EMPTY**
- [ ] `package.json` in root has `build:frontend` script
- [ ] `frontend/vercel.json` has correct build command
- [ ] `turbo.json` exists and is configured
- [ ] All workspace packages have `package.json`

## 🔍 If Build Still Fails

### Check Full Error Logs:
1. Vercel Dashboard → Deployments
2. Click failed deployment
3. Scroll to see **complete error message**
4. Look for:
   - TypeScript errors
   - Missing dependencies
   - Module resolution issues

### Common Issues:

**Issue:** "Cannot find module @tangerine/shared"
**Fix:** Ensure shared builds first - Turbo handles this automatically

**Issue:** "Command not found"
**Fix:** Root Directory must be empty, not `frontend`

**Issue:** TypeScript errors
**Fix:** Check `frontend/next.config.js` has `transpilePackages: ['@tangerine/shared']`

## 🎓 Professional Best Practices

1. **Use Turbo for Monorepos:**
   - It's designed for this
   - Handles dependencies automatically
   - Better caching

2. **Keep Build Commands Simple:**
   - One command in root package.json
   - Let Turbo handle complexity

3. **Root Directory = Repository Root:**
   - Always for monorepos
   - Vercel needs access to all workspaces

4. **Explicit Output Directory:**
   - Don't rely on auto-detection
   - Specify `frontend/.next` explicitly

## 📚 Next Steps

1. **Commit changes:**
   ```bash
   git add package.json frontend/vercel.json
   git commit -m "feat: use turbo for Vercel monorepo build"
   git push origin main
   ```

2. **Verify Vercel Settings:**
   - Root Directory = Empty
   - Build Command = `npm run build:frontend`
   - Output Directory = `frontend/.next`

3. **Monitor Build:**
   - Watch logs in real-time
   - Check for specific errors
   - Fix any TypeScript/build issues

## 💡 Alternative: If Turbo Still Fails

If Turbo continues to have issues, use npm workspaces with explicit build:

**Root package.json:**
```json
{
  "scripts": {
    "build:frontend": "npm run build --workspace=shared && npm run build --workspace=frontend"
  }
}
```

But Turbo is the professional choice - it's faster and handles caching better.

