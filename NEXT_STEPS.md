# 🎉 Your Code is on GitHub!

Repository: https://github.com/blackday-787/quotes

Everything is configured for **Render.com** (actually free!) and ready to deploy.

---

## ⏸️ STOP 1: Deploy to Render (5 minutes)

1. Go to **https://render.com**
2. Click "Get Started"
3. Sign up with GitHub (free, no card needed!)
4. Click "New +" → "Web Service"
5. Connect to: `blackday-787/quotes`
6. Render auto-detects config from `render.yaml`
7. Click "Create Web Service"
8. Wait ~2 minutes for deploy
9. **Copy your URL:** `https://daily-quotes-xxxx.onrender.com`

✅ When you see "Live" badge, backend is deployed!

---

## ⏸️ STOP 2: Update Mobile App URL (1 minute)

Open `mobile/App.js` line 20:

**Change from:**
```javascript
export const API_URL = 'http://localhost:3000';
```

**Change to:**
```javascript
export const API_URL = 'https://daily-quotes-xxxx.onrender.com';
```

(Use YOUR Render URL from STOP 1)

Save the file.

---

## ⏸️ STOP 3: Create Expo Account (2 minutes)

1. Go to **https://expo.dev**
2. Sign up (free, no card needed)
3. Remember your username
4. Install **Expo Go** from iOS App Store

---

## ⏸️ STOP 4: Launch Mobile App (2 minutes)

```bash
cd mobile
npm install
npm start
```

1. Open Expo Go on your iPhone
2. Sign in with expo.dev account
3. Scan the QR code
4. Grant notification permissions
5. App should load! 🎉

---

## ⏸️ STOP 5: Connect & Test (1 minute)

In the mobile app:

1. Tap "Connect to Server" (on Quote screen)
2. Should see "✓ Connected"
3. Tap "Send Test Quote Now"
4. You should receive a push notification! 🔔

If you get a notification: **Everything works!** ✅

---

## ⏸️ STOP 6: Add Your Quotes (5 minutes)

1. Open your Render URL in browser
2. Add 10-20 of your favorite quotes
3. Configure time window (e.g., 8 AM - 8 PM)
4. Click "Save Settings"

---

## 🎉 You're Done!

You'll now receive:
- One quote per day
- At a random time in your window
- No repeats until you've seen them all
- New quotes you add go to the end

---

## 📱 App Features

**Quote Screen (Tab 1):**
- View latest quote
- See stats (Total/Sent/Remaining)
- Test notifications
- Pull to refresh

**Add Quote Screen (Tab 2):**
- Add new quotes quickly
- Character counter (178 max)
- Instant feedback

---

## 🆓 Cost Breakdown

- **Render.com:** $0 (750 hours/month free)
- **Expo Go:** $0 (free app)
- **Expo Notifications:** $0 (600/day free)
- **Total:** **$0/month** forever ✨

---

## ⚠️ Important Notes

**Cold Starts:**
- App sleeps after 15 min of inactivity
- Takes ~30 sec to wake up
- Daily notifications still work perfectly (cron wakes it)
- Adding quotes may take 30 sec if sleeping

**To Keep Awake 24/7 (optional):**
- Use UptimeRobot.com (free)
- Ping your URL every 5 minutes
- Prevents sleep

---

## 🔧 Troubleshooting

**"Connection Failed" in app:**
- Make sure you updated API_URL in mobile/App.js
- Verify Render deployment is "Live"
- Check URL has no trailing slash

**"No quotes available":**
- Add at least one quote via web interface
- Check Render URL works in browser

**Notifications not working:**
- Make sure you granted permissions
- Check iOS Settings → Notifications → Expo Go
- Try test button again

---

## 📚 Documentation

- **RENDER_DEPLOYMENT.md** - Detailed Render setup
- **EXPO_SETUP.md** - Expo push notifications info  
- **TESTING_GUIDE.md** - Full testing guide
- **README.md** - Complete documentation

---

## 🚀 Ready?

Start with **STOP 1** above and work through each step.

Total time: ~15 minutes

You got this! 💪

