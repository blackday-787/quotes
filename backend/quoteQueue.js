const db = require('./db');

class QuoteQueue {
  // Get next quote to send
  static getNextQuote() {
    // First, check if we have unsent quotes in the queue
    const unsentQuote = db.prepare(`
      SELECT q.id, q.text 
      FROM quotes q
      JOIN quote_queue qq ON q.id = qq.quote_id
      WHERE qq.sent = 0
      ORDER BY qq.position
      LIMIT 1
    `).get();

    if (unsentQuote) {
      return unsentQuote;
    }

    // If no unsent quotes, rebuild the queue
    this.rebuildQueue();
    
    // Try again
    return db.prepare(`
      SELECT q.id, q.text 
      FROM quotes q
      JOIN quote_queue qq ON q.id = qq.quote_id
      WHERE qq.sent = 0
      ORDER BY qq.position
      LIMIT 1
    `).get();
  }

  // Mark quote as sent
  static markQuoteSent(quoteId) {
    const updateQueue = db.prepare(`
      UPDATE quote_queue 
      SET sent = 1 
      WHERE quote_id = ?
    `);
    
    const updateQuote = db.prepare(`
      UPDATE quotes 
      SET times_sent = times_sent + 1, 
          last_sent_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);

    updateQueue.run(quoteId);
    updateQuote.run(quoteId);
  }

  // Rebuild queue with randomized order
  static rebuildQueue() {
    // Clear existing queue
    db.prepare('DELETE FROM quote_queue').run();

    // Get all quotes
    const quotes = db.prepare('SELECT id FROM quotes ORDER BY RANDOM()').all();

    if (quotes.length === 0) {
      return;
    }

    // Insert into queue with randomized positions
    const insert = db.prepare('INSERT INTO quote_queue (quote_id, position, sent) VALUES (?, ?, 0)');
    
    quotes.forEach((quote, index) => {
      insert.run(quote.id, index);
    });
  }

  // Check if queue needs rebuilding (all quotes sent)
  static needsRebuild() {
    const result = db.prepare(`
      SELECT COUNT(*) as unsent 
      FROM quote_queue 
      WHERE sent = 0
    `).get();

    return result.unsent === 0;
  }

  // Get queue status
  static getStatus() {
    const total = db.prepare('SELECT COUNT(*) as count FROM quotes').get();
    const sent = db.prepare('SELECT COUNT(*) as count FROM quote_queue WHERE sent = 1').get();
    const unsent = db.prepare('SELECT COUNT(*) as count FROM quote_queue WHERE sent = 0').get();

    return {
      totalQuotes: total.count,
      sentThisCycle: sent.count,
      remainingThisCycle: unsent.count
    };
  }

  // Get next quote for today (Google Apps Script integration)
  static getNextQuoteForToday() {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if we already served a quote today
    const used = db.prepare('SELECT id FROM day_log WHERE day = ?').get(today);
    if (used) return null;

    // Get the next unsent quote
    const quote = this.getNextQuote();
    if (!quote) return null;

    // Reserve this day so we won't hand out more than one quote
    db.prepare('INSERT INTO day_log (day, quote_id) VALUES (?, ?)').run(today, quote.id);

    return quote;
  }

  // Confirm quote was sent successfully (Google Apps Script integration)
  static confirmQuoteSent(quoteId) {
    this.markQuoteSent(quoteId);
  }
}

module.exports = QuoteQueue;

