const SHIPPING_COST = 15.00;
const PIX_DISCOUNT = 0.10;
let checkoutForm;

document.addEventListener('DOMContentLoaded', () => {
    checkoutForm = document.getElementById('checkout-form');

    if (!checkoutForm) {
        return;
    }

    initPaymentMethodToggle();
    checkoutForm.addEventListener('submit', handleSubmit);
    loadCheckoutItems();
    applyMasks();
});

function initPaymentMethodToggle() {
    const paymentMethods = checkoutForm.querySelectorAll('input[name="payment-method"]');
    const cardFields = document.getElementById('card-fields');
    const pixFields = document.getElementById('pix-fields');
    const boletoFields = document.getElementById('boleto-fields');

    if (!paymentMethods.length || !cardFields || !pixFields || !boletoFields) {
        return;
    }

    const toggleFields = (method) => {
        cardFields.style.display = 'none';
        pixFields.style.display = 'none';
        boletoFields.style.display = 'none';

        if (method === 'credit-card') {
            cardFields.style.display = 'flex';
        } else if (method === 'pix') {
            pixFields.style.display = 'flex';
        } else if (method === 'boleto') {
            boletoFields.style.display = 'flex';
        }
    };

    paymentMethods.forEach((method) => {
        method.addEventListener('change', (event) => {
            toggleFields(event.target.value);
        });
    });

    const initialMethod = checkoutForm.querySelector('input[name="payment-method"]:checked')?.value || 'credit-card';
    toggleFields(initialMethod);
}

async function handleSubmit(event) {
    event.preventDefault();

    if (!checkoutForm) {
        return;
    }

    if (!validateForm()) {
        return;
    }

    const paymentSelection = checkoutForm.querySelector('input[name="payment-method"]:checked');

    if (!paymentSelection) {
        alert('Por favor, selecione um método de pagamento');
        return;
    }

    if (typeof CartService === 'undefined' || typeof OrderService === 'undefined') {
        alert('Não foi possível processar seu pedido no momento. Tente novamente.');
        return;
    }

    const submitBtn = document.getElementById('submit-order-btn');
    if (submitBtn) submitBtn.disabled = true;

    try {
        const payload = await buildOrderPayload(paymentSelection.value);

        if (!payload) {
            alert('Seu carrinho está vazio.');
            return;
        }

        // O servidor cria o pedido e calcula subtotal/descontos/finalAmount.
        await OrderService.createOrder(payload);
        await CartService.clearCart();
        window.location.href = 'confirmation.html';
    } catch (error) {
        console.error('Erro ao finalizar o pedido:', error);
        if (error.status === 401) {
            alert('Sua sessão expirou. Atualize a página e tente novamente.');
        } else {
            alert(error.message || 'Não foi possível finalizar o pedido.');
        }
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
}

// Monta o payload de POST /orders a partir do formulario, do carrinho e do cupom.
async function buildOrderPayload(paymentMethod) {
    const cart = await CartService.getCart();
    const items = (cart.items || []).map((it) => ({
        id: it.productId, // contrato: items[].id e' o productId (nao o id da linha do carrinho)
        quantity: it.quantity,
        price: it.price,
    }));

    if (!items.length) {
        return null;
    }

    const val = (id) => (document.getElementById(id)?.value || '').trim();

    const payload = {
        items,
        paymentMethod,
        shipping: SHIPPING_COST,
        customer: {
            name: val('billing-name'),
            email: val('billing-email'),
        },
        billingAddress: {
            zip: val('billing-cep'),
            street: val('billing-address'),
            number: val('billing-number'),
            city: val('billing-city'),
            state: val('billing-uf').toUpperCase(),
            complement: val('billing-complement'),
            phone: val('billing-phone'),
        },
        deliveryAddress: {
            name: val('delivery-name'),
            zip: val('delivery-cep'),
            street: val('delivery-address'),
            number: val('delivery-number'),
            city: val('delivery-city'),
            state: val('delivery-uf').toUpperCase(),
            phone: val('delivery-phone'),
            notes: val('delivery-notes'),
        },
    };

    // Cupom aplicado (US-34) — so enviar se existir, senao o backend devolve 400.
    const couponCode = localStorage.getItem('cupomCodigo');
    if (couponCode) {
        payload.couponCode = couponCode;
    }

    return payload;
}

async function loadCheckoutItems() {
    if (typeof CartService === 'undefined') {
        return;
    }

    try {
        const cart = await CartService.getCart();
        if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
            window.location.href = 'cart.html';
        }
    } catch (error) {
        console.error('Erro ao carregar o carrinho:', error);
    }
}

