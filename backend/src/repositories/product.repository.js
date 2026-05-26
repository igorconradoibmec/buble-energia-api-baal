const db = require('../db/connection');

function hydrate(row) {
    if (!row) return null;
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        category: row.category,
        price: row.price,
        oldPrice: row.old_price,
        discount: row.discount,
        rating: row.rating,
        ratingCount: row.rating_count,
        image: row.image,
        emDestaque: row.em_destaque === 1,
        blackFriday: row.black_friday === 1,
        estoque: row.estoque,
    };
}

const FIND_ALL = db.prepare('SELECT * FROM products');
const FIND_BY_ID = db.prepare('SELECT * FROM products WHERE id = ?');
const FIND_BY_CATEGORY = db.prepare(
    "SELECT * FROM products WHERE lower(category) = lower(?)"
);
const SEARCH = db.prepare(`
    SELECT * FROM products
    WHERE lower(name) LIKE lower(?)
       OR lower(description) LIKE lower(?)
       OR lower(category) LIKE lower(?)
`);
const FIND_FEATURED = db.prepare('SELECT * FROM products WHERE em_destaque = 1');
const FIND_NOT_FEATURED = db.prepare('SELECT * FROM products WHERE em_destaque = 0');
const FIND_BLACK_FRIDAY = db.prepare('SELECT * FROM products WHERE black_friday = 1');

function findAll() {
    return FIND_ALL.all().map(hydrate);
}

function findById(id) {
    return hydrate(FIND_BY_ID.get(id));
}

function findByCategory(category) {
    return FIND_BY_CATEGORY.all(category).map(hydrate);
}

function search(query) {
    const pattern = `%${query}%`;
    return SEARCH.all(pattern, pattern, pattern).map(hydrate);
}

function findFeatured() {
    return FIND_FEATURED.all().map(hydrate);
}

function findNotFeatured() {
    return FIND_NOT_FEATURED.all().map(hydrate);
}

function findBlackFriday() {
    return FIND_BLACK_FRIDAY.all().map(hydrate);
}

function findByCategories(categories, excludeIds, perCategoryLimit) {
    const excludeSet = new Set(excludeIds);
    const results = [];
    for (const category of categories) {
        const rows = FIND_BY_CATEGORY.all(category)
            .filter((r) => !excludeSet.has(r.id))
            .slice(0, perCategoryLimit);
        results.push(...rows.map(hydrate));
    }
    return results;
}

function findByIds(ids) {
    if (!ids || ids.length === 0) return [];
    const placeholders = ids.map(() => '?').join(',');
    return db.prepare(`SELECT * FROM products WHERE id IN (${placeholders})`).all(ids).map(hydrate);
}

module.exports = {
    findAll,
    findById,
    findByIds,
    findByCategory,
    search,
    findFeatured,
    findNotFeatured,
    findBlackFriday,
    findByCategories,
};
