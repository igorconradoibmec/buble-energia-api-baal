const express = require('express');
const productsController = require('../controllers/products.controller');

const router = express.Router();

router.get('/', productsController.listProducts);
router.get('/:id', productsController.getProductById);

module.exports = router;
