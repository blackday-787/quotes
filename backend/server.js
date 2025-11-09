require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const QuoteQueue = require('./quoteQueue');
const Scheduler = require('./scheduler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize scheduler
Scheduler.init();

// ============ Quote Endpoints ============

// Get all quotes
app.get('/api/quotes', (req, res) => {
  try {
    const quotes = db.prepare(`
      SELECT q.*, 
             CASE WHEN qq.sent = 1 THEN 1 ELSE 0 END as sent_this_cycle
      FROM quotes q
      LEFT JOIN quote_queue qq ON q.id = qq.quote_id
      ORDER BY q.added_at DESC
    `).all();
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new quote
app.post('/api/quotes', (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Quote text is required' });
    }

    if (text.length > 178) {
      return res.status(400).json({ error: 'Quote must be 178 characters or less for iOS notifications' });
    }

    const result = db.prepare('INSERT INTO quotes (text) VALUES (?)').run(text.trim());
    
    // Add to queue at the end
    const maxPosition = db.prepare('SELECT MAX(position) as max FROM quote_queue').get();
    const newPosition = (maxPosition.max || -1) + 1;
    
    db.prepare('INSERT INTO quote_queue (quote_id, position, sent) VALUES (?, ?, 0)')
      .run(result.lastInsertRowid, newPosition);

    res.json({ 
      id: result.lastInsertRowid, 
      text: text.trim(),
      message: 'Quote added successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete quote
app.delete('/api/quotes/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM quotes WHERE id = ?').run(id);
    res.json({ message: 'Quote deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get queue status
app.get('/api/queue/status', (req, res) => {
  try {
    const status = QuoteQueue.getStatus();
    const lastSent = db.prepare('SELECT value FROM settings WHERE key = ?').get('last_sent_date');
    res.json({
      ...status,
      lastSentDate: lastSent?.value || 'Never'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rebuild queue (reset cycle)
app.post('/api/queue/rebuild', (req, res) => {
  try {
    QuoteQueue.rebuildQueue();
    res.json({ message: 'Queue rebuilt successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ Push Token Endpoints ============

// Register push token
app.post('/api/push-token', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    db.prepare('INSERT OR REPLACE INTO push_tokens (token) VALUES (?)').run(token);
    res.json({ message: 'Push token registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ Settings Endpoints ============

// Get settings
app.get('/api/settings', (req, res) => {
  try {
    const settings = db.prepare('SELECT key, value FROM settings').all();
    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
    });
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update setting
app.post('/api/settings', (req, res) => {
  try {
    const { key, value } = req.body;
    
    if (!key || value === undefined) {
      return res.status(400).json({ error: 'Key and value are required' });
    }

    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value);
    res.json({ message: 'Setting updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ SMS Configuration Endpoints ============

const SMSService = require('./smsService');

// Configure SMS (SendGrid API key)
app.post('/api/sms/configure', (req, res) => {
  try {
    const { sendgridApiKey, fromEmail } = req.body;
    
    if (!sendgridApiKey || !fromEmail) {
      return res.status(400).json({ error: 'SendGrid API key and from email are required' });
    }

    SMSService.configure(sendgridApiKey, fromEmail);
    res.json({ message: 'SMS service configured successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get SMS configuration status
app.get('/api/sms/status', (req, res) => {
  res.json({ 
    configured: SMSService.isConfigured(),
    phoneNumber: '14252086648',
    carrier: 'T-Mobile'
  });
});

// ============ Testing Endpoint ============

// Send test notification (now sends SMS)
app.post('/api/test-notification', async (req, res) => {
  try {
    const result = await Scheduler.sendTestQuote();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ Backup/Restore Endpoints ============

// Export all quotes as JSON
app.get('/api/backup', (req, res) => {
  try {
    const quotes = db.prepare('SELECT * FROM quotes ORDER BY added_at').all();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=quotes-backup.json');
    res.json({
      backup_date: new Date().toISOString(),
      quotes: quotes,
      count: quotes.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Import quotes from JSON
app.post('/api/restore', (req, res) => {
  try {
    const { quotes } = req.body;
    
    if (!quotes || !Array.isArray(quotes)) {
      return res.status(400).json({ error: 'Invalid backup format' });
    }

    let imported = 0;
    const insert = db.prepare('INSERT INTO quotes (text, added_at, times_sent, last_sent_at) VALUES (?, ?, ?, ?)');
    
    quotes.forEach(quote => {
      try {
        insert.run(
          quote.text,
          quote.added_at || new Date().toISOString(),
          quote.times_sent || 0,
          quote.last_sent_at || null
        );
        imported++;
      } catch (err) {
        console.error('Error importing quote:', err);
      }
    });

    // Rebuild queue with imported quotes
    QuoteQueue.rebuildQueue();

    res.json({ 
      message: `Successfully imported ${imported} quotes`,
      imported: imported,
      total: quotes.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Web interface: http://localhost:${PORT}`);
});

