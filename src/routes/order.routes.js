const express = require('express');
const orderController = require('../controllers/order.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', requireAuth, orderController.createOrder);

module.exports = router;
