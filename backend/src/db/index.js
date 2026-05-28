const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DATABASE_PATH = process.env.DATABASE_PATH
    || path.join(__dirname, '..', '..', 'data', 'bulbe.db');

fs.mkdirSync(path.dirname(DATABASE_PATH), { recursive: true });

const db = new Database(DATABASE_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

module.exports = db;
