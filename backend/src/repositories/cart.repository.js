const fs = require('fs');
const path = require('path');

const CARTS_FILE = path.join(__dirname, '..', 'data', 'carts.json');

function loadAll() {
    if (!fs.existsSync(CARTS_FILE)) return {};
    const raw = fs.readFileSync(CARTS_FILE, 'utf8');
    return raw.trim() ? JSON.parse(raw) : {};
}

function saveAll(carts) {
    fs.writeFileSync(CARTS_FILE, JSON.stringify(carts, null, 2));
}

function getByUserId(userId) {
    const carts = loadAll();
    return Array.isArray(carts[userId]) ? carts[userId] : [];
}

function setByUserId(userId, items) {
    const carts = loadAll();
    if (!items || items.length === 0) {
        delete carts[userId];
    } else {
        carts[userId] = items;
    }
    saveAll(carts);
}

module.exports = { getByUserId, setByUserId };
