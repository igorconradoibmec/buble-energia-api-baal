const cartRepository = require('../repositories/cart.repository');
const productsService = require('./products.service');

const MAX_QUANTITY = 99;

function summarize(userId, items) {
    const itemCount = items.reduce((sum, it) => sum + it.quantity, 0);
    const total = cartRepository.getTotalByUserId(userId);
    return { items, itemCount, total: Number(total.toFixed(2)) };
}

function getCart(userId) {
    return summarize(userId, cartRepository.getByUserId(userId));
}

function addItem(userId, productId, quantity) {
    const product = productsService.getProductById(productId);
    if (!product) return null;

    const items = cartRepository.getByUserId(userId);
    const index = items.findIndex((it) => it.productId === productId);

    if (index === -1) {
        items.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            oldPrice: product.oldPrice,
            image: product.image,
            rating: product.rating,
            ratingCount: product.ratingCount,
            quantity: Math.min(quantity, MAX_QUANTITY),
        });
    } else {
        const newQuantity = Math.min(items[index].quantity + quantity, MAX_QUANTITY);
        items[index] = { ...items[index], quantity: newQuantity };
    }

    cartRepository.setByUserId(userId, items);
    return summarize(userId, cartRepository.getByUserId(userId));
}

function updateItemQuantity(userId, itemId, quantity) {
    const items = cartRepository.getByUserId(userId);
    const index = items.findIndex((it) => it.id === itemId);
    if (index === -1) return null;
    items[index] = { ...items[index], quantity };
    cartRepository.setByUserId(userId, items);
    return summarize(userId, cartRepository.getByUserId(userId));
}

function removeItem(userId, itemId) {
    const items = cartRepository.getByUserId(userId);
    const index = items.findIndex((it) => it.id === itemId);
    if (index === -1) return null;
    items.splice(index, 1);
    cartRepository.setByUserId(userId, items);
    return summarize(userId, cartRepository.getByUserId(userId));
}

function clearCart(userId) {
    cartRepository.setByUserId(userId, []);
    return summarize(userId, []);
}

module.exports = { getCart, addItem, updateItemQuantity, removeItem, clearCart };
