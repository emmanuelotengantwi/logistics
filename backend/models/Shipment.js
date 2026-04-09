const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    description: String,
    length: Number, // cm
    width: Number,  // cm
    height: Number, // cm
    weight: Number, // kg
    cbm: Number,
});

const shipmentSchema = new mongoose.Schema({
    trackingID: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    type: {
        type: String,
        enum: ['Air', 'Sea'],
        required: true,
    },
    status: {
        type: String,
        enum: [
            'Pending',
            'Received at Warehouse',
            'Processing',
            'In Transit',
            'Arrived at Port',
            'Cleared',
            'Ready for Pickup',
            'Delivered'
        ],
        default: 'Pending',
    },
    origin: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    ETA: {
        type: Date,
    },
    totalCBM: {
        type: Number,
        default: 0,
    },
    totalWeight: {
        type: Number,
        default: 0,
    },
    cost: {
        type: Number,
        default: 0,
    },
    container: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Container',
    },
    items: [itemSchema]
}, { timestamps: true });

const Shipment = mongoose.model('Shipment', shipmentSchema);
module.exports = Shipment;
