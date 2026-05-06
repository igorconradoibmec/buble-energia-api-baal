let currentProduct = null;

async function loadProductDetail() {
    const productId = parseInt(getURLParam('id'));
    
    try {
        const products = await ProductService.fetchProducts();
        currentProduct = products.find(p => p.id === productId);
        
        if (currentProduct) {
            displayProduct(currentProduct);
        }
    } catch (error) {
        console.error('Erro ao carregar produto:', error);
    }
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

addToCartBtn.addEventListener('click', () => {
    if (currentProduct) {
        CartService.addItem(currentProduct, parseInt(quantityInput.value));
        alert('Produto adicionado ao carrinho!');
    }
});

buyNowBtn.addEventListener('click', () => {
    if (currentProduct) {
        CartService.addItem(currentProduct, parseInt(quantityInput.value));
        window.location.href = 'cart.html';
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
