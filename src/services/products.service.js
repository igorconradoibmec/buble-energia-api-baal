const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '..', 'data', 'products.json');

function loadProducts() {
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(raw);
}

function listProducts({ category } = {}) {
    const all = loadProducts();
    if (!category) return all;
    const normalized = category.trim().toLowerCase();
    return all.filter((p) => p.category && p.category.toLowerCase() === normalized);
}

module.exports = { listProducts };
