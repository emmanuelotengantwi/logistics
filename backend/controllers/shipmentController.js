const Shipment = require('../models/Shipment');

const generateTrackingID = () => {
    return 'TRK-' + Math.floor(10000000 + Math.random() * 90000000).toString();
};

const RATE_PER_CBM = 150; // Mock rate
const MIN_CHARGE = 50;

const createShipment = async (req, res) => {
    try {
        const { type, origin, destination, items } = req.body;
        
        let totalCBM = 0;
        let totalWeight = 0;
        
        const processedItems = items.map(item => {
            const itemCBM = (item.length * item.width * item.height) / 1000000;
            totalCBM += itemCBM;
            totalWeight += item.weight;
            return { ...item, cbm: itemCBM };
        });

        let calculatedCost = totalCBM * RATE_PER_CBM;
        if (calculatedCost < MIN_CHARGE) calculatedCost = MIN_CHARGE;

        const shipment = new Shipment({
            trackingID: generateTrackingID(),
            user: req.user._id,
            type,
            origin,
            destination,
            items: processedItems,
            totalCBM,
            totalWeight,
            cost: calculatedCost
        });

        const createdShipment = await shipment.save();
        res.status(201).json(createdShipment);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getShipments = async (req, res) => {
    try {
        const query = req.user.role === 'Admin' ? {} : { user: req.user._id };
        const shipments = await Shipment.find(query).populate('container', 'containerNumber');
        res.json(shipments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const trackShipment = async (req, res) => {
    try {
        const shipment = await Shipment.findOne({ trackingID: req.params.id }).select('-cost');
        if (shipment) {
            res.json(shipment);
        } else {
            res.status(404).json({ message: 'Shipment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateShipment = async (req, res) => {
    try {
        const { status, container } = req.body;
        const shipment = await Shipment.findById(req.params.id);

        if (shipment) {
            if (status) shipment.status = status;
            if (container) shipment.container = container;

            const updatedShipment = await shipment.save();
            res.json(updatedShipment);
        } else {
            res.status(404).json({ message: 'Shipment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createShipment, getShipments, trackShipment, updateShipment };
