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
        await fetchAndRenderBlackFriday();
    } catch (error) {
        console.error('Erro ao carregar produtos da Black Friday:', error);
    }
}

async function fetchAndRenderBlackFriday() {
    // O endpoint aceita uma unica categoria; com mais de uma selecionada,
    // omitimos a categoria no servidor e aplicamos o subconjunto no cliente.
    const serverCategory = blackFridayFilters.categories.length === 1
        ? blackFridayFilters.categories[0]
        : undefined;
    const priceRange = blackFridayFilters.priceRange && blackFridayFilters.priceRange !== 'all'
        ? blackFridayFilters.priceRange
        : undefined;

    try {
        const data = await Api.get('/products/black-friday', {
            baseUrl: Api.BLACK_FRIDAY_BASE_URL,
            query: {
                category: serverCategory,
                priceRange,
                minRating: blackFridayFilters.rating || undefined
            }
        });

        blackFridayProducts = Array.isArray(data.products) ? data.products : [];
        renderCategoryFilters(data.filters?.categories || [], blackFridayFilters.categories);
        renderBlackFridayProducts();
        updateBlackFridayBreadcrumb();
    } catch (error) {
        if (error.status === 400) {
            // priceRange invalido: mantem a lista atual sem quebrar a tela.
            console.warn('Filtro invalido na Black Friday:', error.message);
            return;
        }
        console.error('Erro ao carregar produtos da Black Friday:', error);
    }
}

function renderBlackFridayProducts() {
    const container = document.querySelector('.products-grid');
    if (!container) return;

    let list = blackFridayProducts;
    // Quando ha multiplas categorias, o servidor nao filtra por elas; aplica aqui.
    if (blackFridayFilters.categories.length > 1) {
        list = list.filter(product => blackFridayFilters.categories.includes(product.category));
    }

    if (!list.length) {
        container.innerHTML = '<p class="no-products">Nenhum produto encontrado para os filtros selecionados.</p>';
        return;
    }

    container.innerHTML = '';

    list.forEach(product => {
        const productCard = createProductCard(product);
        productCard.classList.add('product-card--black-friday');
        container.appendChild(productCard);
    });
}

function renderCategoryFilters(categories = [], activeCategories = []) {
    const container = document.getElementById('dynamic-category-list');
    if (!container) return;

    const sorted = [...categories].sort();

    container.innerHTML = sorted.map(category => `
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

    // Refaz a chamada ao servidor com os filtros selecionados.
    fetchAndRenderBlackFriday();
});

loadBlackFridayProducts();
