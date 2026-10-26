const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

/**
 * Initialize the SQLite database using sql.js (pure JavaScript SQLite).
 * @param {string} [dbPath] - Path to the database file. Defaults to employees.db in the backend root.
 *                             Pass ':memory:' for an in-memory database (used in tests).
 * @returns {Promise<object>} A wrapper object with a sql.js-compatible API matching better-sqlite3 style.
 */
async function initializeDatabase(dbPath) {
  const SQL = await initSqlJs();

  let db;
  if (dbPath && dbPath !== ':memory:' && fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Store path for persistence
  db._filePath = dbPath || path.join(__dirname, '..', 'employees.db');

  // Create the employees table
  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      department TEXT NOT NULL,
      designation TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  /**
   * Wrap sql.js with a convenience API similar to better-sqlite3.
   * This lets routes call db.prepare(sql).all(...params) etc.
   */
  const wrapper = {
    /**
     * Return a statement-like object with .all(), .get(), .run() methods.
     * @param {string} sql - SQL query string
     */
    prepare(sql) {
      return {
        /**
         * Execute and return all rows as an array of objects.
         */
        all(...params) {
          const stmt = db.prepare(sql);
          stmt.bind(params);
          const rows = [];
          while (stmt.step()) {
            rows.push(stmt.getAsObject());
          }
          stmt.free();
          return rows;
        },

        /**
         * Execute and return the first row as an object, or undefined.
         */
        get(...params) {
          const stmt = db.prepare(sql);
          stmt.bind(params);
          let row;
          if (stmt.step()) {
            row = stmt.getAsObject();
          }
          stmt.free();
          return row;
        },

        /**
         * Execute a statement (INSERT/UPDATE/DELETE) and return { changes, lastInsertRowid }.
         */
        run(...params) {
          db.run(sql, params);
          const changes = db.getRowsModified();
          // Get last insert rowid
          const lastStmt = db.prepare('SELECT last_insert_rowid() as id');
          lastStmt.step();
          const lastInsertRowid = lastStmt.getAsObject().id;
          lastStmt.free();
          return { changes, lastInsertRowid };
        },
      };
    },

    /**
     * Persist database to disk (for file-based databases).
     */
    save() {
      if (db._filePath && db._filePath !== ':memory:') {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(db._filePath, buffer);
      }
    },

    /**
     * Close the database.
     */
    close() {
      wrapper.save();
      db.close();
    },

    /**
     * Get the underlying sql.js database for advanced operations.
     */
    get _db() {
      return db;
    },
  };

  return wrapper;
}

module.exports = { initializeDatabase };
