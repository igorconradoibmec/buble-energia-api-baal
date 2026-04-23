const cartService = require('../services/cart.service');

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

module.exports = { updateItemQuantity, removeItem };
