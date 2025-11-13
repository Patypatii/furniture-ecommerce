# 🔧 Vercel Build Fix - Module Not Found Error

## ❌ Error
```
@tangerine/frontend:build: > Build failed because of webpack errors
@tangerine/frontend:build: npm error Lifecycle script `build` failed with error
```

## ✅ Solution Applied

### 1. Updated Build Command
**File:** `frontend/vercel.json`

**Changed from:**
```json
"buildCommand": "cd .. && npm install && turbo run build --filter=@tangerine/frontend"
```

**Changed to:**
```json
"buildCommand": "cd .. && npm install && turbo run build --filter=@tangerine/shared...@tangerine/frontend"
```

**Why:** This ensures `@tangerine/shared` is built before `@tangerine/frontend`. The `...` syntax means "shared and all packages that depend on it up to frontend".

### 2. Added Transpile Configuration
**File:** `frontend/next.config.js`

**Added:**
```javascript
transpilePackages: ['@tangerine/shared'],
```

**Why:** Next.js needs to transpile the shared package because it's a local workspace package, not from npm. This tells Next.js to process it during the build.

## 🚀 Next Steps

1. **Commit the changes:**
   ```bash
   git add frontend/vercel.json frontend/next.config.js
   git commit -m "fix: configure Next.js to transpile shared package and fix build order"
   git push origin main
   ```

2. **Vercel will auto-deploy** after the push

3. **Monitor the build** in Vercel Dashboard → Deployments

## 🔍 What This Fixes

- ✅ Ensures `@tangerine/shared` is built before frontend
- ✅ Allows Next.js to properly resolve and transpile the shared package
- ✅ Fixes "module not found" webpack errors
- ✅ Maintains proper build order in monorepo

## 📋 Files Changed

1. `frontend/vercel.json` - Updated build command
2. `frontend/next.config.js` - Added `transpilePackages` configuration

## 🐛 If Build Still Fails

1. **Check Vercel build logs** for specific error messages
2. **Verify shared package builds:**
   ```bash
   cd shared
   npm run build
   ```
3. **Test locally:**
   ```bash
   npm install
   turbo run build --filter=@tangerine/shared...@tangerine/frontend
   ```

## 📚 Related

- See `DEPLOYMENT.md` for complete deployment guide
- See `VERCEL_DEPLOYMENT.md` for Vercel setup

