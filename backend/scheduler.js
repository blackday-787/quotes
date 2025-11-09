const cron = require('node-cron');
const db = require('./db');
const QuoteQueue = require('./quoteQueue');
const SMSService = require('./smsService');

class Scheduler {
  static init() {
    // Check every hour if we should send a quote
    cron.schedule('0 * * * *', async () => {
      await this.checkAndSendQuote();
    });

    console.log('Scheduler initialized - checking every hour');
  }

  static async checkAndSendQuote() {
    const today = new Date().toISOString().split('T')[0];
    const currentHour = new Date().getHours();

    // Get settings
    const lastSentDate = db.prepare('SELECT value FROM settings WHERE key = ?').get('last_sent_date')?.value;
    const timeStart = parseInt(db.prepare('SELECT value FROM settings WHERE key = ?').get('time_window_start')?.value || '8');
    const timeEnd = parseInt(db.prepare('SELECT value FROM settings WHERE key = ?').get('time_window_end')?.value || '20');

    // Check if we already sent today
    if (lastSentDate === today) {
      console.log('Quote already sent today');
      return;
    }

    // Check if we're in the time window
    if (currentHour < timeStart || currentHour >= timeEnd) {
      console.log(`Outside time window (${timeStart}-${timeEnd}). Current hour: ${currentHour}`);
      return;
    }

    // Random chance to send this hour (makes it random within the window)
    const hoursInWindow = timeEnd - timeStart;
    const shouldSend = Math.random() < (1 / hoursInWindow);

    if (!shouldSend) {
      console.log('Not sending this hour (random selection)');
      return;
    }

    // Send the quote!
    await this.sendDailyQuote();
  }

  static async sendDailyQuote() {
    try {
      // Get next quote
      const quote = QuoteQueue.getNextQuote();
      
      if (!quote) {
        console.log('No quotes available to send');
        return;
      }

      // Check if SMS is configured
      if (!SMSService.isConfigured()) {
        console.log('SMS service not configured');
        // Still mark as sent
        QuoteQueue.markQuoteSent(quote.id);
        const today = new Date().toISOString().split('T')[0];
        db.prepare('UPDATE settings SET value = ? WHERE key = ?').run(today, 'last_sent_date');
        return;
      }

      // Send SMS
      await SMSService.sendSMS(quote.text);

      // Mark quote as sent and update last sent date
      QuoteQueue.markQuoteSent(quote.id);
      const today = new Date().toISOString().split('T')[0];
      db.prepare('UPDATE settings SET value = ? WHERE key = ?').run(today, 'last_sent_date');

      console.log(`Sent SMS quote: "${quote.text}"`);
    } catch (error) {
      console.error('Error sending daily quote:', error);
    }
  }

  // Manual trigger for testing
  static async sendTestQuote() {
    const quote = QuoteQueue.getNextQuote();
    
    if (!quote) {
      return { success: false, message: 'No quotes available' };
    }

    if (!SMSService.isConfigured()) {
      return { success: false, message: 'SMS service not configured. Please set up Gmail credentials.' };
    }

    try {
      await SMSService.sendSMS(`TEST: ${quote.text}`);
      return { success: true, message: `Sent test SMS: "${quote.text}"` };
    } catch (error) {
      console.error('Error sending test quote:', error);
      return { success: false, message: error.message };
    }
  }
}

module.exports = Scheduler;

