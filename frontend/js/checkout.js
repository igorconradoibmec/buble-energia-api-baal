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

function handleSubmit(event) {
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

    const order = OrderService.createOrder({
        paymentMethod: paymentSelection.value,
        shipping: SHIPPING_COST,
        pixDiscount: PIX_DISCOUNT
    });

    if (!order) {
        alert('Seu carrinho está vazio.');
        return;
    }

    CartService.clearCart();
    window.location.href = 'confirmation.html';
}

function loadCheckoutItems() {
    if (typeof CartService === 'undefined') {
        return;
    }

    const cart = CartService.getCart();

    if (!cart || cart.length === 0) {
        window.location.href = 'cart.html';
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
