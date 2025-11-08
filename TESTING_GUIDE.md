# Testing Guide

This guide helps you test the Daily Quotes app before and after deployment.

## 🧪 Testing Phases

### Phase 1: Backend API Testing (Local)

**Start the backend:**
```bash
cd backend
npm install
npm start
```

Server should start on http://localhost:3000

#### Test 1: Health Check
```bash
curl http://localhost:3000/health
```

**Expected:** `{"status":"ok","timestamp":"..."}`

#### Test 2: Add a Quote
```bash
curl -X POST http://localhost:3000/api/quotes \
  -H "Content-Type: application/json" \
  -d '{"text":"This is a test quote"}'
```

**Expected:** `{"id":1,"text":"This is a test quote","message":"Quote added successfully"}`

#### Test 3: Get All Quotes
```bash
curl http://localhost:3000/api/quotes
```

**Expected:** Array with your quote

#### Test 4: Get Queue Status
```bash
curl http://localhost:3000/api/queue/status
```

**Expected:** 
```json
{
  "totalQuotes": 1,
  "sentThisCycle": 0,
  "remainingThisCycle": 1,
  "lastSentDate": "Never"
}
```

✅ **If all tests pass, your backend is working!**

---

### Phase 2: Web Interface Testing (Local)

1. Open http://localhost:3000 in your browser

2. **Test adding a quote:**
   - Type a quote in the text box
   - Click "Add Quote"
   - Should see success message
   - Quote should appear in the list below

3. **Test character counter:**
   - Type more than 160 characters
   - Counter should turn orange/red
   - Try to add quote over 178 characters
   - Should see error message

4. **Test queue status:**
   - Top section should show:
     - Total Quotes: (number of quotes you added)
     - Sent This Cycle: 0
     - Remaining: (same as total)

5. **Test settings:**
   - Change start hour to 9
   - Change end hour to 21
   - Click "Save Settings"
   - Should see success message

6. **Test delete:**
   - Click "Delete" on a quote
   - Confirm deletion
   - Quote should disappear

7. **Test reset queue:**
   - Click "Reset Queue"
   - Confirm
   - Should see success message
   - Queue should be rebuilt

✅ **If all tests pass, your web interface is working!**

---

### Phase 3: Mobile App Testing (Local)

**Prerequisites:**
- Backend running on localhost:3000
- Expo Go installed on iPhone
- iPhone and computer on same WiFi network

**Start the mobile app:**
```bash
cd mobile
npm install
npm start
```

1. **Test app loading:**
   - Scan QR code with iPhone camera
   - Expo Go should open
   - App should load
   - Should see "Daily Quotes" title

2. **Test server connection:**
   - Leave server URL as `http://localhost:3000`
   - Tap "Connect to Server"
   - Should see "✓ Connected" message

3. **Test notification permissions:**
   - Grant permissions when prompted
   - Should see "✓ Notifications Enabled"

4. **Test notification token registration:**
   - Check backend terminal
   - Should see log: "Push token registered successfully"

5. **Test notification (without actual push):**
   - Add a quote in web interface first
   - In mobile app, tap "Send Test Quote"
   - Should receive a push notification
   - Notification should contain your quote text

✅ **If test notification works, everything is working!**

**Troubleshooting local testing:**

- **"Connection Failed"**: Make sure iPhone and computer on same WiFi
- **"Cannot connect"**: Try using your computer's IP address instead of localhost
  - Find your IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)
  - Update `mobile/App.js` line 24 to: `http://192.168.x.x:3000`
- **"No quotes available"**: Add a quote in web interface first

---

### Phase 4: After Railway Deployment

**Update mobile app:**
1. Open `mobile/App.js`
2. Line 24: Change to your Railway URL
3. Save file
4. Restart Expo app (`npm start` again)

**Test deployed backend:**

```bash
# Replace with your Railway URL
export API_URL="https://your-app.railway.app"

# Test health
curl $API_URL/health

# Test adding quote
curl -X POST $API_URL/api/quotes \
  -H "Content-Type: application/json" \
  -d '{"text":"Deployed quote test"}'

# Test getting quotes
curl $API_URL/api/quotes
```

**Test web interface:**
1. Open your Railway URL in browser
2. Add a quote
3. Check it appears in the list
4. Verify queue status updates

**Test mobile app:**
1. Open app in Expo Go
2. Should still have your Railway URL
3. Tap "Connect to Server"
4. Should see "✓ Connected"
5. Tap "Send Test Quote"
6. Should receive push notification

✅ **If all tests pass, your app is fully deployed!**

---

### Phase 5: Daily Notification Testing

**Important:** Daily notifications are sent at a random time within your configured window. To test this without waiting:

#### Method 1: Manual Trigger (Recommended)

Use the test button in the web interface or mobile app.

#### Method 2: Force Send via API

