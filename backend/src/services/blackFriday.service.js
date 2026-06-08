const repo = require('../repositories/product.repository');

// Faixas de preco aceitas no filtro da campanha (label -> [min, max]).
const PRICE_RANGES = {
    'all': null,
    '0-50': [0, 50],
    '50-100': [50, 100],
    '100-300': [100, 300],
    '300-999': [300, 999],
};

function getBlackFridayProducts({ category, priceRange, minRating } = {}) {
    const base = repo.findBlackFriday();

    let filtered = base;

    if (category) {
        const normalized = category.trim().toLowerCase();
        filtered = filtered.filter(
            (p) => p.category && p.category.toLowerCase().includes(normalized)
        );
    }

    if (priceRange && priceRange !== 'all') {
        const range = PRICE_RANGES[priceRange];
        if (range) {
            const [min, max] = range;
            filtered = filtered.filter((p) => p.price >= min && p.price <= max);
        }
    }

    if (minRating !== undefined && minRating !== null && !Number.isNaN(Number(minRating))) {
        const min = Number(minRating);
        filtered = filtered.filter((p) => (p.rating || 0) >= min);
    }

    const categories = [...new Set(base.map((p) => p.category).filter(Boolean))];
    const priceRanges = Object.keys(PRICE_RANGES).filter((k) => k !== 'all');

    return {
        products: filtered,
        filters: { categories, priceRanges },
    };
}

module.exports = {
    PRICE_RANGES,
    getBlackFridayProducts,
};
