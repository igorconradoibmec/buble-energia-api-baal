async function loadFeaturedProducts() {
    const productGrid = document.querySelector('.product-grid-horizontal');
    if (!productGrid) return;

    try {
        const data = await Api.get('/products/featured');
        const products = Array.isArray(data.products) ? data.products : [];

        productGrid.innerHTML = '';

        if (products.length === 0) {
            productGrid.innerHTML = '<p style="text-align:center;padding:20px;">Sem destaques no momento.</p>';
            return;
        }

        products.forEach(product => {
            productGrid.appendChild(createProductCard(product));
        });
    } catch (error) {
        console.error('Erro ao carregar destaques:', error);
        productGrid.innerHTML = '<p style="text-align:center;padding:20px;">Erro ao carregar destaques.</p>';
    }
}

loadFeaturedProducts();
