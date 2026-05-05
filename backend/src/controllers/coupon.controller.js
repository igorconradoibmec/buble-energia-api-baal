const couponService = require('../services/coupon.service');

function validateCoupon(req, res) {
    const { code } = req.body;
    const result = couponService.validateCoupon(code);
    res.status(200).json(result);
}

module.exports = { validateCoupon };
