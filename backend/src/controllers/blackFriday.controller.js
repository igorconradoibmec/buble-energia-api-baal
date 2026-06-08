const blackFridayService = require('../services/blackFriday.service');

// Fonte unica das faixas validas: deriva das chaves do servico.
const VALID_PRICE_RANGES = Object.keys(blackFridayService.PRICE_RANGES);

function getBlackFridayProducts(req, res) {
    const { category, priceRange, minRating } = req.query;

    if (priceRange !== undefined && !VALID_PRICE_RANGES.includes(priceRange)) {
        return res.status(400).json({ error: 'priceRange invalido' });
    }

    const result = blackFridayService.getBlackFridayProducts({
        category,
        priceRange,
        minRating,
    });

    res.status(200).json({
        products: result.products,
        filters: result.filters,
        total: result.products.length,
    });
}

module.exports = {
    getBlackFridayProducts,
};
