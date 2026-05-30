/**
 * Renderiza e opera o carrinho consumindo /api/v1/cart*.
 *
 * IMPORTANTE (id duplo):
 *   - item.id        -> id da linha em cart_items, usado para PUT/DELETE /cart/items/:id
 *   - item.productId -> id do produto, usado para o link product-detail.html?id= e recomendacoes
 */

let currentCart = { items: [], itemCount: 0, total: 0 };
let lastRecommendationsSignature = '';

async function loadCart() {
    const cartItemsContainer = document.querySelector('.cart-items');

    try {
        currentCart = await CartService.getCart();
    } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '<p style="text-align:center;padding:40px;">Erro ao carregar o carrinho.</p>';
        }
        return;
    }

    renderCart();
}

function renderCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    if (!cartItemsContainer) return;

    const items = currentCart.items || [];

    if (items.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 40px;">Seu carrinho está vazio</p>';
        updateSubtotal();
        renderRecommendations();
        return;
    }

    cartItemsContainer.innerHTML = '';
    items.forEach(item => cartItemsContainer.appendChild(createCartItem(item)));
    updateSubtotal();
    renderRecommendations();
}

function createCartItem(item) {
    const article = document.createElement('article');
    article.className = 'cart-item';
    article.dataset.id = item.id;
    article.dataset.productId = item.productId;

    article.innerHTML = `
        <div>
            <div class="item-image-container">
                <img src="${item.image}" alt="${item.name}" class="item-image">
            </div>

            <div class="item-details">
                <h3 class="item-title">
                    <a href="product-detail.html?id=${item.productId}" style="color:inherit;text-decoration:none;">${item.name}</a>
                </h3>

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

function findItem(itemId) {
    return (currentCart.items || []).find(i => i.id === itemId);
}

async function decreaseQuantity(itemId) {
    const item = findItem(itemId);
    if (!item) return;

    try {
        if (item.quantity <= 1) {
            currentCart = await CartService.removeItem(itemId);
            renderCart();
        } else {
            currentCart = await CartService.updateItemQuantity(itemId, item.quantity - 1);
            renderCart();
        }
    } catch (error) {
        alert(error.message || 'Erro ao atualizar quantidade');
    }
}

async function increaseQuantity(itemId) {
    const item = findItem(itemId);
    if (!item || item.quantity >= 99) return;

    try {
        currentCart = await CartService.updateItemQuantity(itemId, item.quantity + 1);
        renderCart();
    } catch (error) {
        alert(error.message || 'Erro ao atualizar quantidade');
    }
}

async function updateQuantity(itemId, newQuantity) {
    if (!Number.isInteger(newQuantity) || newQuantity < 1 || newQuantity > 99) {
        renderCart();
        return;
    }
    try {
        currentCart = await CartService.updateItemQuantity(itemId, newQuantity);
        renderCart();
    } catch (error) {
        alert(error.message || 'Erro ao atualizar quantidade');
    }
}

async function removeItem(itemId) {
    try {
        currentCart = await CartService.removeItem(itemId);
        renderCart();
    } catch (error) {
        alert(error.message || 'Erro ao remover item');
    }
}

function updateSubtotal() {
    const summarySection = document.getElementById('cart-summary-inline');
    const subtotalValue = document.getElementById('subtotal-value');
    if (!summarySection || !subtotalValue) return;

    const subtotal = Number(currentCart.total) || 0;

    if (subtotal <= 0) {
        summarySection.hidden = true;
    } else {
        summarySection.hidden = false;
        subtotalValue.textContent = `R$ ${subtotal.toFixed(2)}`;
    }
}

const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if ((currentCart.items || []).length > 0) {
            window.location.href = 'checkout.html';
        } else {
            alert('Seu carrinho está vazio!');
        }
    });
}

loadCart();

/* ====== Recomendacoes (US-32 substitui pelo endpoint /products/recommendations) ====== */

function getCartProductIds() {
    return (currentCart.items || []).map(item => item.productId);
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

async function fetchRecommendations(productIds) {
    if (!Array.isArray(productIds) || productIds.length === 0) return [];
    try {
        const data = await Api.get('/products/recommendations', {
            query: { cartItemIds: productIds.join(',') },
        });
        return Array.isArray(data.recommendations) ? data.recommendations : [];
    } catch (error) {
        console.error('Erro ao buscar recomendacoes:', error);
        return [];
    }
}

async function renderRecommendations() {
    const section = document.getElementById('cart-recommendations');
    const track = document.getElementById('recommendations-track');
    if (!section || !track) return;
    const skeleton = document.getElementById('recommendations-skeleton');
    const carousel = section.querySelector('.recommendations-carousel');

    const productIds = getCartProductIds();
    if (productIds.length === 0) {
        hideRecommendations(section, skeleton);
        lastRecommendationsSignature = '';
        return;
    }

    showSkeleton(section, skeleton, carousel);
    try {
        const recommendations = await fetchRecommendations(productIds);
        const cards = buildRecommendationCards(recommendations);
        const signature = computeRecommendationsSignature(recommendations);

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
        console.error('Erro ao renderizar recomendacoes:', error);
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
        return;
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
