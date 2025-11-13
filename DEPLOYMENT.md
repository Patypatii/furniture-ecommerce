# 🚀 Deployment Guide - Tangerine Furniture v2.0

## 📋 Overview

This guide covers deploying Tangerine Furniture to production using various methods.

---

## 🌐 Production Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) [Recommended for Start]

#### Frontend on Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd frontend
vercel

# Add environment variables in Vercel Dashboard:
# NEXT_PUBLIC_API_URL=https://your-backend-url.up.railway.app/api/v1
# NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...
```

#### Backend on Railway
1. Go to [Railway.app](https://railway.app/)
2. Click "New Project"
3. Connect GitHub repository
4. Select `backend` folder
5. Add environment variables
6. Deploy

**Cost:** Free tier available, ~$5-20/month for production

---

### Option 2: Docker on VPS (DigitalOcean/Linode)

#### 1. Setup VPS
```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y
```

#### 2. Deploy Application
```bash
# Clone repository
git clone https://github.com/your-repo/tangerine-furniture-v2.git
cd tangerine-furniture-v2

# Create .env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Edit with production values
nano backend/.env
nano frontend/.env.local

# Build and run
docker-compose -f infrastructure/docker/docker-compose.yml up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

#### 3. Setup Domain & SSL
```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d tangerinefurniture.co.ke -d www.tangerinefurniture.co.ke

# Auto-renewal
certbot renew --dry-run
```

**Cost:** $5-20/month for VPS

---

### Option 3: AWS (Scalable Production)

#### Services Used:
- **Frontend:** AWS Amplify or S3 + CloudFront
- **Backend:** EC2 or ECS (Docker)
- **Database:** MongoDB Atlas (managed)
- **Storage:** S3 for images/models
- **CDN:** CloudFront

#### Quick Setup:
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS
aws configure

# Deploy using Elastic Beanstalk
eb init -p docker tangerine-furniture
eb create tangerine-production
eb deploy
```

**Cost:** ~$50-200/month depending on traffic

---

## 🔐 Production Checklist

### Before Going Live

#### 1. Environment Variables
```bash
# Backend
✓ MONGODB_URI → Production MongoDB Atlas connection
✓ REDIS_URL → Production Redis (Upstash/Redis Cloud)
✓ OPENAI_API_KEY → Valid OpenAI key
✓ OPENROUTER_API_KEY → Valid OpenRouter key
✓ STRIPE_SECRET_KEY → Live key (not test)
✓ CLOUDINARY_* → Production credentials
✓ JWT_SECRET → Strong random string (min 32 chars)
✓ NODE_ENV=production

# Frontend
✓ NEXT_PUBLIC_API_URL → Production API URL
✓ NEXT_PUBLIC_STRIPE_PUBLIC_KEY → Live public key
```

#### 2. Security
```bash
✓ Change all default passwords
✓ Enable MongoDB IP whitelist
✓ Setup firewall rules
✓ Enable HTTPS/SSL
✓ Configure CORS properly
✓ Enable rate limiting
✓ Setup monitoring & alerts
✓ Enable 2FA for admin accounts
✓ Review security headers
✓ Setup backup strategy
```

#### 3. Performance
```bash
✓ Enable Redis caching
✓ Optimize images (WebP/AVIF)
✓ Enable CDN
✓ Minify assets
✓ Enable gzip compression
✓ Setup database indexes
✓ Configure monitoring
```

#### 4. Testing
```bash
✓ Test all user flows
✓ Test payment integration
✓ Test email delivery
✓ Test AI chatbot
✓ Load test API endpoints
✓ Test mobile responsiveness
✓ Cross-browser testing
```

---

## 📊 Monitoring & Maintenance

### Application Monitoring
```bash
# Setup services:
- Sentry (Error tracking)
- New Relic (Performance)
- LogRocket (User sessions)
- Google Analytics (Traffic)
```

### Database Backup
```bash
# MongoDB Atlas Automated Backups (Enabled by default)
# Manual backup
mongodump --uri="your-mongodb-uri" --out=/backups/$(date +%Y%m%d)

# Restore
mongorestore --uri="your-mongodb-uri" /backups/20240115
```

### Logs
```bash
# View backend logs
docker-compose logs -f backend

# View specific container
docker logs tangerine-backend --tail 100 -f

# System logs
journalctl -u docker -f
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm install
        
      - name: Run tests
        run: npm run test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## 🌍 Scaling Strategy

### Traffic: 0-1K users/day
- Single VPS ($10/month)
- MongoDB Atlas Free/Shared tier
- Redis Cloud Free tier
- Vercel Free tier

### Traffic: 1K-10K users/day
- 2x VPS with load balancer ($40/month)
- MongoDB Atlas M10 ($57/month)
- Redis Cloud Standard ($15/month)
- CDN (Cloudflare Free)

### Traffic: 10K+ users/day
- Auto-scaling (AWS ECS/EKS)
- MongoDB Atlas M30+ ($250+/month)
- ElastiCache Redis
- Full AWS/GCP infrastructure

---

## 🆘 Troubleshooting

### Site Down
```bash
# Check services
docker-compose ps

# Restart all services
docker-compose restart

# Check logs
docker-compose logs --tail=100
```

### Database Connection Issues
```bash
# Test MongoDB connection
mongosh "your-mongodb-uri"

# Check network access
# MongoDB Atlas > Network Access > IP Whitelist
```

### High CPU Usage
```bash
# Check Docker stats
docker stats

# Scale services
docker-compose up -d --scale backend=3
```

---

## 📞 Support & Maintenance

### Monthly Tasks
- Review error logs
- Check performance metrics
- Update dependencies
- Review security advisories
- Database optimization
- Backup verification

### Quarterly Tasks
- Security audit
- Performance review
- Cost optimization
- Feature planning

---

## 💰 Estimated Monthly Costs

### Startup (< 1K users)
- Hosting: $0-20
- MongoDB: $0-10
- Redis: $0
- Total: **$0-30/month**

### Growth (1K-10K users)
- Hosting: $40-80
- MongoDB: $57
- Redis: $15
- CDN: $0-20
- Total: **$112-172/month**

### Scale (10K+ users)
- Infrastructure: $200-500
- Database: $250+
- Services: $100+
- Total: **$550-1000+/month**

---

## ✅ Post-Deployment

1. Test all functionality in production
2. Setup monitoring & alerts
3. Configure backup schedule
4. Document custom procedures
5. Train team on deployment process
6. Setup incident response plan

---

## 🎉 You're Live!

Congratulations! Your Tangerine Furniture platform is now live.

**Next Steps:**
1. Monitor error logs daily
2. Track performance metrics
3. Gather user feedback
4. Plan feature updates
5. Optimize based on data

For support: [Your support channel]

