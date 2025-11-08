const cron = require('node-cron');
const { Expo } = require('expo-server-sdk');
const db = require('./db');
const QuoteQueue = require('./quoteQueue');

const expo = new Expo();

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

      // Get all push tokens
      const tokens = db.prepare('SELECT token FROM push_tokens').all();
      
      if (tokens.length === 0) {
        console.log('No push tokens registered');
        // Still mark as sent
        QuoteQueue.markQuoteSent(quote.id);
        const today = new Date().toISOString().split('T')[0];
        db.prepare('UPDATE settings SET value = ? WHERE key = ?').run(today, 'last_sent_date');
        return;
      }

      // Send push notifications
      const messages = tokens.map(({ token }) => ({
        to: token,
        sound: 'default',
        title: 'Daily Quote',
        body: quote.text,
        data: { quoteId: quote.id }
      }));

      // Send in chunks
      const chunks = expo.chunkPushNotifications(messages);
      
      for (const chunk of chunks) {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log('Sent notification chunk:', ticketChunk);
        } catch (error) {
          console.error('Error sending chunk:', error);
        }
      }

      // Mark quote as sent and update last sent date
      QuoteQueue.markQuoteSent(quote.id);
      const today = new Date().toISOString().split('T')[0];
      db.prepare('UPDATE settings SET value = ? WHERE key = ?').run(today, 'last_sent_date');

      console.log(`Sent quote: "${quote.text}"`);
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

    const tokens = db.prepare('SELECT token FROM push_tokens').all();
    
    if (tokens.length === 0) {
      return { success: false, message: 'No push tokens registered' };
    }

    try {
      const messages = tokens.map(({ token }) => ({
        to: token,
        sound: 'default',
        title: 'Test Quote',
        body: quote.text,
        data: { quoteId: quote.id, test: true }
      }));

      const chunks = expo.chunkPushNotifications(messages);
      
      for (const chunk of chunks) {
        await expo.sendPushNotificationsAsync(chunk);
      }

      return { success: true, message: `Sent test quote: "${quote.text}"` };
    } catch (error) {
      console.error('Error sending test quote:', error);
      return { success: false, message: error.message };
    }
  }
}

module.exports = Scheduler;

