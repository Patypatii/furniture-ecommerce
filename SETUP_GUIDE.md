# 🚀 Tangerine Furniture v2.0 - Complete Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [MongoDB Atlas Setup](#mongodb-atlas-setup)
4. [OpenAI & OpenRouter Setup](#openai--openrouter-setup)
5. [Installation](#installation)
6. [Running the Application](#running-the-application)
7. [Development Workflow](#development-workflow)
8. [Deployment](#deployment)

---

## 🔧 Prerequisites

### Required Software
- **Node.js** v20+ ([Download](https://nodejs.org/))
- **npm** v10+ (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Docker** (optional, for containerized deployment)

### Required Accounts
1. **MongoDB Atlas** (Free tier available) - [Sign up](https://www.mongodb.com/cloud/atlas/register)
2. **OpenAI** (Optional, $5-20/month) - [Sign up](https://platform.openai.com/signup)
3. **OpenRouter** (Free tier available) - [Sign up](https://openrouter.ai/)
4. **Cloudinary** (Free tier) - [Sign up](https://cloudinary.com/users/register_free)
5. **Stripe** (Test mode free) - [Sign up](https://dashboard.stripe.com/register)

---

## ⚙️ Environment Setup

### 1. Clone Repository
```bash
cd "C:\Users\patri\Downloads\Tangerine clone"
cd tangerine-furniture-v2
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# This will automatically install all workspace dependencies
# (frontend, backend, admin, shared)
```

---

## 🗄️ MongoDB Atlas Setup

### Step 1: Create Cluster
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click "Build a Database"
3. Choose **FREE** tier (M0 Sandbox)
4. Select region: **Africa** or closest to Kenya
5. Name cluster: `tangerine-furniture`
6. Click "Create"

### Step 2: Create Database User
1. Go to **Database Access**
2. Click "Add New Database User"
3. Username: `tangerine-admin`
4. Password: Generate strong password (save it!)
5. Database User Privileges: **Atlas admin**
6. Click "Add User"

### Step 3: Configure Network Access
1. Go to **Network Access**
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
   - IP: `0.0.0.0/0`
4. Click "Confirm"

### Step 4: Get Connection String
1. Go to **Database** > **Connect**
2. Choose "Connect your application"
3. Driver: **Node.js**
4. Copy connection string:
```
mongodb+srv://tangerine-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
5. Replace `<password>` with your actual password
6. Add database name: `tangerine-furniture`

Final connection string:
```
mongodb+srv://tangerine-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/tangerine-furniture?retryWrites=true&w=majority
```

---

## 🤖 OpenAI & OpenRouter Setup

### Option 1: OpenAI (Paid - Best Quality)
1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Name: `Tangerine Furniture`
4. Copy the key: `sk-proj-xxxxxxxxxxxxx`
5. Add $5-$20 credit at [Billing](https://platform.openai.com/account/billing)

**Cost Estimate:**
- GPT-4 Turbo: ~$0.01-0.03 per request
- Monthly: $10-50 depending on usage
- Best for: Production with high quality requirements

### Option 2: OpenRouter (Free/Cheap - Good Quality)
1. Go to [OpenRouter](https://openrouter.ai/)
2. Sign up with Google/GitHub
3. Go to [API Keys](https://openrouter.ai/keys)
4. Click "Create Key"
5. Copy key: `sk-or-xxxxxxxxxxxxx`

**Free Models Available:**
- `google/gemini-pro-1.5` (Free)
- `meta-llama/llama-3.1-8b-instruct` (Free)
- `microsoft/phi-3-mini-128k-instruct` (Free)

**Recommended Setup:**
- Use **OpenAI** as primary (if budget allows)
- Use **OpenRouter** as fallback (always free backup)
- Our code automatically falls back if primary fails!

---

## 📝 Configuration

### Backend Environment (.env)

Create `backend/.env`:
```env
# Server
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# MongoDB Atlas (paste your connection string)
MONGODB_URI=mongodb+srv://tangerine-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/tangerine-furniture?retryWrites=true&w=majority

# Redis (local or cloud)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# JWT Secrets (generate random strings)
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string-min-32-chars
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-also-change-this-min-32-chars
JWT_REFRESH_EXPIRE=30d

# OpenAI (Primary - Optional but Recommended)
OPENAI_API_KEY=sk-proj-your-openai-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# OpenRouter (Fallback - Free)
OPENROUTER_API_KEY=sk-or-your-openrouter-key-here
OPENROUTER_MODEL=openai/gpt-oss-20b:free
USE_OPENROUTER_FALLBACK=true

# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (Gmail)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=Tangerine Furniture <noreply@tangerinefurniture.co.ke>

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Environment (.env.local)

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 🚀 Running the Application

### Development Mode

```bash
# Run all services concurrently
npm run dev
```

This starts:
- ✅ Frontend: http://localhost:3000
- ✅ Backend: http://localhost:5000
- ✅ Admin: http://localhost:5173

### Individual Services

```bash
# Frontend only
cd frontend && npm run dev

# Backend only
cd backend && npm run dev

# Admin only
cd admin && npm run dev
```

### Test the Setup

1. **Backend Health Check:**
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "environment": "development"
}
```

2. **Test AI Chatbot:**
```bash
curl -X POST http://localhost:5000/api/v1/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, show me sofas", "sessionId": "test-123"}'
```

3. **Frontend:** Open http://localhost:3000
4. **Admin Dashboard:** Open http://localhost:5173

---

## 🛠️ Development Workflow

### Adding New Features

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# ...

# Test
npm run lint
npm run test

# Commit
git add .
git commit -m "feat: add new feature"

# Push
git push origin feature/new-feature
```

### Database Seeding

```bash
cd backend
npm run seed
```

This creates:
- Sample products
- Categories
- Admin user

---

## 🐳 Docker Deployment

### Build & Run

```bash
# Start all services
npm run docker:up

# Stop all services
npm run docker:down
```

Services:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Admin: http://localhost:5173
- MongoDB: Internal
- Redis: Internal

---

## 📊 Monitoring & Logs

### View Logs

```bash
# Backend logs
cd backend && tail -f logs/combined.log

# Docker logs
docker-compose logs -f backend
```

### Performance Monitoring

- MongoDB Atlas: Built-in monitoring
- Redis: Use RedisInsight
- Application: Winston logger

---

## 🔐 Security Checklist

### Before Production

- [ ] Change all default secrets
- [ ] Enable MongoDB IP whitelist
- [ ] Set up SSL/TLS certificates
- [ ] Enable Stripe webhook signatures
- [ ] Set up CORS properly
- [ ] Enable rate limiting
- [ ] Set up backup strategy
- [ ] Configure monitoring alerts
- [ ] Review security headers (Helmet)
- [ ] Enable 2FA for admin accounts

---

## 🆘 Troubleshooting

### MongoDB Connection Failed

```bash
# Check connection string
# Verify IP whitelist
# Check database user password
```

### OpenAI/OpenRouter Errors

```bash
# Verify API keys
# Check account credits
# Review rate limits
```

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Change port in .env
PORT=5001
```

---

## 📚 Additional Resources

- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [OpenRouter Docs](https://openrouter.ai/docs)
- [Stripe Docs](https://stripe.com/docs)

---

## 💡 Quick Start Commands

```bash
# First time setup
npm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
# Edit .env files with your credentials

# Development
npm run dev

# Production build
npm run build

# Production start
npm run start

# Docker
npm run docker:up
```

---

## 👥 Support

For issues:
1. Check this guide
2. Review error logs
3. Check documentation
4. Create GitHub issue

Happy coding! 🚀

