const BLACK_FRIDAY_ECHO_IDS = [1, 3, 4, 6];
let blackFridayProducts = [];
const blackFridayFilters = {
    categories: [],
    priceRange: 'all',
    rating: null
};

async function loadBlackFridayProducts() {
    try {
        const categoryParam = getURLParam('category');
        if (categoryParam) {
            blackFridayFilters.categories = [categoryParam];
        }

        const products = await ProductService.fetchProducts();
        const echoDotDeals = products.filter(isBlackFridayEchoProduct);
        
        blackFridayProducts = echoDotDeals.length
            ? echoDotDeals
            : (typeof getAlexaProducts === 'function'
                ? getAlexaProducts(products)
                : products.filter(product => isAlexaProduct(product)));

        renderCategoryFilters(blackFridayProducts, blackFridayFilters.categories);
        renderBlackFridayProducts();
        updateBlackFridayBreadcrumb();
    } catch (error) {
        console.error('Erro ao carregar produtos da Black Friday:', error);
    }
}

function renderBlackFridayProducts() {
    const container = document.querySelector('.products-grid');
    if (!container) return;

    const filteredProducts = applyBlackFridayFilters();

    if (!filteredProducts.length) {
        container.innerHTML = '<p class="no-products">Nenhum produto encontrado para os filtros selecionados.</p>';
        return;
    }

    container.innerHTML = '';

    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productCard.classList.add('product-card--black-friday');
        container.appendChild(productCard);
    });
}

function applyBlackFridayFilters() {
    return blackFridayProducts.filter(product => {
        if (blackFridayFilters.categories.length && !blackFridayFilters.categories.includes(product.category)) {
            return false;
        }

        if (!isWithinPriceRange(product.price, blackFridayFilters.priceRange)) {
            return false;
        }

        if (blackFridayFilters.rating && product.rating < blackFridayFilters.rating) {
            return false;
        }

        return true;
    });
}

function isWithinPriceRange(price, range) {
    if (!range || range === 'all') return true;
    
    const [min, max] = range.split('-').map(Number);
    if (Number.isNaN(min)) return true;
    
    if (range === '300-999') {
        return price >= min;
    }
    
    return price >= min && price <= max;
}

function renderCategoryFilters(products, activeCategories = []) {
    const container = document.getElementById('dynamic-category-list');
    if (!container) return;

    const categories = [...new Set(products.map(product => product.category))].sort();

    container.innerHTML = categories.map(category => `
        <label class="filter-option">
            <input type="checkbox" name="category" value="${category}" ${activeCategories.includes(category) ? 'checked' : ''}>
            ${category}
        </label>
    `).join('');
}

function updateBlackFridayBreadcrumb() {
    const breadcrumbSpan = document.querySelector('[data-breadcrumb="current"]');
    if (!breadcrumbSpan) return;

    breadcrumbSpan.textContent = blackFridayFilters.categories.length
        ? blackFridayFilters.categories[0]
        : 'Todos os descontos';
}

function isBlackFridayEchoProduct(product) {
    if (!product) return false;
    if (product.id && BLACK_FRIDAY_ECHO_IDS.includes(product.id)) {
        return true;
    }
    const name = (product.name || '').toLowerCase();
    return name.includes('echo dot');
}

document.addEventListener('filters:apply', (event) => {
    const filters = event.detail?.filters || {};
    const categoryFilter = filters.category;
    
    if (Array.isArray(categoryFilter)) {
        blackFridayFilters.categories = categoryFilter;
    } else if (typeof categoryFilter === 'string') {
        blackFridayFilters.categories = [categoryFilter];
    } else {
        blackFridayFilters.categories = [];
    }

    blackFridayFilters.priceRange = filters['price-range'] || 'all';
    blackFridayFilters.rating = filters.rating ? Number(filters.rating) : null;

    renderBlackFridayProducts();
    updateBlackFridayBreadcrumb();
});

loadBlackFridayProducts();
