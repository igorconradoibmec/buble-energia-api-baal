const path = require('path');
const db = require('../connection');
const products = require('../../data/products.json');

const BLACK_FRIDAY_IDS = new Set([1, 3, 4, 6]);

function isAlexa(p) {
    const text = `${p.name || ''} ${p.description || ''} ${p.category || ''}`.toLowerCase();
    return text.includes('alexa') || text.includes('echo');
}

const insert = db.prepare(`
    INSERT OR IGNORE INTO products
        (id, name, description, category, price, old_price, discount,
         rating, rating_count, image, em_destaque, black_friday)
    VALUES
        (@id, @name, @description, @category, @price, @old_price, @discount,
         @rating, @rating_count, @image, @em_destaque, @black_friday)
`);

const seedAll = db.transaction((rows) => {
    let inserted = 0;
    for (const p of rows) {
        const info = insert.run({
            id: p.id,
            name: p.name,
            description: p.description ?? null,
            category: p.category ?? null,
            price: p.price,
            old_price: p.oldPrice ?? null,
            discount: p.discount ?? null,
            rating: p.rating ?? null,
            rating_count: p.ratingCount ?? null,
            image: p.image ?? null,
            em_destaque: isAlexa(p) ? 1 : 0,
            black_friday: BLACK_FRIDAY_IDS.has(p.id) ? 1 : 0,
        });
        inserted += info.changes;
    }
    return inserted;
});

const inserted = seedAll(products);
console.log(`seed_products: ${inserted} row(s) inserted (of ${products.length} total).`);
