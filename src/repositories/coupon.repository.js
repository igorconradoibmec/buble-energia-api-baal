const fs = require('fs');
const path = require('path');

const COUPONS_FILE = path.join(__dirname, '..', 'data', 'coupons.json');

function loadAll() {
    if (!fs.existsSync(COUPONS_FILE)) return [];
    const raw = fs.readFileSync(COUPONS_FILE, 'utf8');
    return raw.trim() ? JSON.parse(raw) : [];
}

function findByCode(code) {
    if (!code) return null;
    const normalized = String(code).trim().toUpperCase();
    return loadAll().find((c) => c.code === normalized) || null;
}

module.exports = { findByCode };
