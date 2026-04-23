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

function isAlexaProduct(p) {
    const text = `${p.name || ''} ${p.description || ''} ${p.category || ''}`.toLowerCase();
    return text.includes('alexa') || text.includes('echo');
}

function getFeaturedProducts({ limit = 8, alexaMinimum = 2 } = {}) {
    const all = loadProducts();
    const alexa = all.filter(isAlexaProduct);
    const nonAlexa = all.filter((p) => !isAlexaProduct(p));

    const guaranteed = alexa.slice(0, alexaMinimum);
    const fillers = [...alexa.slice(alexaMinimum), ...nonAlexa].slice(0, limit - guaranteed.length);
    return [...guaranteed, ...fillers];
}

module.exports = { listProducts, getProductById, searchProducts, getFeaturedProducts };
