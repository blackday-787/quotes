# Expo Push Notification Setup

This guide covers the Expo configuration for push notifications.

## ✨ Good News!

For your use case with Expo Go, **you don't need to configure anything special!** Expo handles all the push notification infrastructure automatically.

## How It Works

1. **Expo Go** (the app you install from App Store) handles all push notification setup
2. **Expo Push Token** is automatically generated when you request permissions
3. **Expo Push Service** (free) delivers your notifications
4. Your backend uses `expo-server-sdk` to send notifications through Expo's service

## What You DON'T Need

❌ Apple Developer Account ($99/year)  
❌ APNs certificates  
❌ Firebase Cloud Messaging setup  
❌ Standalone app build  

## What You DO Need

✅ Expo Go app installed  
✅ Notification permissions granted  
✅ Your backend running (sends requests to Expo's API)  

## Configuration Already Done

The following are already configured in your app:

### 1. App.json Configuration

```json
"plugins": [
  [
    "expo-notifications",
    {
      "icon": "./assets/notification-icon.png",
      "color": "#667eea"
    }
  ]
]
```

### 2. App.js Notification Handler

```javascript
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
```

### 3. Permission Request

The app automatically requests notification permissions on startup.

### 4. Token Registration

The app automatically registers your push token with your backend.

## Testing Push Notifications

### Local Testing (Before Deployment)

1. Start backend locally:
   ```bash
   cd backend
   npm start
   ```

2. Start Expo app:
   ```bash
   cd mobile
   npm start
   ```

3. Open in Expo Go on your phone

4. Grant notification permissions

5. In the app, tap "Send Test Quote"

6. You should receive a notification immediately

### After Deployment

1. Update `mobile/App.js` line 24 with your Railway URL

2. Restart the Expo app

3. Connect to server in the app

4. Test notification should work

## Understanding Expo Push Tokens

An Expo Push Token looks like this:
```
ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
```

Your app:
1. Requests this token from Expo on startup
2. Sends it to your backend via `/api/push-token`
3. Backend stores it in the database
4. Backend uses it to send notifications via Expo's API

## Expo Push Notification Flow

```
Your Backend
    ↓
(expo-server-sdk)
    ↓
Expo Push Service (free)
    ↓
Apple Push Notification Service
    ↓
Your iPhone
    ↓
Expo Go App
    ↓
Your Daily Quotes App
```

## Limitations with Expo Go

### What Works ✅
- Push notifications (fully supported)
- Notification permissions
- Foreground notifications
- Background notifications
- Notification interactions
- Custom notification sounds
- Badge counts

### What Doesn't Work ❌
- Custom notification icons (uses Expo Go icon)
- App appears as "Expo Go" in notifications
- Can't change app name in notification

### If You Need Full Branding...

You would need to build a standalone app (requires Apple Developer account):

```bash
# This requires paid Apple Developer account
expo build:ios
```

But for your personal use, **Expo Go is perfect and free!**

## Free Tier Limits

Expo's free push notification service:
- ✅ 600 push notifications per day per project
- ✅ Unlimited projects
- ✅ No credit card required

For your use case (1 notification per day):
- **Your usage:** 1 notification/day
- **Limit:** 600 notifications/day
- **You're using:** 0.16% of your limit! 🎉

## Troubleshooting

### "Must use physical device"
- This is correct - iOS Simulator doesn't support push notifications
- You need a real iPhone with Expo Go installed

### "Failed to get push token"
- Make sure you granted notification permissions
- Try closing and reopening the app
- Check iOS Settings → Notifications → Expo Go

### "No push tokens registered"
- Make sure the app successfully connected to server
- Check that the backend is running
- Look for "Push token registered successfully" in backend logs

### Notifications not appearing
- Check iOS Settings → Notifications → Expo Go → ensure enabled
- Make sure the app is not in focus when testing
- Try putting app in background or locking phone
- Check that at least one quote exists in the database

### "Expo Push Service error"
- Check your internet connection
- Expo's service might be temporarily down (rare)
- Check https://status.expo.dev

## Advanced: Sending Notifications Manually

You can test Expo push notifications using their web tool:

1. Go to https://expo.dev/notifications
2. Paste your Expo Push Token (from the app)
3. Enter a test message
4. Click "Send Notification"

This helps debug if the issue is with your backend or Expo's service.

## Code Reference

### Backend: Sending Notifications

```javascript
const { Expo } = require('expo-server-sdk');
const expo = new Expo();

const messages = [{
  to: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]',
  sound: 'default',
  title: 'Daily Quote',
  body: 'Your quote text here',
  data: { quoteId: 123 }
}];

const chunks = expo.chunkPushNotifications(messages);

for (const chunk of chunks) {
  const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
}
```

### Mobile: Registering Token

```javascript
const token = await Notifications.getExpoPushTokenAsync({
  projectId: Constants.expoConfig?.extra?.eas?.projectId
});

await axios.post(`${API_URL}/api/push-token`, {
  token: token.data
});
```

## Migration Path (Future)

If you later want a standalone app:

1. Sign up for Apple Developer ($99/year)
2. Configure app signing in Expo
3. Build standalone app: `eas build`
4. Submit to App Store: `eas submit`
5. Users download from App Store

But again, **for personal use, Expo Go is perfect!**

## Summary

✨ **You're already configured!**

- No additional setup needed
- No Apple Developer account required
- No certificates to manage
- Everything works through Expo Go
- Completely free
- Push notifications fully functional

Just follow the deployment guide, and you'll have working push notifications in 15 minutes!

## Need Help?

If notifications aren't working:
1. Check the troubleshooting section above
2. Look at Railway logs: `railway logs`
3. Check Expo Go app permissions in iOS Settings
4. Try the test button in the mobile app
5. Verify a quote exists in the database

Remember: The first notification proves everything works. After that, it's just waiting for the daily scheduled notification!

