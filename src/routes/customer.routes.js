const express = require('express');
const customerController = require('../controllers/customer.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/:customerId/orders', requireAuth, customerController.getOrdersByCustomerId);

module.exports = router;
