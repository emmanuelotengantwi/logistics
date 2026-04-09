const express = require('express');
const router = express.Router();
const { initializePayment, confirmPayment, getMyPayments } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/checkout', protect, initializePayment);
router.post('/confirm', protect, confirmPayment);
router.get('/', protect, getMyPayments);

module.exports = router;
