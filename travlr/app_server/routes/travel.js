// app_server/routes/travel.js
const express = require('express');
const router = express.Router();

// ✅ Destructure to avoid “undefined” property lookups
const { travelList } = require('../controllers/travel');

// ✅ Pass the function, do NOT call it here
router.get('/travel', travelList);

module.exports = router;