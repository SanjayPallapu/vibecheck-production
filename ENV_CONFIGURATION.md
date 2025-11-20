# Environment Configuration Guide

## VibeCheck Production Environment Variables

### Backend Configuration (.env)

Create a `.env` file in the `backend/` directory with these variables:

```bash
# Database Connection (Supabase)
DB_HOST=db.jrkoffvpxetnprhzbdlp.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=YOUR_SUPABASE_PASSWORD
DB_URL=postgresql://postgres:YOUR_PASSWORD@db.jrkoffvpxetnprhzbdlp.supabase.co:5432/postgres

# JWT Configuration
JWT_SECRET=your-32-character-secret-key-here-min-32-chars
JWT_EXPIRES_IN=7d

# Razorpay Keys (Test Mode)
RAZORPAY_KEY_ID=rzp_test_RhtEs1CRR2KFKR
RAZORPAY_KEY_SECRET=your_razorpay_test_secret_key

# SendGrid Email Service
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@vibecheck.com

# Frontend URL (for CORS)
CLIENT_URL=https://vibecheck.vercel.app

# Server Configuration
NODE_ENV=production
PORT=5000
LOG_LEVEL=info

# Error Tracking (Optional)
SENTRY_DSN=https://your-sentry-dsn-here
```

### Frontend Configuration (.env)

Create a `.env` file in the root directory with these variables:

```bash
# API Configuration
VITE_API_URL=https://vibecheck-api.onrender.com

# Razorpay Configuration
VITE_RAZORPAY_KEY=rzp_test_RhtEs1CRR2KFKR

# Google Gemini API (Optional for AI features)
VITE_GEMINI_API_KEY=your_gemini_api_key
```

---

## Getting Your Credentials

### 1. Supabase Database Credentials

**Already Set Up!** Your database is at:
- **Project ID**: `jrkoffvpxetnprhzbdlp`
- **Region**: Asia-Pacific (Singapore)
- **Database**: postgres

**To get connection details:**
1. Go to https://supabase.com/dashboard
2. Select project `jrkoffvpxetnprhzbdlp`
3. Go to Settings → Database
4. Copy connection string or individual credentials

### 2. Razorpay API Keys

These are **test keys** ready to use:
- **Key ID**: `rzp_test_RhtEs1CRR2KFKR`
- **Key Secret**: Get from your Razorpay dashboard

**To set up:**
1. Go to https://dashboard.razorpay.com
2. Settings → API Keys
3. Copy Test Key ID and Secret

### 3. SendGrid API Key

**To set up:**
1. Go to https://app.sendgrid.com
2. Settings → API Keys
3. Create new API Key
4. Copy and paste in `.env`

### 4. JWT Secret

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use the output as your `JWT_SECRET`.

---

## Render Backend Setup

1. Go to https://dashboard.render.com
2. Select your `vibecheck-api` service
3. Go to Settings → Environment
4. Add all variables from Backend Configuration above
5. Click Save
6. Service will redeploy automatically

---

## Vercel Frontend Setup

1. Go to https://vercel.com/dashboard
2. Select your vibecheck project
3. Settings → Environment Variables
4. Add all variables from Frontend Configuration above
5. Click Save
6. Redeploy from Git

---

## Local Development Setup

### 1. Backend
```bash
cd backend
cp .env.example .env  # Copy template if exists
# Edit .env with your local values:
DB_URL=postgresql://postgres:password@localhost:5432/vibecheck
NODE_ENV=development

npm install
npm start
```

### 2. Frontend
```bash
cd ..
cp .env.example .env  # Copy template if exists
# Edit .env with local backend URL:
VITE_API_URL=http://localhost:5000

npm install
npm run dev
```

---

## Verification Checklist

- [ ] All `.env` variables added
- [ ] Database connection string verified
- [ ] Razorpay keys are test keys (OK for development)
- [ ] SendGrid API key is active
- [ ] JWT secret is 32+ characters
- [ ] Frontend API URL points to backend
- [ ] Backend CLIENT_URL points to frontend
- [ ] No `.env` files committed to Git
- [ ] `.env.example` files created for templates

---

## Security Best Practices

✅ **DO:**
- Keep `.env` files out of Git
- Use strong JWT secrets (32+ characters)
- Rotate API keys regularly
- Use test keys for development
- Use production keys only in production
- Restrict database IP access in Supabase

❌ **DON'T:**
- Commit `.env` files to version control
- Share API keys via email or chat
- Use same keys for dev and production
- Store credentials in code
- Use weak secrets

---

## Troubleshooting

### "Cannot connect to database"
- Verify DB_URL is correct
- Check Supabase IP whitelist settings
- Ensure PostgreSQL password is correct

### "Invalid Razorpay key"
- Use test keys (start with `rzp_test_`)
- Verify key ID and secret match
- Don't mix test and live keys

### "SendGrid email not sending"
- Verify API key is active
- Check sender email is verified
- Ensure email template exists

### "JWT token errors"
- Verify JWT_SECRET is set and 32+ chars
- Check token hasn't expired
- Ensure secret matches between requests

---

## Render Deployment Variables

Copy-paste ready for Render dashboard:

**Environment Variables (for Render):**
```
DB_HOST=db.jrkoffvpxetnprhzbdlp.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=[YOUR_PASSWORD]
DB_URL=postgresql://postgres:[PASSWORD]@db.jrkoffvpxetnprhzbdlp.supabase.co:5432/postgres
JWT_SECRET=[GENERATE_SECURE_KEY]
RAZORPAY_KEY_ID=rzp_test_RhtEs1CRR2KFKR
RAZORPAY_KEY_SECRET=[YOUR_SECRET]
SENDGRID_API_KEY=[YOUR_KEY]
CLIENT_URL=https://vibecheck.vercel.app
NODE_ENV=production
PORT=5000
```

---

## Vercel Deployment Variables

**Environment Variables (for Vercel):**
```
VITE_API_URL=https://vibecheck-api.onrender.com
VITE_RAZORPAY_KEY=rzp_test_RhtEs1CRR2KFKR
```

---

**Last Updated**: November 20, 2025
**Status**: ✅ Ready for Production
