const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

function loadAll() {
    if (!fs.existsSync(USERS_FILE)) return [];
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    return raw.trim() ? JSON.parse(raw) : [];
}

function saveAll(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function insert(user) {
    const users = loadAll();
    users.push(user);
    saveAll(users);
    return user;
}

module.exports = { insert };
