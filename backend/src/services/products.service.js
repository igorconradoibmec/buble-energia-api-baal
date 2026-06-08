const repo = require('../repositories/product.repository');

function listProducts({ category } = {}) {
    if (!category) return repo.findAll();
    return repo.findByCategory(category.trim());
}

function getProductById(id) {
    return repo.findById(id);
}

function searchProducts(query) {
    if (!query) return [];
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return repo.search(normalized);
}

function getFeaturedProducts({ limit = 8, alexaMinimum = 2 } = {}) {
    const alexa = repo.findFeatured();
    const nonAlexa = repo.findNotFeatured();

    const guaranteed = alexa.slice(0, alexaMinimum);
    const fillers = [...alexa.slice(alexaMinimum), ...nonAlexa].slice(0, limit - guaranteed.length);
    return [...guaranteed, ...fillers];
}

function getRecommendations(cartItemIds, { perCategoryLimit = 10 } = {}) {
    if (!Array.isArray(cartItemIds) || cartItemIds.length === 0) {
        return [];
    }

    const cartIdSet = new Set(cartItemIds);
    const cartProducts = repo.findByIds(cartItemIds);
    const cartCategories = [...new Set(cartProducts.map((p) => p.category).filter(Boolean))];

    if (cartCategories.length === 0) return [];

    return repo.findByCategories(cartCategories, [...cartIdSet], perCategoryLimit);
}

function validateProduct(data) {
    if (!data || typeof data !== 'object') return 'Body invalido';
    if (typeof data.name !== 'string' || !data.name.trim()) return 'Nome obrigatorio';
    if (typeof data.price !== 'number' || Number.isNaN(data.price) || data.price < 0) return 'Preco invalido';
    if (data.category !== undefined && data.category !== null && typeof data.category !== 'string') {
        return 'Categoria invalida';
    }
    return null;
}

function createProduct(data) {
    const error = validateProduct(data);
    if (error) return { error };
    return { product: repo.create(data) };
}

function updateProduct(id, data) {
    const existing = repo.findById(id);
    if (!existing) return { notFound: true, error: 'Produto nao encontrado' };

    // Mescla com o produto atual para permitir atualizacao parcial.
    const merged = { ...existing, ...data };
    const error = validateProduct(merged);
    if (error) return { error };

    return { product: repo.update(id, merged) };
}

function deleteProduct(id) {
    const removed = repo.remove(id);
    if (!removed) return { notFound: true, error: 'Produto nao encontrado' };
    return { ok: true };
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
