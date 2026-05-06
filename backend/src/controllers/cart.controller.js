const cartService = require('../services/cart.service');

function getCart(req, res) {
    const cart = cartService.getCart(req.userId);
    res.status(200).json(cart);
}

function addItem(req, res) {
    const { productId, quantity } = req.body || {};

    if (!Number.isInteger(productId) || productId <= 0) {
        return res.status(400).json({ error: 'productId invalido' });
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return res.status(400).json({ error: 'quantity invalida (minimo 1, maximo 99)' });
    }

    const result = cartService.addItem(req.userId, productId, quantity);
    if (!result) {
        return res.status(400).json({ error: 'Produto nao encontrado' });
    }

    res.status(201).json({ message: 'Item adicionado ao carrinho', cart: result });
}

function updateItemQuantity(req, res) {
    const itemId = Number(req.params.itemId);
    const { quantity } = req.body || {};

    if (!Number.isInteger(itemId) || itemId <= 0) {
        return res.status(404).json({ error: 'Item nao encontrado no carrinho' });
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return res.status(400).json({ error: 'Quantidade invalida (minimo 1, maximo 99)' });
    }

    const cart = cartService.updateItemQuantity(req.userId, itemId, quantity);
    if (!cart) {
        return res.status(404).json({ error: 'Item nao encontrado no carrinho' });
    }

    res.status(200).json({ message: 'Quantidade atualizada', cart });
}

function removeItem(req, res) {
    const itemId = Number(req.params.itemId);
    if (!Number.isInteger(itemId) || itemId <= 0) {
        return res.status(404).json({ error: 'Item nao encontrado no carrinho' });
    }

    const cart = cartService.removeItem(req.userId, itemId);
    if (!cart) {
        return res.status(404).json({ error: 'Item nao encontrado no carrinho' });
    }

    res.status(200).json({ message: 'Item removido do carrinho', cart });
}

function clearCart(req, res) {
    const cart = cartService.clearCart(req.userId);
    res.status(200).json({ message: 'Carrinho limpo', cart });
}

module.exports = { getCart, addItem, updateItemQuantity, removeItem, clearCart };
