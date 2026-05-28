const db = require('../db');

const INSERT_ORDER = db.prepare(`
    INSERT INTO orders (
        id, order_code, user_id, status, payment_method,
        coupon_code, coupon_discount, pix_discount,
        subtotal, shipping, total, final_amount,
        customer_json, billing_address_json, delivery_address_json, created_at
    ) VALUES (
        @id, @orderCode, @customerId, @status, @paymentMethod,
        @couponCode, @couponDiscount, @pixDiscount,
        @subtotal, @shipping, @total, @finalAmount,
        @customerJson, @billingAddressJson, @deliveryAddressJson, @createdAt
    )
`);

const INSERT_ITEM = db.prepare(`
    INSERT INTO order_items (order_id, product_id, quantity, unit_price_snapshot)
    VALUES (?, ?, ?, ?)
`);

const FIND_ORDER = db.prepare('SELECT * FROM orders WHERE id = ?');

const FIND_ORDERS_BY_USER = db.prepare(`
    SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
`);

const FIND_ITEMS = db.prepare(`
    SELECT product_id, quantity, unit_price_snapshot
    FROM order_items WHERE order_id = ? ORDER BY id
`);

// Reconstroi o objeto de pedido no mesmo formato exposto pelos endpoints,
// reidratando os itens e os campos guardados como JSON.
function hydrate(row) {
    if (!row) return null;
    const items = FIND_ITEMS.all(row.id).map((it) => ({
        id: it.product_id,
        quantity: it.quantity,
        price: it.unit_price_snapshot,
    }));
    return {
        id: row.id,
        orderCode: row.order_code,
        customerId: row.user_id,
        items,
        paymentMethod: row.payment_method,
        customer: JSON.parse(row.customer_json),
        billingAddress: JSON.parse(row.billing_address_json),
        deliveryAddress: JSON.parse(row.delivery_address_json),
        couponCode: row.coupon_code,
        subtotal: row.subtotal,
        shipping: row.shipping,
        couponDiscount: row.coupon_discount,
        pixDiscount: row.pix_discount,
        total: row.total,
        finalAmount: row.final_amount,
        createdAt: row.created_at,
    };
}

// Grava pedido e itens atomicamente: ou tudo, ou nada.
const insertTx = db.transaction((order) => {
    INSERT_ORDER.run({
        id: order.id,
        orderCode: order.orderCode,
        customerId: order.customerId,
        status: order.status || 'pending',
        paymentMethod: order.paymentMethod,
        couponCode: order.couponCode,
        couponDiscount: order.couponDiscount,
        pixDiscount: order.pixDiscount,
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
        finalAmount: order.finalAmount,
        customerJson: JSON.stringify(order.customer),
        billingAddressJson: JSON.stringify(order.billingAddress),
        deliveryAddressJson: JSON.stringify(order.deliveryAddress),
        createdAt: order.createdAt,
    });
    for (const it of order.items) {
        INSERT_ITEM.run(order.id, it.id, it.quantity, it.price);
    }
});

function insert(order) {
    insertTx(order);
    return order;
}

function findById(orderId) {
    return hydrate(FIND_ORDER.get(orderId));
}

function findByCustomerId(customerId) {
    return FIND_ORDERS_BY_USER.all(customerId).map(hydrate);
}

module.exports = { insert, findById, findByCustomerId };
