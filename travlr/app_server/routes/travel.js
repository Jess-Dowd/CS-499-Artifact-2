// app_server/routes/travel.js
const express = require('express');
const router = express.Router();

// Import controller method
const { travelList } = require('../controllers/travel');

/* Route for the Travel page
 * Renders Handlebars view by calling travelList().
 */
router.get('/travel', travelList);

module.exports = router;
