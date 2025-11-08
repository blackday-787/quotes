# Render.com Deployment Guide

Quick guide to deploy your Daily Quotes app on Render.com (actually free!)

## Why Render?

✅ **Truly free** - no credit card required  
✅ **750 hours/month** - plenty for 24/7 operation  
✅ **Auto-deploy** from GitHub  
✅ **SSL included**  
⚠️ Sleeps after 15 min inactivity (wakes in ~30 sec)

## Deployment Steps

### Step 1: Push to GitHub (Already Done!)
Your code is at: https://github.com/blackday-787/quotes.git

### Step 2: Create Render Account
1. Go to https://render.com
2. Click "Get Started"
3. Sign up with GitHub (easiest - no card needed!)
4. Authorize Render to access your GitHub

### Step 3: Deploy from GitHub
1. Click "New +"
2. Select "Web Service"
3. Connect to your GitHub repository: `blackday-787/quotes`
4. Render will auto-detect the configuration from `render.yaml`
5. Click "Create Web Service"

### Step 4: Wait for Deployment
- First build takes ~2-3 minutes
- Watch the logs for "Server running on port..."
- When you see "Live" badge, you're deployed! 🎉

### Step 5: Get Your URL
- Your app will be at: `https://daily-quotes-xxxx.onrender.com`
- Copy this URL - you'll need it for the mobile app

### Step 6: Test Your Deployment
1. Open your Render URL in browser
2. You should see the web interface
3. Try adding a test quote
4. Check that it appears in the list

✅ If this works, backend is deployed!

### Step 7: Update Mobile App
1. Open `mobile/App.js`
2. Find line 17: `export const API_URL = 'http://localhost:3000';`
3. Change to: `export const API_URL = 'https://daily-quotes-xxxx.onrender.com';`
4. Save the file

### Step 8: Run Mobile App
```bash
cd mobile
npm install
npm start
```

1. Scan QR code with Expo Go
2. Grant permissions
3. Tap "Connect to Server"
4. Should see "✓ Connected"
5. Tap "Send Test Quote"
6. You should receive a notification! 🎉

## Important: Cold Starts

Your app sleeps after 15 minutes of inactivity. This means:

**First request after sleep:**
- Takes ~30 seconds to wake up
- Then instant after that

**Daily notifications:**
- Cron job wakes the app automatically
- Notifications will always work on time ✅

**Adding quotes via web:**
- May take 30 sec if app was sleeping
- Once awake, instant for 15 minutes

**To prevent sleep (optional):**
- Use a service like UptimeRobot (free)
- Pings your app every 5 minutes
- Keeps it awake 24/7

## Auto-Deploy from GitHub

After initial setup, any git push automatically deploys:

```bash
# Make changes
git add .
git commit -m "Updated quotes"
git push

# Render automatically deploys! 🚀
```

## Environment Variables (Optional)

If you need to set environment variables:
1. In Render dashboard, go to your service
2. Click "Environment"
3. Add variables (they're already set in render.yaml)

## Logs and Monitoring

View logs in Render dashboard:
1. Click on your service
2. Go to "Logs" tab
3. See real-time server logs

## Troubleshooting

**"Application failed to start"**
- Check logs in Render dashboard
- Make sure `backend/package.json` exists
- Verify node version compatibility

**"Connection failed" in mobile app**
- Make sure you updated the API_URL in mobile/App.js
- Check the URL is correct (no trailing slash)
- Verify backend is deployed (check Render dashboard)

**"Cold start too slow"**
- Normal! First request after sleep takes 30 sec
- Use UptimeRobot to keep awake
- Or just accept the occasional delay

**Notifications not working**
- Cold starts don't affect scheduled notifications
- Cron job wakes the app before sending
- Test with "Send Test Quote" button

## Cost

**Free tier includes:**
- 750 hours/month execution time
- SSL certificate
- Auto-deploy from GitHub
- Custom domains
- Logs

For this app: **$0/month** forever ✨

## Next Steps

1. ✅ Deploy to Render
2. ✅ Update mobile app URL
3. ✅ Test notifications
4. ✅ Add your real quotes
5. ✅ Configure time window
6. 🎉 Enjoy daily quotes!

---

## Quick Commands Reference

**Check backend health:**
```bash
curl https://your-app.onrender.com/health
```

**Add quote via API:**
```bash
curl -X POST https://your-app.onrender.com/api/quotes \
  -H "Content-Type: application/json" \
  -d '{"text":"Your quote here"}'
```

**View logs:**
Go to Render dashboard → Your service → Logs

---

You're all set! 🚀

