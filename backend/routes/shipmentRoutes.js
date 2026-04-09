const express = require('express');
const router = express.Router();
const { createShipment, getShipments, trackShipment, updateShipment } = require('../controllers/shipmentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createShipment).get(protect, getShipments);
router.route('/track/:id').get(trackShipment);
router.route('/:id').put(protect, admin, updateShipment);

module.exports = router;
