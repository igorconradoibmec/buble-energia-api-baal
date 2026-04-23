const express = require('express');
const cartController = require('../controllers/cart.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.put('/items/:itemId', requireAuth, cartController.updateItemQuantity);
router.delete('/items/:itemId', requireAuth, cartController.removeItem);
router.delete('/', requireAuth, cartController.clearCart);

module.exports = router;
