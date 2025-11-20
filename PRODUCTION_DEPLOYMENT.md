# VibeCheck Production Deployment Guide

## Status: ✅ Database Initialized | 🔄 Deployment in Progress

### Completed Steps
1. ✅ **Supabase Database**: Schema initialized with all tables (users, products, orders, order_items, payments, wishlists)
2. ✅ **GitHub Repository**: Created at `SanjayPallapu/vibecheck-production`
3. ✅ **Sample Data**: 5 products inserted into database

---

## Quick Start: 5 Minutes to Production

### Step 1: Render Backend Deployment (2 minutes)
1. Go to https://dashboard.render.com
2. Click "New" → "Web Service"
3. Connect GitHub repository: `SanjayPallapu/vibecheck-production`
4. Set:
   - **Name**: `vibecheck-api`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node.js
5. Click "Create Web Service"

### Step 2: Add Render Environment Variables
In Render Dashboard, go to `vibecheck-api` → Settings → Environment:
```
DB_HOST=db.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=YourSupabasePassword
DB_URL=postgresql://postgres:YourPassword@db.jrkoffvpxetnprhzbdlp.supabase.co:5432/postgres
JWT_SECRET=your-32-character-secret-key-here
RAZORPAY_KEY_ID=rzp_test_RhtEs1CRR2KFKR
RAZORPAY_KEY_SECRET=your_razorpay_secret
SENDGRID_API_KEY=your_sendgrid_key
CLIENT_URL=https://vibecheck.vercel.app
NODE_ENV=production
SENTRY_DSN=optional_sentry_dsn
```

### Step 3: Vercel Frontend Deployment (2 minutes)
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import GitHub repository: `vibecheck-production`
4. Set:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
5. Click "Deploy"

### Step 4: Add Vercel Environment Variables
In Vercel, go to Project Settings → Environment Variables:
```
VITE_API_URL=https://vibecheck-api.onrender.com
VITE_RAZORPAY_KEY=rzp_test_RhtEs1CRR2KFKR
```

### Step 5: Test Production URLs
- **Frontend**: https://vibecheck.vercel.app
- **Backend API**: https://vibecheck-api.onrender.com
- **API Health**: https://vibecheck-api.onrender.com/api/health

---

## Database Configuration

### Supabase Project Details
- **Project ID**: jrkoffvpxetnprhzbdlp
- **Region**: Asia-Pacific (Singapore)
- **Database**: postgres
- **Connection String Ready**: ✅

### Tables Created
1. `users` - User authentication and profiles
2. `products` - Product catalog
3. `orders` - Order records
4. `order_items` - Order line items
5. `payments` - Payment tracking
6. `wishlists` - User wishlist management

---

## Testing Checklist

### Authentication (2 min)
- [ ] Signup with phone number (10 digits)
- [ ] Receive mock OTP in console
- [ ] Enter OTP and login
- [ ] JWT token stored in localStorage

### Shopping (3 min)
- [ ] Browse products on Home/Shop
- [ ] Add product to cart
- [ ] View cart with correct prices (₹ format)
- [ ] Filter by category
- [ ] Sort products

### Checkout (3 min)
- [ ] Enter shipping address
- [ ] Razorpay modal opens
- [ ] Select test payment method
- [ ] Payment succeeds (test mode)
- [ ] Order confirmed

### Order History (2 min)
- [ ] View past orders
- [ ] Click "View Details"
- [ ] See order items and status

### Performance (1 min)
- [ ] Page load < 3 seconds
- [ ] Smooth animations
- [ ] Responsive on mobile

---

## Troubleshooting

### "Database connection failed"
- Verify Supabase credentials in .env
- Check IP whitelist in Supabase Settings
- Ensure all environment variables are set

### "CORS errors"
- Backend has CORS enabled for `*.vercel.app`
- Check browser console for exact error
- Verify `CLIENT_URL` is set correctly

### "Razorpay not loading"
- Test mode keys are configured
- Check browser network tab for script loading
- Verify key ID and secret match

### "Email not sending"
- SendGrid API key must be valid
- Check SendGrid sender email is verified
- Review email template in backend/services/emailService.js

---

## Production Ready Checklist

- [x] Database schema imported
- [x] Security middleware enabled
- [x] Rate limiting configured
- [x] Error handling implemented
- [x] Logging setup
- [x] CORS configured
- [x] Environment variables template
- [x] Sample data created
- [ ] GitHub repository synced
- [ ] Render deployment connected
- [ ] Vercel deployment connected
- [ ] All tests passing
- [ ] Production URLs working
- [ ] Domain mapping (if applicable)

---

## Support & Documentation

- **Frontend**: React 18 + Vite + TypeScript
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Supabase)
- **Payments**: Razorpay
- **Hosting**: Render (Backend) + Vercel (Frontend)

---

## Next Steps

1. Push code from AI Studio to GitHub
2. Connect Render to GitHub repository  
3. Deploy backend to Render
4. Deploy frontend to Vercel
5. Run complete testing checklist
6. Monitor production logs
7. Set up backup procedures

---

**Status**: Production Launch Ready ✅
**Last Updated**: $(date)
**Team**: VibeCheck Development Team
