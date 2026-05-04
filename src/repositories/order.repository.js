const fs = require('fs');
const path = require('path');

const ORDERS_FILE = path.join(__dirname, '..', 'data', 'orders.json');

function loadAll() {
    if (!fs.existsSync(ORDERS_FILE)) return [];
    const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
    return raw.trim() ? JSON.parse(raw) : [];
}

function saveAll(orders) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

function insert(order) {
    const orders = loadAll();
    orders.push(order);
    saveAll(orders);
    return order;
}

function findById(orderId) {
    return loadAll().find((o) => o.id === orderId) || null;
}

module.exports = { insert, findById };
