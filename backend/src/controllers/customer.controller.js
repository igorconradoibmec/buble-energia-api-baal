const orderService = require('../services/order.service');

function getOrdersByCustomerId(req, res) {
    const result = orderService.getOrdersByCustomerId(req.params.customerId);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    res.status(200).json({ orders: result.orders, total: result.total });
}

module.exports = { getOrdersByCustomerId };
