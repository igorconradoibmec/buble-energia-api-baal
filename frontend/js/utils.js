const ALEXA_PRODUCT_IDS = [1, 2, 3, 4, 5, 6];

const ProductService = {
    cache: null,
    
    async fetchProducts() {
        if (this.cache) return this.cache;
        
        try {
            const response = await fetch('products.json');
            this.cache = await response.json();
            return this.cache;
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            return [];
        }
    },
    
    clearCache() {
        this.cache = null;
    }
};

function getProductDiscount(product = {}) {
    const price = Number(product.price);
    const oldPrice = Number(product.oldPrice);
    if (!Number.isFinite(price) || !Number.isFinite(oldPrice) || oldPrice <= 0) {
        return 0;
    }
    const discount = Math.round(((oldPrice - price) / oldPrice) * 100);
    return Math.max(0, discount);
}

function createProductCard(product) {
    const article = document.createElement('article');
    article.className = 'product-card';
    article.dataset.id = product.id;
    
    if (isAlexaProduct(product)) {
        article.classList.add('product-card--alexa');
    }
    
    const discount = getProductDiscount(product);
    
    article.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="discount-tag">-${discount}%</div>
        <h3 class="product-title">${product.name}</h3>
        <div class="product-rating">
            <img src="images/avaliacao.png" alt="5 estrelas">
            <span class="rating-count">(${product.ratingCount})</span>
        </div>
        <div class="price-initial">
            <span class="price-label-de">De</span>
            <span class="price-value-old">R$${product.oldPrice.toFixed(2)}</span>
            <span class="price-label-por">por</span>
        </div>
        <div class="price-final">
            <span class="price-currency">R$</span>
            <span class="price-value">${product.price.toFixed(2)}</span>
        </div>
    `;
    
    article.addEventListener('click', () => {
        window.location.href = `product-detail.html?id=${product.id}`;
    });
    
    return article;
}

function searchProducts(products, query) {
    if (!query) return products;
    
    const searchTerm = query.toLowerCase().trim();
    
    return products.filter(product => {
        const name = product.name.toLowerCase();
        const description = product.description.toLowerCase();
        const category = product.category.toLowerCase();
        
        return name.includes(searchTerm) || 
               description.includes(searchTerm) || 
               category.includes(searchTerm);
    });
}

function getURLParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function isAlexaProduct(product) {
    if (!product) return false;
    
    if (product.id && ALEXA_PRODUCT_IDS.includes(product.id)) {
        return true;
    }
    
    const name = (product.name || '').toLowerCase();
    return name.includes('echo') || name.includes('alexa');
}

function getAlexaProducts(products = []) {
    return products.filter(isAlexaProduct);
}
