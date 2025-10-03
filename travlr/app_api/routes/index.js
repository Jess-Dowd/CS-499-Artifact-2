// app_api/routes/index.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/trips');

router.get('/trips', ctrl.listTrips);
router.get('/trips/:tripCode', ctrl.readTrip);

module.exports = router;
