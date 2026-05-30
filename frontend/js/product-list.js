async function loadProducts() {
    try {
        const category = getURLParam('category') || '';
        const products = await ProductService.fetchByCategory(category);
        displayCategoryProducts(products, category);
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

function displayCategoryProducts(products, category) {
    updateBreadcrumb(category);

    const productList = document.querySelector('.products-grid');
    if (!productList) return;
    productList.innerHTML = '';

    products.forEach(product => {
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
