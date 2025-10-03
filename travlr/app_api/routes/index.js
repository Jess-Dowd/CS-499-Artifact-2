// app_api/routes/index.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/trips');

router.get('/trips',      ctrl.listTrips);     // GET /api/trips
router.get('/trips/:code', ctrl.readTrip);     // GET /api/trips/SEA001

module.exports = router;
