const express = require('express');
const router = express.Router();
const { createContainer, getContainers } = require('../controllers/containerController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, admin, createContainer).get(protect, admin, getContainers);

module.exports = router;
