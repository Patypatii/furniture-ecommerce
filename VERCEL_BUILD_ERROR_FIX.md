# 🔧 Vercel Build Error Fix

## ❌ Error
```
Command "cd .. && npm install && turbo run build --filter=@tangerine/shared...@tangerine/frontend" exited with 1
```

## 🔍 Issue Analysis

The build is failing when trying to build both `shared` and `frontend` in a single turbo command. This can happen when:
1. Turbo filter syntax doesn't work as expected in Vercel's environment
2. The workspace resolution fails with the `...` syntax

## ✅ Solution

**Changed build command** to build packages sequentially:

**Before:**
```json
"buildCommand": "cd .. && npm install && turbo run build --filter=@tangerine/shared...@tangerine/frontend"
```

**After:**
```json
"buildCommand": "cd .. && npm install && turbo run build --filter=@tangerine/shared && turbo run build --filter=@tangerine/frontend"
```

**Why this works:**
- Builds `shared` first (ensures it's available)
- Then builds `frontend` (which depends on shared)
- More explicit and reliable in CI/CD environments
- Turbo's dependency system (`dependsOn: ["^build"]`) ensures proper order

## 🚀 Next Steps

1. **Commit the change:**
   ```bash
   git add frontend/vercel.json
   git commit -m "fix: build shared and frontend sequentially in Vercel"
   git push origin main
   ```

2. **Vercel will auto-deploy** after the push

3. **Monitor the build** in Vercel Dashboard

## 📋 Alternative Solutions (if this doesn't work)

### Option 1: Use npm workspaces directly
```json
"buildCommand": "cd .. && npm install && npm run build --workspace=shared && npm run build --workspace=frontend"
```

### Option 2: Build from root without cd
If Vercel root directory is set to repository root:
```json
"buildCommand": "npm install && turbo run build --filter=@tangerine/shared && turbo run build --filter=@tangerine/frontend"
```

## 🔍 Debugging Tips

If build still fails:

1. **Check full build logs** in Vercel Dashboard → Deployments → Click on failed deployment → View all logs

2. **Common issues:**
   - Missing environment variables
   - TypeScript errors in frontend
   - Shared package not building correctly
   - Node version mismatch

3. **Test locally:**
   ```bash
   cd frontend
   cd .. && npm install && turbo run build --filter=@tangerine/shared && turbo run build --filter=@tangerine/frontend
   ```

## 📚 Related

- See `VERCEL_BUILD_FIX.md` for previous fixes
- See `VERCEL_DEPLOYMENT.md` for deployment guide

