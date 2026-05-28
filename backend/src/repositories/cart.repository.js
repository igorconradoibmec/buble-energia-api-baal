const db = require('../db');
const productsService = require('../services/products.service');

function getCartIdByUserId(userId) {
    const row = db.prepare('SELECT id FROM carts WHERE user_id = ?').get(userId);
    return row ? row.id : null;
}

function getOrCreateCartId(userId) {
    const existing = getCartIdByUserId(userId);
    if (existing) return existing;
    const info = db
        .prepare('INSERT INTO carts (user_id) VALUES (?)')
        .run(userId);
    return info.lastInsertRowid;
}

function hydrate(row) {
    const product = productsService.getProductById(row.product_id);
    return {
        id: row.id,
        productId: row.product_id,
        name: product ? product.name : null,
        price: row.unit_price,
        oldPrice: product ? product.oldPrice : null,
        image: product ? product.image : null,
        rating: product ? product.rating : null,
        ratingCount: product ? product.ratingCount : null,
        quantity: row.quantity,
    };
}

function getByUserId(userId) {
    const cartId = getCartIdByUserId(userId);
    if (!cartId) return [];
    const rows = db
        .prepare(
            'SELECT id, product_id, quantity, unit_price FROM cart_items WHERE cart_id = ? ORDER BY id'
        )
        .all(cartId);
    return rows.map(hydrate);
}

function getTotalByUserId(userId) {
    const cartId = getCartIdByUserId(userId);
    if (!cartId) return 0;
    const row = db
        .prepare(
            'SELECT COALESCE(SUM(quantity * unit_price), 0) AS total FROM cart_items WHERE cart_id = ?'
        )
        .get(cartId);
    return row.total;
}

function setByUserId(userId, items) {
    const tx = db.transaction(() => {
        const cartId = getCartIdByUserId(userId);

        if (!items || items.length === 0) {
            if (cartId) {
                db.prepare('DELETE FROM cart_items WHERE cart_id = ?').run(cartId);
                db.prepare('DELETE FROM carts WHERE id = ?').run(cartId);
            }
            return;
        }

        const targetCartId = cartId || getOrCreateCartId(userId);
        const incomingProductIds = items.map((it) => it.productId);
        const placeholders = incomingProductIds.map(() => '?').join(',');

        db.prepare(
            `DELETE FROM cart_items WHERE cart_id = ? AND product_id NOT IN (${placeholders})`
        ).run(targetCartId, ...incomingProductIds);

        const upsert = db.prepare(`
            INSERT INTO cart_items (cart_id, product_id, quantity, unit_price)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(cart_id, product_id) DO UPDATE SET
                quantity = excluded.quantity,
                unit_price = excluded.unit_price
        `);
        for (const it of items) {
            upsert.run(targetCartId, it.productId, it.quantity, it.price);
        }

        db.prepare('UPDATE carts SET updated_at = datetime(\'now\') WHERE id = ?')
            .run(targetCartId);
    });
    tx();
}

module.exports = { getByUserId, setByUserId, getTotalByUserId };
