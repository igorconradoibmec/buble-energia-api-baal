const crypto = require('crypto');
const orderRepository = require('../repositories/order.repository');
const couponRepository = require('../repositories/coupon.repository');

const ACCEPTED_PAYMENTS = ['credit-card', 'pix', 'boleto'];
const PIX_DISCOUNT = 0.10;

function validateBody(body) {
    if (!body || typeof body !== 'object') return 'Body invalido';
    if (!Array.isArray(body.items) || body.items.length === 0) return 'Items obrigatorio';
    for (const it of body.items) {
        if (!Number.isInteger(it.id) || it.id <= 0) return 'Item com id invalido';
        if (!Number.isInteger(it.quantity) || it.quantity < 1) return 'Item com quantidade invalida';
        if (typeof it.price !== 'number' || it.price < 0) return 'Item com preco invalido';
    }
    if (!ACCEPTED_PAYMENTS.includes(body.paymentMethod)) return 'Metodo de pagamento invalido';
    if (typeof body.shipping !== 'number' || body.shipping < 0) return 'Frete invalido';
    if (!body.customer || !body.billingAddress || !body.deliveryAddress) {
        return 'Dados de cliente e enderecos sao obrigatorios';
    }
    return null;
}

function formatOrderCode(items, date) {
    const pad = (n) => String(n).padStart(2, '0');
    const stamp = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
    const first = items[0];
    return `PD-${stamp}-${first.id}x${first.quantity}`;
}

function createOrder(userId, body) {
    const error = validateBody(body);
    if (error) return { error };

    let couponDiscount = 0;
    if (body.couponCode) {
        const coupon = couponRepository.findByCode(body.couponCode);
        if (!coupon) return { error: 'Cupom invalido' };
        couponDiscount = coupon.discount;
    }

    const pixDiscount = body.paymentMethod === 'pix' ? PIX_DISCOUNT : 0;
    const subtotal = body.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const totalDiscount = subtotal * (couponDiscount + pixDiscount);
    const total = subtotal + body.shipping;
    const finalAmount = subtotal - totalDiscount + body.shipping;

    const createdAt = new Date();
    const order = {
        id: `ord-${crypto.randomBytes(4).toString('hex')}`,
        orderCode: formatOrderCode(body.items, createdAt),
        customerId: userId,
        items: body.items,
        paymentMethod: body.paymentMethod,
        customer: body.customer,
        billingAddress: body.billingAddress,
        deliveryAddress: body.deliveryAddress,
        couponCode: body.couponCode || null,
        subtotal: Number(subtotal.toFixed(2)),
        shipping: Number(body.shipping.toFixed(2)),
        couponDiscount,
        pixDiscount,
        total: Number(total.toFixed(2)),
        finalAmount: Number(finalAmount.toFixed(2)),
        createdAt: createdAt.toISOString(),
    };

    orderRepository.insert(order);
    return { order };
}

module.exports = { createOrder };
