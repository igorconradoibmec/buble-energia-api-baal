let products = [];
let editingId = null;

const form = document.getElementById('product-form');
const cancelBtn = document.getElementById('cancel-btn');
const productsList = document.getElementById('products-list');
const imageInput = document.getElementById('product-image');
const imagePreview = document.getElementById('image-preview');
const previewImg = document.getElementById('preview-img');
const priceInput = document.getElementById('product-price');
const oldPriceInput = document.getElementById('product-old-price');
const discountInput = document.getElementById('product-discount');

function calculateDiscount(price, oldPrice) {
    const currentPrice = parseFloat(price);
    const previousPrice = parseFloat(oldPrice);
    if (isNaN(currentPrice) || isNaN(previousPrice) || previousPrice <= 0) {
        return 0;
    }
    const discount = Math.round(((previousPrice - currentPrice) / previousPrice) * 100);
    return Math.max(0, discount);
}

function updateDiscountField() {
    const discount = calculateDiscount(priceInput.value, oldPriceInput.value);
    discountInput.value = discount;
}

async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const data = await response.json();
        products = data.map(product => ({
            ...product,
            discount: calculateDiscount(product.price, product.oldPrice)
        }));
        displayProducts();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        alert('Erro ao carregar produtos. Certifique-se de que o servidor está rodando.');
    }
}

function displayProducts() {
    productsList.innerHTML = '';
    
    products.forEach(product => {
        const discount = calculateDiscount(product.price, product.oldPrice);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>R$ ${product.price.toFixed(2)}</td>
            <td>${discount}%</td>
            <td>
                <div class="action-btns">
                    <button class="btn-small btn-edit" onclick="editProduct(${product.id})">Editar</button>
                    <button class="btn-small btn-delete" onclick="deleteProduct(${product.id})">Excluir</button>
                </div>
            </td>
        `;
        productsList.appendChild(row);
    });
}

let currentImagePath = '';

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    editingId = id;
    currentImagePath = product.image;
    
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-category').value = product.category;
    priceInput.value = product.price;
    oldPriceInput.value = product.oldPrice;
    discountInput.value = calculateDiscount(product.price, product.oldPrice);
    document.getElementById('product-rating').value = product.rating;
    document.getElementById('product-rating-count').value = product.ratingCount;
    
    const currentImageEl = document.getElementById('current-image');
    currentImageEl.textContent = `Imagem atual: ${product.image}`;
    currentImageEl.style.display = 'block';
    
    previewImg.src = '../' + product.image;
    imagePreview.style.display = 'block';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteProduct(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    products = products.filter(p => p.id !== id);
    await saveProducts();
    displayProducts();
}

function clearForm() {
    form.reset();
    editingId = null;
    currentImagePath = '';
    document.getElementById('product-id').value = '';
    document.getElementById('current-image').style.display = 'none';
    imagePreview.style.display = 'none';
    previewImg.src = '';
    updateDiscountField();
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let imagePath = currentImagePath;
    const imageFile = document.getElementById('product-image').files[0];
    
    if (imageFile) {
        imagePath = await uploadImage(imageFile);
        if (!imagePath) {
            alert('Erro ao fazer upload da imagem');
            return;
        }
    }
    
    if (!imagePath && !editingId) {
        alert('Por favor, selecione uma imagem para o produto');
        return;
    }
    
    const price = parseFloat(priceInput.value);
    const oldPrice = parseFloat(oldPriceInput.value);
    const discount = calculateDiscount(price, oldPrice);
    discountInput.value = discount;
    
    const productData = {
        id: editingId || Date.now(),
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        category: document.getElementById('product-category').value,
        price,
        oldPrice,
        discount,
        rating: parseFloat(document.getElementById('product-rating').value),
        ratingCount: parseInt(document.getElementById('product-rating-count').value),
        image: imagePath
    };
    
    if (editingId) {
        const index = products.findIndex(p => p.id === editingId);
        if (index !== -1) {
            products[index] = productData;
        }
    } else {
        products.push(productData);
    }
    
    await saveProducts();
    displayProducts();
    clearForm();
});

cancelBtn.addEventListener('click', clearForm);
priceInput.addEventListener('input', updateDiscountField);
oldPriceInput.addEventListener('input', updateDiscountField);
updateDiscountField();

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = (event) => {
            previewImg.src = event.target.result;
            imagePreview.style.display = 'block';
        };
        
        reader.readAsDataURL(file);
    } else {
        imagePreview.style.display = 'none';
        previewImg.src = '';
    }
});

async function uploadImage(file) {
    try {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            return result.path;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        return null;
    }
}

async function saveProducts() {
    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(products)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Produtos salvos com sucesso!');
        } else {
            alert('Erro ao salvar produtos.');
        }
    } catch (error) {
        console.error('Erro ao salvar produtos:', error);
        alert('Erro ao salvar produtos. Certifique-se de que o servidor está rodando.');
    }
}

loadProducts();
