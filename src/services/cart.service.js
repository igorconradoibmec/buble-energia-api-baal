const cartRepository = require('../repositories/cart.repository');

function summarize(items) {
    const itemCount = items.reduce((sum, it) => sum + it.quantity, 0);
    const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    return { items, itemCount, total: Number(total.toFixed(2)) };
}

function getCart(userId) {
    return summarize(cartRepository.getByUserId(userId));
}

function updateItemQuantity(userId, itemId, quantity) {
    const items = cartRepository.getByUserId(userId);
    const index = items.findIndex((it) => it.id === itemId);
    if (index === -1) return null;
    items[index] = { ...items[index], quantity };
    cartRepository.setByUserId(userId, items);
    return summarize(items);
}

module.exports = { getCart, updateItemQuantity };
