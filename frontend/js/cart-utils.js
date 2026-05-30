/**
 * CartService: integra carrinho com backend (/api/v1/cart*).
 *
 * Contrato do backend (cart.repository.hydrate) — cada item tem:
 *   { id, productId, name, price, oldPrice, image, rating, ratingCount, quantity }
 *
 * IMPORTANTE: `id` e' o id da linha em cart_items, usado por PUT/DELETE.
 * `productId` e' o id do produto, usado para link de detalhe / recomendacoes.
 *
 * GET /cart       -> { items, itemCount, total }
 * POST /cart/items, PUT/DELETE /cart/items/:id, DELETE /cart -> { message, cart }
 */
const CartService = {
    async getCart() {
        return await Api.get('/cart', { auth: true });
    },

    async addItem(productId, quantity = 1) {
        const response = await Api.post(
            '/cart/items',
            { productId: Number(productId), quantity: Number(quantity) },
            { auth: true },
        );
        return response.cart;
    },

    async updateItemQuantity(itemId, quantity) {
        if (quantity < 1 || quantity > 99) {
            throw new Error('Quantidade invalida (1-99)');
        }
        const response = await Api.put(
            `/cart/items/${itemId}`,
            { quantity: Number(quantity) },
            { auth: true },
        );
        return response.cart;
    },

    async removeItem(itemId) {
        const response = await Api.delete(`/cart/items/${itemId}`, { auth: true });
        return response.cart;
    },

    async clearCart() {
        const response = await Api.delete('/cart', { auth: true });
        return response.cart;
    },
};
