# Deployment Guide - ChopNow

Complete guide for deploying ChopNow to production.

## 🎯 Deployment Overview

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend   │◄────────│   Backend    │◄────────│  PostgreSQL  │
│  (Vercel/    │  API    │  (Railway/   │  Query  │  (Neon/      │
│   Netlify)   │  Calls  │   Render)    │         │   Supabase)  │
└──────────────┘         └──────────────┘         └──────────────┘
      PWA                    REST API                Database
```

## 📦 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations tested
- [ ] API endpoints tested
- [ ] Frontend connects to backend successfully
- [ ] PWA features working (production build)
- [ ] Security headers configured
- [ ] CORS configured correctly
- [ ] Error logging setup
- [ ] Performance optimized

## 🗄 Database Deployment

### Option 1: Neon (Recommended)

**Pros**: Serverless PostgreSQL, free tier, auto-scaling  
**Free Tier**: 3GB storage, 1 project

1. **Create Account**: [neon.tech](https://neon.tech)

2. **Create Project**:
   - Project name: `chopnow`
   - Region: Choose closest to your users
   - PostgreSQL version: 14+

3. **Get Connection String**:
   ```
   postgresql://user:password@host.neon.tech/chopnow?sslmode=require
   ```

4. **Save for Backend**:
   ```env
   DATABASE_URL="postgresql://user:password@host.neon.tech/chopnow?sslmode=require"
   ```

### Option 2: Supabase

**Pros**: Free tier, includes auth (optional), real-time (optional)  
**Free Tier**: 500MB database, 2GB bandwidth

1. **Create Account**: [supabase.com](https://supabase.com)

2. **Create Project**:
   - Name: `chopnow`
   - Database password: (save this)
   - Region: Choose closest

3. **Get Connection String**:
   - Go to Settings → Database
   - Copy Connection String (Session mode)

4. **Configure**:
   ```env
   DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
   ```

### Option 3: Railway PostgreSQL

**Pros**: Integrated with Railway backend deployment  
**Free Tier**: $5 credit per month

1. Create database with Railway CLI
2. Automatically linked to backend service

---

## 🔧 Backend Deployment

### Option 1: Railway (Recommended)

**Pros**: Easy deployment, integrated database, auto-deploy from Git  
**Free Tier**: $5 credit per month

#### Steps:

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**:
   ```bash
   railway login
   ```

3. **Initialize Project** (from backend directory):
   ```bash
   cd backend
   railway init
   ```

4. **Add PostgreSQL**:
   ```bash
   railway add postgresql
   ```

5. **Set Environment Variables**:
   ```bash
   railway variables set JWT_SECRET="your_production_secret"
   railway variables set WHATSAPP_BUSINESS_NUMBER="2348012345678"
   railway variables set CORS_ORIGIN="https://your-frontend-domain.vercel.app"
   railway variables set NODE_ENV="production"
   ```

6. **Deploy**:
   ```bash
   railway up
   ```

7. **Run Migrations**:
   ```bash
   railway run npm run prisma:migrate
   railway run npm run prisma:seed
   ```

8. **Get Domain**:
   - Railway provides: `your-app.railway.app`
   - Or connect custom domain

#### Railway Configuration

Create `railway.toml`:
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm run start"
healthcheckPath = "/health"
restartPolicyType = "ON_FAILURE"
```

### Option 2: Render

**Pros**: Free tier available, auto-deploy from Git  
**Free Tier**: 750 hours/month, sleeps after 15min inactivity

1. **Create Account**: [render.com](https://render.com)

2. **Create Web Service**:
   - Connect GitHub repository
   - Root directory: `backend`
   - Build Command: `npm install && npm run build && npx prisma generate`
   - Start Command: `npm start`

3. **Environment Variables**:
   ```
   DATABASE_URL=your_database_url
   JWT_SECRET=your_secret
   WHATSAPP_BUSINESS_NUMBER=2348012345678
   CORS_ORIGIN=https://your-frontend.netlify.app
   NODE_ENV=production
   ```

4. **Create PostgreSQL Database** (separate service):
   - Add PostgreSQL from Render dashboard
   - Link to web service

5. **Deploy**:
   - Push to GitHub
   - Auto-deploys on push

### Option 3: Heroku

1. **Install Heroku CLI**

2. **Create App**:
   ```bash
   heroku create chopnow-api
   ```

3. **Add PostgreSQL**:
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Set Environment Variables**:
   ```bash
   heroku config:set JWT_SECRET="your_secret"
   heroku config:set WHATSAPP_BUSINESS_NUMBER="2348012345678"
   heroku config:set CORS_ORIGIN="https://your-frontend.vercel.app"
   ```

5. **Deploy**:
   ```bash
   git subtree push --prefix backend heroku main
   ```

6. **Run Migrations**:
   ```bash
   heroku run npm run prisma:migrate
   heroku run npm run prisma:seed
   ```

---

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended)

**Pros**: Optimized for Angular, auto-deploy from Git, free SSL  
**Free Tier**: 100GB bandwidth

#### Steps:

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy** (from frontend directory):
   ```bash
   cd frontend
   vercel
   ```

3. **Configure** (vercel.json):
   ```json
   {
     "version": 2,
     "public": false,
     "buildCommand": "ng build --configuration production",
     "outputDirectory": "dist/frontend/browser",
     "framework": "angular"
   }
   ```

4. **Environment Variables** (Vercel Dashboard):
   ```
   NG_APP_API_URL=https://your-backend.railway.app/api
   NG_APP_WHATSAPP_NUMBER=2348012345678
   ```

5. **Production Build**:
   ```bash
   vercel --prod
   ```

6. **Custom Domain** (optional):
   - Add in Vercel dashboard
   - Update DNS records

