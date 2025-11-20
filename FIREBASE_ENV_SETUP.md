# Firebase Phone Authentication - Environment Setup

## Quick Setup Guide

### Step 1: Install Firebase

```bash
cd frontend
npm install firebase
```

### Step 2: Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **vibecheck-ea3ce**
3. Click ⚙️ **Settings** → **Project Settings**
4. Under "Your apps", find your Web app
5. Copy the configuration

### Step 3: Create Environment Files

#### Development (.env.local)
```
REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=vibecheck-ea3ce.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=vibecheck-ea3ce
REACT_APP_FIREBASE_STORAGE_BUCKET=vibecheck-ea3ce.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
```

#### Production (.env.production)
```
REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=vibecheck-ea3ce.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=vibecheck-ea3ce
REACT_APP_FIREBASE_STORAGE_BUCKET=vibecheck-ea3ce.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
```

### Step 4: Add Authorized Domains

1. Firebase Console → **Authentication** → **Settings**
2. Scroll to **Domains** → **Authorized domains**
3. Add these domains:
   - `localhost:3000` (development)
   - `vibecheck-production.vercel.app` (Vercel)
   - `vibecheck-production.onrender.com` (Render)
   - `your-custom-domain.com` (production)

### Step 5: Configure reCAPTCHA

1. Firebase Console → **Authentication** → **Settings**
2. Find **reCAPTCHA** section → Click **Manage reCAPTCHA**
3. In Google Cloud Console:
   - Create reCAPTCHA v3 key
   - Add domains
   - Copy Site Key and Secret Key
4. Back in Firebase → Add your reCAPTCHA key

### Step 6: Restart Development Server

```bash
npm start
```

## Vercel Deployment

### Add Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project
3. Settings → **Environment Variables**
4. Add all Firebase environment variables:
   - `REACT_APP_FIREBASE_API_KEY`
   - `REACT_APP_FIREBASE_AUTH_DOMAIN`
   - `REACT_APP_FIREBASE_PROJECT_ID`
   - `REACT_APP_FIREBASE_STORAGE_BUCKET`
   - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
   - `REACT_APP_FIREBASE_APP_ID`
5. Redeploy your application

## Render Deployment

### Add Environment Variables

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your service
3. Settings → **Environment**
4. Add all Firebase environment variables
5. Redeploy

## Testing

### Local Testing
```bash
npm start
# Visit http://localhost:3000/login
```

### Test Phone Numbers
- +1 555 555 0100 to +1 555 555 0199 (US)
- Add custom test numbers in Firebase Console

### Test Flow
1. Enter phone number
2. Verify reCAPTCHA appears
3. Click "Send OTP"
4. Verify SMS is received
5. Enter OTP
6. Verify authentication success

## Common Issues

### "reCAPTCHA not found"
- Check domain is in Firebase authorized domains
- Verify reCAPTCHA container ID in HTML
- Clear browser cache

### "API key invalid"
- Check .env file is loaded
- Restart dev server
- Verify API key format

### "Domain not authorized"
- Add domain to Firebase authorized domains
- Wait 5-10 minutes for propagation
- Clear browser cookies

## Checklist

- [ ] Firebase project created
- [ ] Phone Auth enabled
- [ ] reCAPTCHA configured
- [ ] Environment variables set
- [ ] Authorized domains added
- [ ] npm install firebase
- [ ] Dev server tested
- [ ] OTP delivery verified
- [ ] Vercel deployed
- [ ] Production tested
