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

function getFeaturedProducts(req, res) {
    const products = productsService.getFeaturedProducts();
    res.status(200).json({ products, total: products.length });
}

function getRecommendations(req, res) {
    const raw = typeof req.query.cartItemIds === 'string' ? req.query.cartItemIds : '';
    const cartItemIds = raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map(Number)
        .filter((n) => Number.isInteger(n) && n > 0);

    const recommendations = productsService.getRecommendations(cartItemIds);
    res.status(200).json({ recommendations, total: recommendations.length });
}

function createProduct(req, res) {
    const result = productsService.createProduct(req.body);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    res.status(201).json(result.product);
}

function updateProduct(req, res) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(404).json({ error: 'Produto nao encontrado' });
    }
    const result = productsService.updateProduct(id, req.body);
    if (result.notFound) {
        return res.status(404).json({ error: result.error });
    }
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    res.status(200).json(result.product);
}

function deleteProduct(req, res) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(404).json({ error: 'Produto nao encontrado' });
    }
    const result = productsService.deleteProduct(id);
    if (result.notFound) {
        return res.status(404).json({ error: result.error });
    }
    res.status(204).send();
}

module.exports = {
    listProducts,
    getProductById,
    searchProducts,
    getFeaturedProducts,
    getRecommendations,
    createProduct,
    updateProduct,
    deleteProduct,
};
