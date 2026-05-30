let currentProduct = null;

async function loadProductDetail() {
    const productId = parseInt(getURLParam('id'));

    if (!Number.isInteger(productId) || productId <= 0) {
        showProductNotFound();
        return;
    }

    currentProduct = await ProductService.fetchProductById(productId);

    if (currentProduct) {
        displayProduct(currentProduct);
    } else {
        showProductNotFound();
    }
}

function showProductNotFound() {
    const title = document.querySelector('.product-title');
    if (title) title.textContent = 'Produto não encontrado';
    const description = document.querySelector('.product-description');
    if (description) description.textContent = 'O produto solicitado não está disponível.';
    const addBtn = document.getElementById('add-to-cart-btn');
    const buyBtn = document.getElementById('buy-now-btn');
    if (addBtn) addBtn.disabled = true;
    if (buyBtn) buyBtn.disabled = true;
}

function displayProduct(product) {
    const discount = getProductDiscount(product);
    document.querySelector('.product-title').textContent = product.name;
    document.querySelector('.main-image').src = product.image;
    document.querySelector('.main-image').alt = product.name;
    document.querySelector('.rating-count').textContent = `(${product.ratingCount})`;
    document.querySelector('.price-value-old').textContent = `R$${product.oldPrice.toFixed(2)}`;
    document.querySelector('.price-value').textContent = product.price.toFixed(2);
    document.querySelector('.product-description').textContent = product.description;
    document.querySelector('.discount-tag').textContent = `-${discount}% OFF`;
    
    document.querySelectorAll('.thumbnail img').forEach(img => {
        img.src = product.image;
        img.alt = product.name;
    });
    
    updateBreadcrumb(product);
}

const quantityInput = document.getElementById('quantity-input');
const decreaseBtn = document.getElementById('decrease-btn');
const increaseBtn = document.getElementById('increase-btn');
const addToCartBtn = document.getElementById('add-to-cart-btn');
const buyNowBtn = document.getElementById('buy-now-btn');

decreaseBtn.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
});

increaseBtn.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue < 99) {
        quantityInput.value = currentValue + 1;
    }
});

async function addCurrentToCart() {
    const quantity = parseInt(quantityInput.value);
    try {
        await CartService.addItem(currentProduct.id, quantity);
        return true;
    } catch (error) {
        alert(error.message || 'Erro ao adicionar ao carrinho');
        return false;
    }
}

addToCartBtn.addEventListener('click', async () => {
    if (!currentProduct) return;
    addToCartBtn.disabled = true;
    const ok = await addCurrentToCart();
    addToCartBtn.disabled = false;
    if (ok) alert('Produto adicionado ao carrinho!');
});

buyNowBtn.addEventListener('click', async () => {
    if (!currentProduct) return;
    buyNowBtn.disabled = true;
    const ok = await addCurrentToCart();
    if (ok) {
        window.location.href = 'cart.html';
    } else {
        buyNowBtn.disabled = false;
    }
});

document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
        document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.indicator').forEach(i => i.classList.remove('active'));
        
        thumb.classList.add('active');
        document.querySelectorAll('.indicator')[index].classList.add('active');
        
        document.getElementById('main-image').src = thumb.querySelector('img').src;
    });
});

function updateBreadcrumb(product) {
    const breadcrumbCategoryLink = document.querySelector('[data-breadcrumb="category-link"]');
    const breadcrumbCurrent = document.querySelector('[data-breadcrumb="current"]');
    
    if (breadcrumbCategoryLink) {
        breadcrumbCategoryLink.textContent = product.category;
        breadcrumbCategoryLink.href = `product-list.html?category=${encodeURIComponent(product.category)}`;
    }
    
    if (breadcrumbCurrent) {
        breadcrumbCurrent.textContent = product.name;
    }
}

loadProductDetail();
