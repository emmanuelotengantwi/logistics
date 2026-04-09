const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    shipment: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Shipment',
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending',
    },
    reference: {
        type: String, 
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
