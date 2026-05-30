const express = require('express');
const productsController = require('../controllers/products.controller');
const requireAdmin = require('../middlewares/requireAdmin');

const router = express.Router();

router.get('/', productsController.listProducts);
router.get('/search', productsController.searchProducts);
router.get('/featured', productsController.getFeaturedProducts);
router.get('/black-friday', productsController.getBlackFridayProducts);
router.get('/recommendations', productsController.getRecommendations);
router.get('/:id', productsController.getProductById);

// CRUD de produtos (admin) — escrita protegida por JWT com role admin.
router.post('/', requireAdmin, productsController.createProduct);
router.put('/:id', requireAdmin, productsController.updateProduct);
router.delete('/:id', requireAdmin, productsController.deleteProduct);

module.exports = router;
