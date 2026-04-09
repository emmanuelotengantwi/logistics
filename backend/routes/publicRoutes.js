const express = require('express');
const router = express.Router();
const { getRegistrations } = require('../controllers/publicController');

router.get('/registrations', getRegistrations);

module.exports = router;

