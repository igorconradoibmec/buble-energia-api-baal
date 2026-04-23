const productsService = require('../services/products.service');

function listProducts(req, res) {
    const { category } = req.query;
    const products = productsService.listProducts({ category });
    res.status(200).json({ products, total: products.length });
}

module.exports = { listProducts };