### Option 2: Netlify

**Pros**: Free tier, easy deployment, PWA-friendly  
**Free Tier**: 100GB bandwidth

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   cd frontend
   netlify deploy
   ```

3. **Configure** (netlify.toml):
   ```toml
   [build]
     command = "ng build --configuration production"
     publish = "dist/frontend/browser"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

4. **Environment Variables**:
   ```
   NG_APP_API_URL=https://your-backend.railway.app/api
   NG_APP_WHATSAPP_NUMBER=2348012345678
   ```

5. **Production Deploy**:
   ```bash
   netlify deploy --prod
   ```

### Option 3: Firebase Hosting

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize**:
   ```bash
   cd frontend
   firebase init hosting
   ```

3. **Configure** (firebase.json):
   ```json
   {
     "hosting": {
       "public": "dist/frontend/browser",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [{
         "source": "**",
         "destination": "/index.html"
       }]
     }
   }
   ```

4. **Deploy**:
   ```bash
   ng build --configuration production
   firebase deploy
   ```

---

## 🔒 Production Environment Variables

### Backend (.env.production)

```env
# Node
NODE_ENV=production
PORT=3000

# Database (from Neon/Supabase/Railway)
DATABASE_URL="postgresql://..."

# JWT (Generate strong secret)
JWT_SECRET="your_super_secure_production_secret_min_32_chars"
JWT_EXPIRES_IN=7d

# WhatsApp
WHATSAPP_BUSINESS_NUMBER=2348012345678

# CORS (Your frontend URL)
CORS_ORIGIN=https://chopnow.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (environment.prod.ts)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend.railway.app/api',
  whatsappBusinessNumber: '2348012345678',
  appName: 'ChopNow',
  version: '1.0.0'
};
```

---

## ✅ Post-Deployment Verification

### 1. Backend Health Check

```bash
curl https://your-backend.railway.app/health
```

Expected:
```json
{
  "success": true,
  "message": "ChopNow API is running"
}
```

### 2. Database Connection

```bash
# Check Prisma Studio
railway run npm run prisma:studio
```

### 3. API Endpoints

```bash
# Test categories
curl https://your-backend.railway.app/api/categories

# Test login
curl -X POST https://your-backend.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@chopnow.ng","password":"Admin123!"}'
```

### 4. Frontend Access

- Open: `https://your-frontend.vercel.app`
- Test PWA install prompt
- Check service worker registration
- Test offline functionality
- Verify WhatsApp integration

### 5. PWA Features

**On Mobile:**
- Add to Home Screen works
- App icon appears correctly
- App opens in standalone mode
- Splash screen displays

**On Desktop:**
- Install prompt appears
- App installs successfully

---

## 🔧 Maintenance

### Update Backend

**Railway:**
```bash
# Push to GitHub (auto-deploys)
git push origin main

# Or manual
railway up
```

**Migrations:**
```bash
railway run npx prisma migrate deploy
```

### Update Frontend

**Vercel:**
```bash
# Push to GitHub (auto-deploys)
git push origin main

# Or manual
vercel --prod
```

### Database Backup

**Neon:**
- Automatic daily backups
- Point-in-time recovery

**Supabase:**
```bash
# Manual backup
pg_dump $DATABASE_URL > backup.sql
```

**Railway:**
```bash
railway run pg_dump $DATABASE_URL > backup.sql
```

---

## 🔍 Monitoring & Logging

### Backend Monitoring

**Railway:**
- Built-in logs and metrics
- View at: railway.app → Project → Logs

**Sentry (Error Tracking):**
```bash
npm install @sentry/node
```

Configure in `server.ts`:
```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

### Frontend Monitoring

**Vercel Analytics:**
- Enable in Vercel dashboard
- Automatically tracks performance

**Google Analytics (optional):**
```typescript
// In index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

---

## 🚨 Troubleshooting

### Backend Issues

**Issue: Database connection failed**
- Check DATABASE_URL is correct
- Verify database is accessible
- Check IP whitelisting (if any)

**Issue: CORS errors**
- Update CORS_ORIGIN to match frontend URL
- Ensure protocol (https) matches

**Issue: Migrations failed**
- Run manually: `railway run npx prisma migrate deploy`
- Check database permissions

### Frontend Issues

**Issue: API calls failing**
- Verify apiUrl in environment.prod.ts
- Check CORS on backend
- Inspect network tab for errors

**Issue: PWA not installing**
- Must use HTTPS (not http)
- Check manifest.webmanifest
- Verify ngsw-config.json

---

## 💰 Cost Estimation

### Free Tier Setup

| Service | Cost | Limits |
|---------|------|--------|
| Neon Database | Free | 3GB storage |
| Railway Backend | Free* | $5 credit/month |
| Vercel Frontend | Free | 100GB bandwidth |
| **Total** | **$0** | Good for MVP |

*Railway requires credit card but gives $5/month credit

### Paid Tier (Scale)

| Service | Cost | Capacity |
|---------|------|----------|
| Neon Pro | $19/mo | 10GB storage |
| Railway | ~$10-20/mo | Based on usage |
| Vercel Pro | $20/mo | 1TB bandwidth |
| **Total** | **~$50/mo** | 1000+ daily users |

---

## 🎯 Deployment Checklist

- [ ] Database deployed and seeded
- [ ] Backend deployed and health check passing
- [ ] Frontend deployed and connecting to backend
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] JWT secret is strong and secure
- [ ] PWA manifest configured
- [ ] Service worker active
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (HTTPS)
- [ ] Error monitoring setup
- [ ] Backup strategy in place
- [ ] WhatsApp integration tested

---

**Deployed!** 🚀

Your ChopNow app is now live and ready for customers!

Monitor performance, collect feedback, and iterate.
