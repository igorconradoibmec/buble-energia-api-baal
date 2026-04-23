const productsService = require('../services/products.service');

function listProducts(req, res) {
    const { category } = req.query;
    const products = productsService.listProducts({ category });
    res.status(200).json({ products, total: products.length });
}

function getProductById(req, res) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(404).json({ error: 'Produto nao encontrado' });
    }
    const product = productsService.getProductById(id);
    if (!product) {
        return res.status(404).json({ error: 'Produto nao encontrado' });
    }
    res.status(200).json(product);
}

function searchProducts(req, res) {
    const q = typeof req.query.q === 'string' ? req.query.q : '';
    const results = productsService.searchProducts(q);
    res.status(200).json({ query: q, results, total: results.length });
}

module.exports = { listProducts, getProductById, searchProducts };
