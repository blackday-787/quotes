// ============================================
// Daily Quote SMS via Google Apps Script
// ============================================
// This script runs once daily at a random time between 8am-8pm
// It pulls the next quote from your Render backend and sends it as SMS

// ============ CONFIGURATION ============
// Edit these values:

const BASE_URL = "https://quotes-07du.onrender.com";
const DAILY_TOKEN = "YOUR_DAILY_TOKEN_HERE"; // Get this from Render logs or set in Render env vars
const SMS_GATEWAY = "14252086648@tmomail.net"; // T-Mobile email-to-SMS gateway
const FROM_NAME = "Daily Quote";

// ============ INSTALLATION ============
// 1. Go to script.google.com
// 2. New project → paste this code
// 3. Edit BASE_URL, DAILY_TOKEN, SMS_GATEWAY above
// 4. Run "install" function once (authorize when prompted)
// 5. Done! It will run daily at random times forever

/**
 * Run this once to set up the daily trigger
 */
function install() {
  // Clear any existing triggers
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    ScriptApp.deleteTrigger(trigger);
  });
  
  // Schedule the first run
  scheduleNext();
  
  Logger.log('✅ Installation complete! First quote will be sent tomorrow at a random time between 8am-8pm.');
}

/**
 * Picks a random time tomorrow between 8am and 8pm
 * @returns {number} Milliseconds timestamp
 */
function randomTimeMillis() {
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Start at 8:00 AM
  var start = new Date(tomorrow);
  start.setHours(8, 0, 0, 0);
  
  // End at 8:00 PM
  var end = new Date(tomorrow);
  end.setHours(20, 0, 0, 0);
  
  // Random time between start and end
  var delta = end.getTime() - start.getTime();
  var offset = Math.floor(Math.random() * delta);
  
  return start.getTime() + offset;
}

/**
 * Schedule the next daily quote
 */
function scheduleNext() {
  // Clear old triggers to avoid duplicates
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    ScriptApp.deleteTrigger(trigger);
  });
  
  // Pick random time tomorrow
  var nextTime = new Date(randomTimeMillis());
  
  // Create trigger
  ScriptApp.newTrigger("sendDaily")
    .timeBased()
    .at(nextTime)
    .create();
  
  Logger.log('⏰ Next quote scheduled for: ' + nextTime.toString());
}

/**
 * Main function - sends daily quote via SMS
 * This gets called automatically at the scheduled time
 */
function sendDaily() {
  try {
    // Fetch next quote from backend
    var url = BASE_URL + "/next-quote?token=" + encodeURIComponent(DAILY_TOKEN);
    var response = UrlFetchApp.fetch(url, { 
      "muteHttpExceptions": true 
    });
    
    var data = JSON.parse(response.getContentText());
    
    // If we got a quote, send it
    if (data && data.quote && data.quote.text) {
      var quoteText = data.quote.text;
      var quoteId = data.quote.id;
      
      // Send email to SMS gateway
      MailApp.sendEmail({
        to: SMS_GATEWAY,
        subject: "", // Empty subject for cleaner SMS
        htmlBody: "", // Keep empty to reduce truncation
        name: FROM_NAME,
        body: quoteText
      });
      
      Logger.log('📱 SMS sent: "' + quoteText + '"');
      
      // Confirm successful send to backend
      UrlFetchApp.fetch(BASE_URL + "/confirm-send", {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify({ 
          id: quoteId, 
          token: DAILY_TOKEN 
        }),
        muteHttpExceptions: true
      });
      
      Logger.log('✅ Confirmed send with backend');
    } else {
      Logger.log('ℹ️  No quote available today (already sent or no quotes in database)');
    }
  } catch (error) {
    Logger.log('❌ Error sending daily quote: ' + error.toString());
    
    // Optional: Email yourself errors
    // MailApp.sendEmail("tatebusby@gmail.com", "Daily Quote Error", error.toString());
  } finally {
    // Always schedule tomorrow's quote
    scheduleNext();
  }
}

/**
 * Optional: Test function to send immediately (doesn't affect daily schedule)
 */
function testNow() {
  Logger.log('🧪 Running test...');
  sendDaily();
}

