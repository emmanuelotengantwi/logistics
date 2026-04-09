const Payment = require('../models/Payment');
const Shipment = require('../models/Shipment');

// @desc    Initialize a mock payment
// @route   POST /api/payments/checkout
// @access  Private
const initializePayment = async (req, res) => {
    try {
        const { shipmentId, amount } = req.body;
        
        // Mocking Stripe/Paystack init
        const reference = 'TXN-' + Math.floor(Math.random() * 1000000000);
        
        const payment = await Payment.create({
            user: req.user._id,
            shipment: shipmentId,
            amount,
            status: 'Pending',
            reference
        });

        // Normally we return a payment URL or client secret here
        res.status(200).json({
            message: 'Payment initialized',
            paymentId: payment._id,
            reference,
            mockCheckoutUrl: `/checkout/mock/${payment._id}`
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Confirm mock payment
// @route   POST /api/payments/confirm
// @access  Private
const confirmPayment = async (req, res) => {
    try {
        const { paymentId } = req.body;
        const payment = await Payment.findById(paymentId);
        
        if (payment) {
            payment.status = 'Completed';
            await payment.save();
            res.json({ message: 'Payment successful', payment });
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.user._id }).populate('shipment');
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { initializePayment, confirmPayment, getMyPayments };
