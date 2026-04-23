const express = require('express');
const cartController = require('../controllers/cart.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.put('/items/:itemId', requireAuth, cartController.updateItemQuantity);

module.exports = router;
