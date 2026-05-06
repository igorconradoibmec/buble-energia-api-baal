async function loadFeaturedProducts() {
    try {
        const products = await ProductService.fetchProducts();
        const productGrid = document.querySelector('.product-grid-horizontal');
        if (!productGrid) return;
        
        const alexaProducts = typeof getAlexaProducts === 'function'
            ? getAlexaProducts(products)
            : products.filter(isAlexaProduct);
        
        const featuredList = [];
        
        // Garantir até 2 Alexas
        alexaProducts.slice(0, 2).forEach(product => featuredList.push(product));
        
        // Preencher o restante com produtos aleatórios distintos
        const remainingProducts = products.filter(product => !featuredList.includes(product));
        shuffleArray(remainingProducts);
        
        remainingProducts.slice(0, Math.max(0, 8 - featuredList.length)).forEach(product => {
            featuredList.push(product);
        });
        
        productGrid.innerHTML = '';
        
        featuredList.slice(0, 8).forEach(product => {
            const productCard = createProductCard(product);
            productGrid.appendChild(productCard);
        });
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

loadFeaturedProducts();
