# Google Apps Script Setup Guide

## ✅ Truly Free Daily SMS Quotes

This setup uses Google Apps Script to send one email per day to your carrier's SMS gateway. No SMTP providers, no fees, no iOS app needed.

---

## How It Works

1. **Backend** (Render.com) stores quotes and manages the queue
2. **Google Apps Script** (free) runs once daily at a random time
3. **Apps Script** pulls the next quote from your backend
4. **Apps Script** sends it via email to `14252086648@tmomail.net` (T-Mobile SMS gateway)
5. **Apps Script** schedules itself for tomorrow at a new random time

**Result**: Daily SMS quotes, completely free, forever!

---

## Step 1: Deploy Backend Changes

Push the updated code to GitHub (it will auto-deploy to Render):

```bash
cd /Users/tatebusby/Developer/quotes
git add -A
git commit -m "Add Google Apps Script integration"
git push origin main
```

---

## Step 2: Set Up DAILY_TOKEN in Render

1. **Go to**: https://dashboard.render.com
2. **Find** your `quotes-07du` service
3. **Click** "Environment" in the left sidebar
4. **Add Environment Variable**:
   - **Key**: `DAILY_TOKEN`
   - **Value**: Generate a random string (e.g., `openssl rand -hex 16` or just mash your keyboard)
   - Example: `a7f3b9e2d4c1f8a6e9b2d5c8f1a4e7b3`
5. **Save** (Render will redeploy automatically)

**Keep this token secret!** It's used to authenticate the Apps Script.

---

## Step 3: Create Google Apps Script

1. **Go to**: https://script.google.com
2. **Click** "New project"
3. **Delete** the default `function myFunction() { }`
4. **Copy** the entire contents of `apps-script.gs` from this repo
5. **Paste** it into the script editor

---

## Step 4: Configure the Script

At the top of the script, edit these three values:

```javascript
const BASE_URL = "https://quotes-07du.onrender.com";
const DAILY_TOKEN = "a7f3b9e2d4c1f8a6e9b2d5c8f1a4e7b3"; // Use the token from Render
const SMS_GATEWAY = "14252086648@tmomail.net"; // Your phone@carrier
```

- **BASE_URL**: Your Render URL
- **DAILY_TOKEN**: The exact token you set in Render (Step 2)
- **SMS_GATEWAY**: Your phone number + carrier's email-to-SMS domain
  - T-Mobile: `NUMBER@tmomail.net`
  - Verizon: `NUMBER@vtext.com`
  - AT&T: `NUMBER@txt.att.net`

---

## Step 5: Run Installation

1. **Save** the script (File → Save or Ctrl+S)
2. **Name** it something like "Daily Quotes"
3. In the **function dropdown** at the top, select `install`
4. **Click** the ▶️ Run button
5. **Authorize** the script when prompted:
   - "This app isn't verified" → Click "Advanced"
   - Click "Go to Daily Quotes (unsafe)"
   - Click "Allow"
6. Check the **Execution log** (View → Logs)
   - You should see: `✅ Installation complete! First quote will be sent tomorrow...`

---

## Step 6: Add Some Quotes

Go to your web interface and add quotes:

1. **Open**: https://quotes-07du.onrender.com
2. **Type** a quote in the text box
3. **Click** "Add Quote"
4. Repeat for as many quotes as you want!

---

## ✅ You're Done!

The script will now:
- Run once per day at a random time between 8am-8pm
- Pull the next quote from your backend
- Send it to your phone via SMS
- Schedule itself for tomorrow at a new random time

---

## Testing

Want to test it immediately?

1. In Google Apps Script, select the `testNow` function from the dropdown
2. Click ▶️ Run
3. Check your phone for the SMS!

Note: `testNow` doesn't affect your daily schedule - it just sends a quote right now.

---

## Troubleshooting

### Not receiving SMS?

1. **Check Render logs**: Go to Render dashboard → your service → Logs
2. **Check Apps Script logs**: In script.google.com → Executions (left sidebar)
3. **Verify phone number**: Make sure `14252086648@tmomail.net` is correct
4. **Check trigger**: In Apps Script → Triggers (clock icon) - should see one scheduled trigger

### "Unauthorized" error?

- Make sure `DAILY_TOKEN` in Render matches `DAILY_TOKEN` in Apps Script exactly

### No quote returned?

- Make sure you've added quotes via the web interface
- Check if a quote was already sent today (only one per day)

---

## How to View Scheduled Time

1. In Google Apps Script, click the **clock icon** (Triggers) in left sidebar
2. You'll see when the next quote is scheduled
3. After each run, it automatically schedules the next day

---

## Daily Limits

Google Apps Script free tier allows:
- **100 emails/day** (you only need 1!)
- **Unlimited triggers**
- **6 hours execution time per day** (you use ~1 second)

You're well within the free limits! 🎉

