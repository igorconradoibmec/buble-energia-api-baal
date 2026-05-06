const express = require('express');
const productsController = require('../controllers/products.controller');

const router = express.Router();

router.get('/', productsController.listProducts);
router.get('/search', productsController.searchProducts);
router.get('/featured', productsController.getFeaturedProducts);
router.get('/black-friday', productsController.getBlackFridayProducts);
router.get('/:id', productsController.getProductById);

module.exports = router;
