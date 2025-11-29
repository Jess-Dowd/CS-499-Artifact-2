var express = require('express');
var router = express.Router();
const travelCtrl = require('../controllers/travel');

/* Route for server-rendered travel page
 * Calls travelList() to load trips and render Handlebars view.
 */
router.get('/travel', travelCtrl.travelList);

module.exports = router;
