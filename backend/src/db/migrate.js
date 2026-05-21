const fs = require('fs');
const path = require('path');
const db = require('./connection');

const MIGRATIONS_DIR = process.env.MIGRATIONS_DIR
    || path.join(__dirname, 'migrations');

function ensureMigrationsTable() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS _migrations (
            name TEXT PRIMARY KEY,
            applied_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
    `);
}

function listMigrationFiles() {
    if (!fs.existsSync(MIGRATIONS_DIR)) return [];
    return fs
        .readdirSync(MIGRATIONS_DIR)
        .filter((f) => f.endsWith('.sql'))
        .sort();
}

function appliedMigrations() {
    const rows = db.prepare('SELECT name FROM _migrations').all();
    return new Set(rows.map((r) => r.name));
}

function applyMigration(name) {
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, name), 'utf8');
    const insert = db.prepare('INSERT INTO _migrations (name) VALUES (?)');
    const tx = db.transaction(() => {
        db.exec(sql);
        insert.run(name);
    });
    tx();
}

function runMigrations() {
    ensureMigrationsTable();
    const applied = appliedMigrations();
    const files = listMigrationFiles();
    const pending = files.filter((f) => !applied.has(f));

    if (pending.length === 0) {
        console.log('[migrate] nada para aplicar');
        return { applied: [] };
    }

    const appliedNow = [];
    for (const name of pending) {
        console.log(`[migrate] aplicando ${name}`);
        applyMigration(name);
        appliedNow.push(name);
    }
    console.log(`[migrate] ${appliedNow.length} migration(s) aplicada(s)`);
    return { applied: appliedNow };
}

if (require.main === module) {
    try {
        runMigrations();
        process.exit(0);
    } catch (err) {
        console.error('[migrate] erro:', err.message);
        process.exit(1);
    }
}

module.exports = { runMigrations };