function validateForm() {
    if (!checkoutForm) {
        return false;
    }

    const requiredFields = checkoutForm.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = 'red';
            isValid = false;
        } else {
            field.style.borderColor = '';
        }
    });
    
    const paymentMethod = checkoutForm.querySelector('input[name="payment-method"]:checked');
    if (!paymentMethod) {
        alert('Por favor, selecione um método de pagamento');
        return false;
    }
    
    if (paymentMethod.value === 'credit-card') {
        const cardNumber = document.getElementById('card-number');
        const cardName = document.getElementById('card-name');
        const cardExpiry = document.getElementById('card-expiry');
        const cardCvv = document.getElementById('card-cvv');
        
        if (!cardNumber.value || !cardName.value || !cardExpiry.value || !cardCvv.value) {
            alert('Por favor, preencha todos os dados do cartão');
            return false;
        }
    }
    
    const billingCep = document.getElementById('billing-cep');
    if (billingCep && billingCep.value && billingCep.value.replace(/\D/g, '').length !== 8) {
        alert('CEP de cobrança inválido');
        return false;
    }
    
    const deliveryCep = document.getElementById('delivery-cep');
    if (deliveryCep && deliveryCep.value && deliveryCep.value.replace(/\D/g, '').length !== 8) {
        alert('CEP de entrega inválido');
        return false;
    }

    const billingEmail = document.getElementById('billing-email');
    if (billingEmail && billingEmail.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingEmail.value.trim())) {
        alert('E-mail inválido');
        return false;
    }

    const ufFields = [document.getElementById('billing-uf'), document.getElementById('delivery-uf')];
    for (const uf of ufFields) {
        if (uf && uf.value && !/^[A-Za-z]{2}$/.test(uf.value.trim())) {
            alert('Estado (UF) inválido — use 2 letras, ex: MG');
            return false;
        }
    }

    if (!isValid) {
        alert('Por favor, preencha todos os campos obrigatórios');
    }
    
    return isValid;
}

function applyMasks() {
    const billingCepInput = document.getElementById('billing-cep');
    const deliveryCepInput = document.getElementById('delivery-cep');
    const pixCpfInput = document.getElementById('pix-cpf');
    const cardNumberInput = document.getElementById('card-number');
    const cardExpiryInput = document.getElementById('card-expiry');
    const cardCvvInput = document.getElementById('card-cvv');
    
    const applyCepMask = (input) => {
        if (input) {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 8) value = value.slice(0, 8);
                if (value.length > 5) {
                    value = value.slice(0, 5) + '-' + value.slice(5);
                }
                e.target.value = value;
            });
        }
    };
    
    applyCepMask(billingCepInput);
    applyCepMask(deliveryCepInput);
    
    if (pixCpfInput) {
        pixCpfInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            if (value.length > 9) {
                value = value.slice(0, 3) + '.' + value.slice(3, 6) + '.' + value.slice(6, 9) + '-' + value.slice(9);
            } else if (value.length > 6) {
                value = value.slice(0, 3) + '.' + value.slice(3, 6) + '.' + value.slice(6);
            } else if (value.length > 3) {
                value = value.slice(0, 3) + '.' + value.slice(3);
            }
            e.target.value = value;
        });
    }
    
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 16) value = value.slice(0, 16);
            value = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = value;
        });
    }
    
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 4) value = value.slice(0, 4);
            if (value.length > 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
            e.target.value = value;
        });
    }
    
    if (cardCvvInput) {
        cardCvvInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 3) value = value.slice(0, 3);
            e.target.value = value;
        });
    }
}
