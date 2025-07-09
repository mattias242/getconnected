const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
  constructor() {
    this.dbPath = path.join(__dirname, '../../data/getconnected.db');
    this.ensureDataDirectory();
    this.db = new sqlite3.Database(this.dbPath);
    this.init();
  }

  ensureDataDirectory() {
    const dataDir = path.dirname(this.dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  init() {
    this.db.serialize(() => {
      // Users table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          email TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // User preferences table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS user_preferences (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          platform TEXT NOT NULL,
          preference_level INTEGER DEFAULT 5,
          has_account BOOLEAN DEFAULT 1,
          notes TEXT,
          FOREIGN KEY (user_id) REFERENCES users (id),
          UNIQUE(user_id, platform)
        )
      `);

      // Groups table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS groups (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Group members table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS group_members (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          group_id INTEGER,
          user_id INTEGER,
          joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (group_id) REFERENCES groups (id),
          FOREIGN KEY (user_id) REFERENCES users (id),
          UNIQUE(group_id, user_id)
        )
      `);

      // Group decisions table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS group_decisions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          group_id INTEGER,
          chosen_platform TEXT NOT NULL,
          decision_reason TEXT,
          decided_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (group_id) REFERENCES groups (id)
        )
      `);

      // Group schedules table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS group_schedules (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          group_id INTEGER,
          platform TEXT NOT NULL,
          scheduled_datetime DATETIME NOT NULL,
          duration_minutes INTEGER DEFAULT 60,
          notes TEXT,
          status TEXT DEFAULT 'scheduled',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (group_id) REFERENCES groups (id)
        )
      `);
    });
  }

  // User operations
  addUser(name, email = null) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
      stmt.run(name, email, function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
      stmt.finalize();
    });
  }

  getUser(name) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM users WHERE name = ?', [name], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  getAllUsers() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM users ORDER BY name', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Preference operations
  addUserPreference(userId, platform, preferenceLevel = 5, hasAccount = true, notes = null) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO user_preferences 
        (user_id, platform, preference_level, has_account, notes) 
        VALUES (?, ?, ?, ?, ?)
      `);
      stmt.run(userId, platform, preferenceLevel, hasAccount, notes, function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
      stmt.finalize();
    });
  }

  getUserPreferences(userId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM user_preferences WHERE user_id = ? ORDER BY preference_level DESC',
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  // Group operations
  createGroup(name, description = null) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('INSERT INTO groups (name, description) VALUES (?, ?)');
      stmt.run(name, description, function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
      stmt.finalize();
    });
  }

  addUserToGroup(groupId, userId) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare('INSERT OR IGNORE INTO group_members (group_id, user_id) VALUES (?, ?)');
      stmt.run(groupId, userId, function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
      stmt.finalize();
    });
  }

  getGroupMembers(groupId) {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT u.*, gm.joined_at 
        FROM users u 
        JOIN group_members gm ON u.id = gm.user_id 
        WHERE gm.group_id = ?
        ORDER BY u.name
      `, [groupId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  getGroupPreferences(groupId) {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT u.name, up.platform, up.preference_level, up.has_account, up.notes
        FROM users u
        JOIN group_members gm ON u.id = gm.user_id
        JOIN user_preferences up ON u.id = up.user_id
        WHERE gm.group_id = ?
        ORDER BY u.name, up.preference_level DESC
      `, [groupId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Decision operations
  saveGroupDecision(groupId, chosenPlatform, reason = null) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT INTO group_decisions (group_id, chosen_platform, decision_reason) 
        VALUES (?, ?, ?)
      `);
      stmt.run(groupId, chosenPlatform, reason, function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
      stmt.finalize();
    });
  }

  getGroupDecisions(groupId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM group_decisions WHERE group_id = ? ORDER BY decided_at DESC',
        [groupId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  close() {
    this.db.close();
  }
}

module.exports = Database;