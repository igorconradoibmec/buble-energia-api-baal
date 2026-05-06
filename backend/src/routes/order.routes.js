const express = require('express');
const orderController = require('../controllers/order.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', requireAuth, orderController.createOrder);
router.get('/:orderId', requireAuth, orderController.getOrderById);

module.exports = router;
