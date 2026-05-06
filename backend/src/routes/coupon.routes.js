const express = require('express');
const couponController = require('../controllers/coupon.controller');

const router = express.Router();

router.post('/validate', couponController.validateCoupon);

module.exports = router;
