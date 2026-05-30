async function loadProducts() {
    try {
        const searchQuery = getURLParam('q') || '';
        const results = await ProductService.search(searchQuery);
        displaySearchResults(results, searchQuery);
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

function displaySearchResults(results, searchQuery) {
    updateSearchDisplay(searchQuery);

    const productList = document.querySelector('.products-grid');
    if (!productList) return;
    productList.innerHTML = '';

    if (results.length === 0) {
        productList.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #536679;">Nenhum produto encontrado para "' + searchQuery + '"</p>';
        return;
    }
    
    results.forEach(product => {
        const productCard = createProductCard(product);
        productList.appendChild(productCard);
    });
}

function updateSearchDisplay(query) {
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        pageTitle.textContent = query 
            ? `Resultados para: "${query}"`
            : 'Resultados da Pesquisa';
    }
    
    const searchInput = document.getElementById('search-input');
    if (searchInput && query) {
        searchInput.value = query;
    }
    
    const breadcrumbSpan = document.querySelector('[data-breadcrumb="current"]');
    if (breadcrumbSpan) {
        breadcrumbSpan.textContent = query 
            ? `Resultados para "${query}"`
            : 'Resultados da pesquisa';
    }
}

loadProducts();
