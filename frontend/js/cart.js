function loadCart() {
    const cart = CartService.getCart();
    const cartItemsContainer = document.querySelector('.cart-items');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 40px;">Seu carrinho está vazio</p>';
        updateSubtotal();
        renderRecommendations();
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = createCartItem(item);
        cartItemsContainer.appendChild(cartItem);
    });
    
    updateSubtotal();
    renderRecommendations();
}

function createCartItem(item) {
    const article = document.createElement('article');
    article.className = 'cart-item';
    article.dataset.id = item.id;
    
    article.innerHTML = `
        <div>
            <div class="item-image-container">
                <img src="${item.image}" alt="${item.name}" class="item-image">
            </div>
            
            <div class="item-details">
                <h3 class="item-title">${item.name}</h3>
                
                <div class="item-rating">
                    <img src="images/avaliacao.png" alt="5 estrelas">
                    <span class="rating-count">(${item.ratingCount})</span>
                </div>
                
                <div class="item-price-initial">
                    <span class="price-label-de">De</span>
                    <span class="price-value-old" data-old-price-id="${item.id}">R$${(item.oldPrice * item.quantity).toFixed(2)}</span>
                    <span class="price-label-por">por</span>
                </div>
                
                <div class="item-price-final">
                    <span class="price-currency">R$</span>
                    <span class="price-value" data-item-id="${item.id}">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            </div>
        </div>

        <label for="quantity-${item.id}" class="quantity-label">Quantidade:</label>
        <div class="item-quantity-selector">
            <button class="quantity-btn decrease" data-id="${item.id}" aria-label="Diminuir quantidade">-</button>
            <input type="number" id="quantity-${item.id}" class="quantity-input" value="${item.quantity}" min="1" max="99" data-id="${item.id}">
            <button class="quantity-btn increase" data-id="${item.id}" aria-label="Aumentar quantidade">+</button>
        </div>
    `;
    
    article.querySelector('.decrease').addEventListener('click', () => decreaseQuantity(item.id));
    article.querySelector('.increase').addEventListener('click', () => increaseQuantity(item.id));
    article.querySelector('.quantity-input').addEventListener('change', (e) => updateQuantity(item.id, parseInt(e.target.value)));
    
    return article;
}

function decreaseQuantity(itemId) {
    const cart = CartService.getCart();
    const item = cart.find(i => i.id === itemId);
    
    if (item) {
        if (item.quantity === 1) {
            removeItem(itemId);
        } else {
            CartService.updateItemQuantity(itemId, item.quantity - 1);
            updateItemPrice(itemId, item.price, item.quantity - 1);
            updateSubtotal();
            renderRecommendations();
        }
    }
}

function increaseQuantity(itemId) {
    const cart = CartService.getCart();
    const item = cart.find(i => i.id === itemId);
    
    if (item && item.quantity < 99) {
        CartService.updateItemQuantity(itemId, item.quantity + 1);
        updateItemPrice(itemId, item.price, item.quantity + 1);
        updateSubtotal();
        renderRecommendations();
    }
}

function updateQuantity(itemId, newQuantity) {
    if (CartService.updateItemQuantity(itemId, newQuantity)) {
        const cart = CartService.getCart();
        const item = cart.find(i => i.id === itemId);
        if (item) {
            updateItemPrice(itemId, item.price, item.quantity);
            updateSubtotal();
            renderRecommendations();
        }
    }
}

function removeItem(itemId) {
    CartService.removeItem(itemId);
    loadCart();
}

function updateItemPrice(itemId, unitPrice, quantity) {
    const cart = CartService.getCart();
    const item = cart.find(i => i.id === itemId);
    
    if (!item) return;
    
    const priceElement = document.querySelector(`[data-item-id="${itemId}"]`);
    if (priceElement) {
        priceElement.textContent = (unitPrice * quantity).toFixed(2);
    }
    
    const oldPriceElement = document.querySelector(`[data-old-price-id="${itemId}"]`);
    if (oldPriceElement) {
        oldPriceElement.textContent = `R$${(item.oldPrice * quantity).toFixed(2)}`;
    }
    
    const quantityInput = document.getElementById(`quantity-${itemId}`);
    if (quantityInput) {
        quantityInput.value = quantity;
    }
}

function updateSubtotal() {
    const summarySection = document.getElementById('cart-summary-inline');
    const subtotalValue = document.getElementById('subtotal-value');
    if (!summarySection || !subtotalValue) return;

    const subtotal = CartService.getTotal();

    if (subtotal <= 0) {
        summarySection.hidden = true;
    } else {
        summarySection.hidden = false;
        subtotalValue.textContent = `R$ ${subtotal.toFixed(2)}`;
    }
}

document.getElementById('checkout-btn').addEventListener('click', () => {
    const cart = CartService.getCart();
    if (cart.length > 0) {
        window.location.href = 'checkout.html';
    } else {
        alert('Seu carrinho está vazio!');
    }
});

loadCart();
/* Helpers de recomendações */
let lastRecommendationsSignature = '';

function getCartProductIds() {
    return CartService.getCart().map(item => item.id);
}

function computeRecommendationsSignature(products) {
    if (!Array.isArray(products) || products.length === 0) return '';
    return products.map(p => p.id).join(',');
}

function showSkeleton(section, skeleton, carousel) {
    section.hidden = false;
    if (skeleton) skeleton.style.display = 'flex';
    if (carousel) carousel.style.display = 'none';
}

