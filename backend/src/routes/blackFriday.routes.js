const express = require('express');
const blackFridayController = require('../controllers/blackFriday.controller');

const router = express.Router();

// Montado em /api/v1/products/black-friday: endpoint unico da campanha.
router.get('/', blackFridayController.getBlackFridayProducts);

module.exports = router;
