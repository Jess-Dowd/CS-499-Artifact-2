var express = require('express');
var router = express.Router();
const travelCtrl = require('../controllers/travel');

router.get('/travel', travelCtrl.travelList);

// /* GET home page. */
// router.get('/', ctrlMain.index); // root to controller
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports = router;
