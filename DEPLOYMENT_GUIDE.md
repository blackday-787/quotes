# Deployment Guide - Step by Step

This guide walks you through deploying your Daily Quotes app with all the stopping points where you need to take action.

## 🎯 Overview

You'll be setting up:
1. Railway account (for hosting the backend)
2. Expo account (for the mobile app)
3. Deploying the backend
4. Running the mobile app

**Total time:** ~15 minutes  
**Cost:** $0 (completely free)

---

## 📋 Phase 1: Local Testing (Optional but Recommended)

Before deploying, you can test everything locally:

```bash
# Install backend dependencies
cd backend
npm install

# Start the server
npm start
```

The server will run on http://localhost:3000

**Test it:**
1. Open http://localhost:3000 in your browser
2. Add a few test quotes
3. Check that they appear in the list
4. Look at the queue status

✅ If the web interface works, you're ready to deploy!

---

## 🚂 Phase 2: Railway Deployment

**⏸️ STOP - You need to do this:**

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Click "Sign up" or "Login with GitHub"
3. Choose "Login with GitHub" (easiest)
4. Authorize Railway to access your GitHub account
5. **No credit card required!**

### Step 2: Deploy from GitHub

**Option A: Deploy from this repo (if it's on GitHub)**
1. Push this code to a GitHub repository first
2. In Railway, click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your quotes repository
5. Railway will auto-detect it's a Node.js app
6. Click "Deploy"

**Option B: Deploy from local directory**
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. In your project directory: `railway init`
4. Deploy: `railway up`

### Step 3: Get Your Deployment URL
1. After deployment, click on your project
2. Go to "Settings" → "Domains"
3. Click "Generate Domain"
4. You'll get a URL like: `https://daily-quotes-production-xxxx.up.railway.app`
5. **SAVE THIS URL!** You'll need it for the mobile app

### Step 4: Test Your Deployment
1. Open your Railway URL in a browser
2. You should see the web interface
3. Try adding a quote
4. If it works, you're done with backend deployment! 🎉

**Troubleshooting:**
- If deployment fails, check the logs in Railway dashboard
- Make sure PORT environment variable is not set (Railway handles this)
- The database (SQLite) will be created automatically

---

## 📱 Phase 3: Expo Setup

**⏸️ STOP - You need to do this:**

### Step 1: Create Expo Account
1. Go to https://expo.dev
2. Click "Sign up"
3. Create a free account (email or GitHub)
4. **No credit card required!**

### Step 2: Install Expo Go on iOS
1. Open App Store on your iPhone
2. Search for "Expo Go"
3. Install it (it's free and official from Expo)
4. Open Expo Go and sign in with your expo.dev account

### Step 3: Update Mobile App with Your Server URL
1. Open `mobile/App.js` in a code editor
2. Find line 24: `const API_URL = 'http://localhost:3000';`
3. Change it to your Railway URL:
   ```javascript
   const API_URL = 'https://daily-quotes-production-xxxx.up.railway.app';
   ```
4. Save the file

### Step 4: Install Mobile Dependencies
```bash
cd mobile
npm install
```

### Step 5: Start the Expo App
```bash
cd mobile
npm start
```

This will:
- Start the Expo development server
- Show a QR code in your terminal
- Open a web page with the QR code

### Step 6: Open on Your Phone
1. Open the Expo Go app on your iPhone
2. Sign in if you haven't already
3. Scan the QR code with your iPhone camera
4. Expo Go will open and load your app
5. Grant notification permissions when prompted

**Important:** Keep the terminal running! The app connects to your computer.

---

## 🔔 Phase 4: Register Push Notifications

**⏸️ STOP - You need to do this:**

### Step 1: Connect to Server in the App
1. The app should already have your Railway URL (from Step 3.3)
2. Tap "Connect to Server"
3. You should see "✓ Connected"

### Step 2: Enable Notifications
1. The app will show "✓ Notifications Enabled" if permissions were granted
2. Your push token is automatically registered with the server

### Step 3: Test Notification
1. In the app, tap "Send Test Quote"
2. You should receive a push notification immediately
3. If it works, you're all set! 🎉

**Troubleshooting:**
- If "Connect to Server" fails, verify the URL in `mobile/App.js`
- If notifications don't work, check iOS Settings → Daily Quotes → Notifications
- Make sure you added at least one quote in the web interface

---

## ✅ Phase 5: Final Setup

**⏸️ STOP - You need to do this:**

### Step 1: Add Your Quotes
1. Open your Railway URL in a browser: `https://your-url.railway.app`
2. Add your favorite quotes one by one
3. Keep them under 178 characters each
4. Add as many as you want!

### Step 2: Configure Time Window
1. In the web interface, scroll to "Time Window Settings"
2. Set when you want to receive quotes (e.g., 8 AM to 8 PM)
3. Click "Save Settings"

### Step 3: Test the Full Flow
1. In web interface, click "Send Test Notification"
2. Check your phone for the notification
3. If it works, you're done! 🚀

---

## 📊 Understanding the Queue System

The app uses a smart queue to manage quotes:

1. **First time:** All quotes are shuffled randomly
2. **Daily delivery:** One quote sent per day (random time in your window)
3. **No repeats:** Each quote sent once before any repeat
4. **New quotes:** Added to the end of the current queue
5. **Auto-reset:** When all quotes sent, queue rebuilds with new random order

**Queue Status** (visible in web interface):
- **Total Quotes:** All quotes in your collection
- **Sent This Cycle:** Quotes sent in current cycle
- **Remaining:** Quotes left before queue resets

---

## 🎬 Daily Usage

### To Add a New Quote:
1. Open web interface
2. Type quote in the text box
3. Click "Add Quote"
4. It's automatically added to the end of the queue

### To Remove a Quote:
1. Open web interface
2. Scroll to the quote
3. Click "Delete"

### To Reset the Queue:
1. Open web interface
2. Click "Reset Queue"
3. All quotes will be shuffled into a new random order
4. Sent status will be cleared

---

## 🔧 Troubleshooting

### Backend Issues

**"Can't connect to server"**
- Check Railway deployment status
- Verify the URL is correct
- Check Railway logs for errors

**"No quotes available"**
- Add quotes through the web interface
- Need at least 1 quote to send

### Mobile App Issues

**"Must use physical device"**
- Expo push notifications require a real iPhone
- iOS Simulator won't work for notifications

**"Failed to get push token"**
- Make sure you granted notification permissions
- Check iOS Settings → Notifications → Expo Go

**"Connection Failed"**
- Verify the API_URL in `mobile/App.js` matches your Railway URL
- Make sure backend is running
- Try the health check: `https://your-url/health`

**App not loading**
- Make sure `npm start` is running in the mobile folder
- Check that you're on the same network
- Try restarting Expo Go app

### Notification Issues

**"No push tokens registered"**
- Open the mobile app
- Make sure it says "✓ Notifications Enabled"
- Try "Connect to Server" again

**Not receiving daily quotes**
- Check that quotes exist in the web interface
- Verify time window settings
- Check that today's date isn't marked as already sent
- The app randomly chooses an hour within your window

---

## 💰 Cost Analysis

| Service | Plan | Cost | Limits |
|---------|------|------|--------|
| Railway | Hobby | FREE | 500 hours/month execution time |
| Expo Go | Free | FREE | Unlimited |
| Expo Push | Free | FREE | 600 notifications/day |

**Your usage:**
- Backend runs 24/7 = 720 hours/month
- Wait, that's more than 500!

**Solution:** Railway gives you $5 credit/month on free tier, which covers the extra hours. You're still at $0.

---

## 🚀 You're Done!

You now have:
- ✅ Backend hosted on Railway (free)
- ✅ Web interface to manage quotes
- ✅ iOS app via Expo Go (free)
- ✅ Daily push notifications (free)
- ✅ Smart queue system (no repeats)

**What happens now?**
- One quote will be sent each day at a random time in your window
- Quotes won't repeat until you've seen them all
- New quotes you add go to the end of the line
- Everything runs automatically!

Enjoy your daily inspiration! 💫

---

## 📝 Quick Reference

**Web Interface URL:** `https://your-railway-url.railway.app`

**To start Expo app:**
```bash
cd mobile && npm start
```

**To restart backend locally:**
```bash
cd backend && npm start
```

**To check backend health:**
Visit: `https://your-railway-url.railway.app/health`

**Important Files:**
- `mobile/App.js` - Mobile app (line 24 has server URL)
- `backend/server.js` - Backend server
- `backend/quotes.db` - Your quotes database (auto-created)

