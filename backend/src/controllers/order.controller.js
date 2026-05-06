const orderService = require('../services/order.service');

function createOrder(req, res) {
    const result = orderService.createOrder(req.userId, req.body);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    res.status(201).json(result.order);
}

function getOrderById(req, res) {
    const result = orderService.getOrderById(req.params.orderId);
    if (result.error) {
        return res.status(404).json({ error: result.error });
    }
    res.status(200).json(result.order);
}

module.exports = { createOrder, getOrderById };
