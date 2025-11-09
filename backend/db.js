const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'quotes.db'));

// Initialize database tables
function initDB() {
  // Quotes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      author TEXT,
      added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      times_sent INTEGER DEFAULT 0,
      last_sent_at DATETIME
    )
  `);

  // Queue table to track which quotes have been sent this cycle
  db.exec(`
    CREATE TABLE IF NOT EXISTS quote_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quote_id INTEGER NOT NULL,
      position INTEGER NOT NULL,
      sent BOOLEAN DEFAULT 0,
      FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE
    )
  `);

  // Push tokens table
  db.exec(`
    CREATE TABLE IF NOT EXISTS push_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT UNIQUE NOT NULL,
      added_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // Day log table to track one quote per day (for Google Apps Script)
  db.exec(`
    CREATE TABLE IF NOT EXISTS day_log (
      day TEXT PRIMARY KEY,
      quote_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Initialize default settings
  const setDefault = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  setDefault.run('time_window_start', '8');  // 8 AM
  setDefault.run('time_window_end', '20');   // 8 PM
  setDefault.run('last_sent_date', '');
}

initDB();

module.exports = db;

