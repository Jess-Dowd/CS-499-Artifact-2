var express = require('express');
var router = express.Router();
const ctrlTravel = require('../controllers/travel');

router.get('/travel', ctrlTravel.travel); // /travel → controller

module.exports = router;
