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

function getProductById(id) {
    const all = loadProducts();
    return all.find((p) => p.id === id) || null;
}

function searchProducts(query) {
    if (!query) return [];
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    const all = loadProducts();
    return all.filter((p) => {
        const fields = [p.name, p.description, p.category];
        return fields.some((f) => typeof f === 'string' && f.toLowerCase().includes(normalized));
    });
}

module.exports = { listProducts, getProductById, searchProducts };