function showCarousel(section, skeleton, carousel) {
    if (skeleton) skeleton.style.display = 'none';
    if (carousel) carousel.style.display = 'block';
    section.hidden = false;
}

function hideRecommendations(section, skeleton) {
    if (skeleton) skeleton.style.display = 'none';
    section.hidden = true;
}

function renderCards(target, cards) {
    if (!target) return;
    target.innerHTML = '';
    cards.forEach(card => target.appendChild(card));
}

function getCartCategories(allProducts) {
    if (!Array.isArray(allProducts) || allProducts.length === 0) return [];
    const cartIds = new Set(getCartProductIds());
    if (cartIds.size === 0) return [];
    const categoriesSet = new Set();
    
    allProducts.forEach(product => {
        if (!product || product.id == null) return;
        if (!cartIds.has(product.id)) return;
        const category = typeof product.category === 'string' ? product.category.trim() : null;
        if (category) {
            categoriesSet.add(category);
        }
    });
    
    return Array.from(categoriesSet);
}

async function fetchAllProducts() {
    try {
        const products = await ProductService.fetchProducts();
        return Array.isArray(products) ? products : [];
    } catch (error) {
        console.error('Erro ao buscar produtos para recomendações:', error);
        return [];
    }
}

function getRecommendedCandidates(allProducts) {
    if (!Array.isArray(allProducts) || allProducts.length === 0) return [];
    const cartIds = new Set(getCartProductIds());
    if (cartIds.size === 0) return [];
    const categories = new Set(getCartCategories(allProducts));
    if (categories.size === 0) return [];
    
    return allProducts.filter(product => {
        if (!product || product.id == null) return false;
        const category = typeof product.category === 'string' ? product.category.trim() : null;
        const inSameCategory = category && categories.has(category);
        const notInCart = !cartIds.has(product.id);
        return inSameCategory && notInCart;
    });
}

function limitRecommendationsByCategory(candidates, limitPerCategory = 10) {
    const uniqueIds = new Set();
    const categoryCount = new Map();
    const limited = [];
    
    for (const product of candidates) {
        if (!product || !product.id) continue;
        const category = typeof product.category === 'string' ? product.category.trim() : null;
        if (!category) continue;
        if (uniqueIds.has(product.id)) continue;
        
        const count = categoryCount.get(category) || 0;
        if (count >= limitPerCategory) continue;
        
        uniqueIds.add(product.id);
        categoryCount.set(category, count + 1);
        limited.push(product);
    }
    
    return limited;
}

function normalizeProductPrices(product) {
    const normalized = { ...product };
    if (normalized && normalized.price != null && !Number.isNaN(normalized.price)) {
        normalized.price = Number(parseFloat(normalized.price).toFixed(2));
    }
    if (normalized && normalized.oldPrice != null && !Number.isNaN(normalized.oldPrice)) {
        normalized.oldPrice = Number(parseFloat(normalized.oldPrice).toFixed(2));
    }
    return normalized;
}

function buildRecommendationCards(products) {
    if (!Array.isArray(products) || products.length === 0) return [];
    return products.map(product => {
        const normalized = normalizeProductPrices(product);
        const card = createProductCard(normalized);
        card.setAttribute('role', 'listitem');
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
        return card;
    });
}

async function renderRecommendations() {
    const section = document.getElementById('cart-recommendations');
    const track = document.getElementById('recommendations-track');
    if (!section || !track) return;
    const skeleton = document.getElementById('recommendations-skeleton');
    const carousel = section.querySelector('.recommendations-carousel');
    
    // Mostrar skeleton durante o carregamento
    showSkeleton(section, skeleton, carousel);
    try {
        const allProducts = await fetchAllProducts();
        const candidates = getRecommendedCandidates(allProducts);
        const limited = limitRecommendationsByCategory(candidates);
        const cards = buildRecommendationCards(limited);
        const signature = computeRecommendationsSignature(limited);
        
        // Se não mudou, só garante UI e retorna
        if (signature === lastRecommendationsSignature) {
            if (cards.length > 0 && carousel) {
                showCarousel(section, skeleton, carousel);
                bindRecommendationCarousel();
            } else {
                hideRecommendations(section, skeleton);
            }
            return;
        }
        lastRecommendationsSignature = signature;
        
        renderCards(track, cards);
        
        if (cards.length > 0) {
            showCarousel(section, skeleton, carousel);
            bindRecommendationCarousel();
        } else {
            hideRecommendations(section, skeleton);
            lastRecommendationsSignature = '';
        }
    } catch (error) {
        console.error('Erro ao renderizar recomendações:', error);
        hideRecommendations(section, skeleton);
        lastRecommendationsSignature = '';
    }
}

function bindRecommendationCarousel() {
    const track = document.getElementById('recommendations-track');
    const prevBtn = document.getElementById('recommendations-prev');
    const nextBtn = document.getElementById('recommendations-next');
    if (!track || !prevBtn || !nextBtn) return;
    
    if (prevBtn.dataset.bound === 'true' && nextBtn.dataset.bound === 'true') {
        return; // já vinculados
    }
    
    const getScrollAmount = () => Math.max(160, Math.floor(track.clientWidth * 0.8));
    
    prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });
    
    nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });
    
    prevBtn.dataset.bound = 'true';
    nextBtn.dataset.bound = 'true';
}