```bash
curl -X POST http://localhost:3000/api/test-notification

# Or for deployed version:
curl -X POST https://your-app.railway.app/api/test-notification
```

#### Method 3: Simulate Time (Advanced)

Temporarily modify the scheduler settings:

1. In web interface, set time window to current hour
2. Wait for the next hour
3. Check if notification is sent
4. Reset time window to preferred hours

**To check if scheduler is running:**
- Look at backend logs
- Should see: "Scheduler initialized - checking every hour"
- Every hour: Log showing time check

**To debug scheduler:**
1. Check Railway logs or local terminal
2. Look for messages like:
   - "Outside time window"
   - "Not sending this hour (random selection)"
   - "Quote already sent today"
   - "Sent quote: ..."

---

### Phase 6: Quote Rotation Testing

**Test the queue system:**

1. Add 5 test quotes
2. Send test notification 5 times
3. Check web interface - all should show "✓ Sent this cycle"
4. Click "Reset Queue"
5. All quotes should show "Not sent yet"
6. Send test notification again
7. Should get a quote (in new random order)

**Test new quote behavior:**

1. Send test notifications until all quotes sent
2. Add a new quote
3. Send test notification
4. Should get a quote from the reset queue
5. New quote should be at end of queue
6. Keep testing - new quote should come last

✅ **If quotes rotate correctly, queue system is working!**

---

### Phase 7: End-to-End Production Test

**Final checklist before daily use:**

- [ ] Backend deployed on Railway
- [ ] Web interface accessible via Railway URL
- [ ] Mobile app connects to Railway backend
- [ ] Push notifications working
- [ ] At least 10 quotes added
- [ ] Time window configured (e.g., 8 AM - 8 PM)
- [ ] Test notification received successfully
- [ ] Queue status shows correct numbers
- [ ] Can add new quotes via web interface
- [ ] Can delete quotes via web interface
- [ ] Settings save correctly

**Now wait for your first real daily notification!**

It will arrive:
- Sometime during your configured time window
- At a random hour (makes it feel spontaneous)
- Once per day (won't repeat same day)
- With a quote you haven't seen this cycle

---

## 🐛 Common Issues and Solutions

### Backend Issues

**"Port already in use"**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill
```

**"Database locked"**
- Close the backend
- Delete `backend/quotes.db`
- Restart backend (DB will be recreated)

**"Expo push error"**
- Check internet connection
- Verify push token is valid
- Check https://status.expo.dev

### Mobile Issues

**"Expo Go not loading"**
- Try restarting Expo Go app
- Try `expo start --clear` in mobile folder
- Reinstall Expo Go from App Store

**"Notifications not appearing"**
- Check iOS Settings → Notifications → Expo Go
- Make sure "Allow Notifications" is ON
- Try putting app in background
- Lock phone and wait a few seconds

**"Failed to register token"**
- Check backend logs for errors
- Verify backend is accessible
- Try reconnecting to server in app

### Queue Issues

**"No quotes available"**
- Add at least one quote in web interface
- Check queue status - need totalQuotes > 0

**"Quote repeating immediately"**
- Check queue status
- If remainingThisCycle = 0, queue reset is normal
- This will happen after all quotes sent once

**"New quote not appearing"**
- Refresh the web interface page
- Check browser console for errors
- Verify quote was added (check totalQuotes count)

---

## 📊 What Success Looks Like

After all testing, you should have:

1. **Backend:**
   - Running on Railway
   - Responding to API calls
   - Scheduler running (logs show hourly checks)

2. **Web Interface:**
   - Accessible via Railway URL
   - Can add/delete quotes
   - Shows accurate queue status
   - Settings save correctly

3. **Mobile App:**
   - Loads in Expo Go
   - Connects to backend
   - Notifications enabled
   - Test notifications work

4. **Database:**
   - Contains your quotes
   - Queue properly initialized
   - Settings stored

5. **Daily Flow:**
   - One notification per day
   - Random time in your window
   - Quote from your collection
   - No repeats until all sent

---

## 🎯 Quick Test Commands

**Test everything quickly:**

```bash
# Terminal 1: Start backend
cd backend && npm start

# Terminal 2: Start mobile
cd mobile && npm start

# Terminal 3: Test API
curl http://localhost:3000/health
curl -X POST http://localhost:3000/api/quotes \
  -H "Content-Type: application/json" \
  -d '{"text":"Quick test quote"}'
curl http://localhost:3000/api/test-notification
```

**On your phone:**
1. Open Expo Go
2. Scan QR code
3. Grant notifications
4. Tap "Connect to Server"
5. Tap "Send Test Quote"

If you receive the notification: **✅ Everything works!**

---

## 🚀 Ready for Production?

If all tests pass:
1. Deploy to Railway (see DEPLOYMENT_GUIDE.md)
2. Update mobile app with Railway URL
3. Add your real quotes
4. Configure your time window
5. Wait for your first daily quote!

Enjoy your daily inspiration! 💫

