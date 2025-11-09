# 📱 SMS Daily Quotes Setup Guide

Your app now sends quotes via **text message** instead of push notifications!

## ✅ What's New

- **Completely FREE** (no $99 Apple fee!)
- **Works continuously** (no reinstalling)
- **Random time each day** within your chosen window
- **T-Mobile**: Text messages to **1-425-208-6648**

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in to your Gmail account
3. Click **"Select app"** → Choose **"Other"** → Type: "Daily Quotes"
4. Click **"Generate"**
5. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

> **Note:** This is NOT your regular Gmail password. It's a special app-specific password that's safer.

---

### Step 2: Configure SMS in Web Interface

1. **Open**: http://localhost:3000 (or your Render URL)
2. **Scroll to**: "📱 SMS Configuration" section
3. **Enter**:
   - **Gmail Address**: Your Gmail (e.g., `yourname@gmail.com`)
   - **Gmail App Password**: The 16-character password from Step 1
4. **Click**: "💾 Save SMS Configuration"

You should see: ✅ **"Configured and Ready"**

---

### Step 3: Test It!

1. **Add a quote** if you don't have any yet
2. **Click**: "Send Test Notification" button
3. **Check your phone** → You should get a text! 📱

---

## 🔄 Deploy to Render.com

Your backend is already on Render, so let's push the changes:

```bash
cd /Users/tatebusby/Developer/quotes
git add .
git commit -m "Add SMS functionality via email-to-SMS gateway"
git push
```

**Wait 2-3 minutes** for Render to redeploy.

Then configure SMS at: https://quotes-07du.onrender.com

---

## ⚙️ How It Works

1. **Backend scheduler** checks every hour if it's time to send a quote
2. **Random selection** within your time window (default: 8 AM - 8 PM)
3. **Sends email** to `14252086648@tmomail.net` (T-Mobile's email-to-SMS gateway)
4. **T-Mobile converts** the email to a text message
5. **You get a text** with your daily quote! 📱

---

## 🛠 Troubleshooting

### ❌ "SMS service not configured"
- Make sure you entered Gmail credentials in the web interface
- Check that you used a Gmail App Password (not your regular password)

### ❌ No text received after test
- **Check Gmail**: Make sure the account can send emails
- **Wait 1-2 minutes**: Sometimes carrier delays happen
- **Check spam**: First texts might go to spam
- **Verify App Password**: Make sure you copied it correctly (no spaces)

### ❌ "Invalid credentials" error
- Go back to https://myaccount.google.com/apppasswords
- Generate a **new** App Password
- Enter it again in the web interface

---

## 📋 Daily Schedule

- **Time Window**: Set in "Time Window Settings" (default: 8 AM - 8 PM)
- **Random Time**: Quote is sent at a random hour within the window
- **One per day**: Won't send multiple times
- **No repeats**: Quotes are randomized but won't repeat until all are sent

---

## 🎉 You're Done!

Your daily quotes will now arrive via text message at a random time each day. Completely free, no app needed, works forever!

**Questions?** Check the backend logs on Render.com for debugging.

