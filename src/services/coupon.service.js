const couponRepository = require('../repositories/coupon.repository');

function validateCoupon(code) {
    if (!code || typeof code !== 'string' || !code.trim()) {
        return { valid: false, message: 'Codigo do cupom obrigatorio' };
    }
    const coupon = couponRepository.findByCode(code);
    if (!coupon) {
        return { valid: false, code: code.trim().toUpperCase(), message: 'Cupom nao encontrado' };
    }
    return {
        valid: true,
        code: coupon.code,
        discountPercentage: coupon.discount,
        message: `Cupom aplicado com sucesso! Desconto de ${coupon.discount * 100}%`,
    };
}

module.exports = { validateCoupon };
