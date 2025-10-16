// app_api/routes/index.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/trips');

router.get('/trips', ctrl.listTrips);
router.get('/trips/:tripCode', ctrl.readTrip);
router.post('/trips', ctrl.createTrip);
router.put('/trips/:tripCode', ctrl.tripsUpdateTrip);


module.exports = router;
