# Daily Quotes App

A free daily quote notification system with iOS app support via Expo Go.

## Features

- 📱 iOS push notifications via Expo Go (free!)
- 🎲 Randomized quote delivery (no repeats until all sent)
- ⏰ Configurable daily time window
- 🌐 Web interface for managing quotes
- 🔄 Smart queue system - new quotes go to the end
- 📊 Track which quotes have been sent

## Architecture

- **Backend**: Node.js + Express + SQLite
- **Web Interface**: Vanilla HTML/CSS/JS
- **Mobile App**: React Native + Expo
- **Hosting**: Railway (free tier)

## Setup Instructions

### Phase 1: Local Testing

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   
   cd ../mobile
   npm install
   ```

2. **Start the backend**
   ```bash
   cd backend
   npm start
   ```
   Server runs on http://localhost:3000

3. **Test the web interface**
   - Open http://localhost:3000 in your browser
   - Add some test quotes
   - Check the queue status

4. **Test the mobile app (optional for local testing)**
   ```bash
   cd mobile
   npm start
   ```
   - Install "Expo Go" from the iOS App Store
   - Scan the QR code with your camera
   - Grant notification permissions

### Phase 2: Deploy to Railway

**STOP - You need to do this:**

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (free, no credit card needed)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select this repository
5. Railway will auto-detect and deploy

**After deployment:**
1. Railway will give you a URL like `https://your-app.railway.app`
2. Update the mobile app:
   - Open `mobile/App.js`
   - Change line 24: `const API_URL = 'https://your-app.railway.app';`
3. Restart the Expo app

### Phase 3: Expo Setup

**STOP - You need to do this:**

1. Go to [expo.dev](https://expo.dev)
2. Sign up (free, no credit card)
3. Install "Expo Go" from iOS App Store
4. Run the mobile app:
   ```bash
   cd mobile
   npm start
   ```
5. In Expo Go app, sign in with your expo.dev account
6. Scan the QR code
7. Grant notification permissions when prompted

### Phase 4: Usage

**Add Quotes:**
- Open your Railway URL in a browser
- Use the web interface to add quotes
- Each quote must be ≤178 characters (iOS limit)

**Configure Settings:**
- Set your preferred time window (e.g., 8 AM - 8 PM)
- The app will randomly send one quote per day within this window

**Test Notifications:**
- Click "Send Test Notification" in the web interface
- You should receive a push notification on your phone

## How the Quote Queue Works

1. **First Cycle**: All quotes are randomized into a queue
2. **Daily Delivery**: One quote is sent each day (at a random time in your window)
3. **No Repeats**: Quotes won't repeat until all have been sent
4. **New Quotes**: Added quotes go to the end of the queue
5. **Reset**: When all quotes are sent, the queue automatically rebuilds with a new random order

## API Endpoints

### Quotes
- `GET /api/quotes` - Get all quotes
- `POST /api/quotes` - Add new quote
- `DELETE /api/quotes/:id` - Delete quote

### Queue
- `GET /api/queue/status` - Get queue status
- `POST /api/queue/rebuild` - Reset queue (start new cycle)

### Settings
- `GET /api/settings` - Get all settings
- `POST /api/settings` - Update a setting

### Push Notifications
- `POST /api/push-token` - Register device token
- `POST /api/test-notification` - Send test notification

### Health
- `GET /health` - Server health check

## Troubleshooting

**Notifications not working?**
- Make sure you granted permissions in iOS
- Check that your push token is registered (look in app)
- Verify the server URL is correct in the mobile app
- Try sending a test notification

**Can't connect to server?**
- Make sure the backend is running
- Check the URL in the mobile app matches your deployment
- Try the health endpoint: `https://your-url/health`

**Quotes repeating?**
- Check the queue status in the web interface
- You may need to add more quotes
- The queue rebuilds when all quotes are sent

**App expires after 7 days?**
- This only happens if you sideload via Xcode
- Using Expo Go (recommended) doesn't expire
- Just re-run `npm start` in the mobile folder and scan the QR code

## Cost Breakdown

- **Railway Hosting**: FREE (500 hours/month, more than enough)
- **Expo Go**: FREE (built for development, perfect for this use case)
- **Expo Push Notifications**: FREE (up to 500 push notifications/day)

Total: **$0/month** ✨

## Support

Having issues? Check:
1. Backend is running and accessible
2. Mobile app has the correct server URL
3. You granted notification permissions
4. You added at least one quote
5. You registered your push token (check app status)

## Future Enhancements

Possible additions:
- Multiple users support
- Quote categories
- Share quotes
- Quote favorites
- Rich notifications with images
- Widget support

Enjoy your daily inspiration! 💫

