const mongoose = require('mongoose');

const containerSchema = new mongoose.Schema({
    containerNumber: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        enum: ['20ft', '40ft', 'Flight'], // Air cargo can just use 'Flight' for abstraction
        required: true,
    },
    departureDate: {
        type: Date,
    },
    arrivalDate: {
        type: Date,
    }
}, { timestamps: true });

const Container = mongoose.model('Container', containerSchema);
module.exports = Container;
