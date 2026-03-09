async function loadProducts() {
    try {
        const products = await ProductService.fetchProducts();
        displayCategoryProducts(products);
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

function displayCategoryProducts(allProducts) {
    const category = getURLParam('category') || '';
    
    updateBreadcrumb(category);
    
    const filteredProducts = category 
        ? allProducts.filter(product => product.category === category)
        : allProducts;
    
    const productList = document.querySelector('.products-grid');
    if (!productList) return;
    productList.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productList.appendChild(productCard);
    });
}

function updateBreadcrumb(category) {
    const breadcrumbSpan = document.querySelector('[data-breadcrumb="current"]');
    if (!breadcrumbSpan) return;
    
    if (category) {
        breadcrumbSpan.textContent = category;
    } else {
        breadcrumbSpan.textContent = 'Todos os produtos';
    }
}

loadProducts();
