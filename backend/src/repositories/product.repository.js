const db = require('../db');

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

const INSERT = db.prepare(`
    INSERT INTO products
        (name, description, category, price, old_price, discount, rating, rating_count, image, em_destaque, black_friday, estoque)
    VALUES
        (@name, @description, @category, @price, @old_price, @discount, @rating, @rating_count, @image, @em_destaque, @black_friday, @estoque)
`);
const UPDATE = db.prepare(`
    UPDATE products SET
        name = @name, description = @description, category = @category, price = @price,
        old_price = @old_price, discount = @discount, rating = @rating, rating_count = @rating_count,
        image = @image, em_destaque = @em_destaque, black_friday = @black_friday, estoque = @estoque,
        updated_at = datetime('now')
    WHERE id = @id
`);
const DELETE = db.prepare('DELETE FROM products WHERE id = ?');

// Converte o objeto da API (camelCase) para as colunas da tabela (snake_case).
function toRow(data) {
    return {
        name: data.name,
        description: data.description ?? null,
        category: data.category ?? null,
        price: data.price,
        old_price: data.oldPrice ?? null,
        discount: data.discount ?? null,
        rating: data.rating ?? null,
        rating_count: data.ratingCount ?? null,
        image: data.image ?? null,
        em_destaque: data.emDestaque ? 1 : 0,
        black_friday: data.blackFriday ? 1 : 0,
        estoque: data.estoque ?? 0,
    };
}

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

function create(data) {
    const info = INSERT.run(toRow(data));
    return findById(info.lastInsertRowid);
}

function update(id, data) {
    const result = UPDATE.run({ ...toRow(data), id });
    if (result.changes === 0) return null;
    return findById(id);
}

function remove(id) {
    return DELETE.run(id).changes > 0;
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
    create,
    update,
    remove,
};
