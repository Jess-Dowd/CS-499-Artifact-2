// app_api/routes/index.js
// const express = require('express');
// const router = express.Router();
// const ctrl = require('../controllers/trips');

// router.get('/trips', ctrl.listTrips);
// router.get('/trips/:tripCode', ctrl.readTrip);
// router.post('/trips', ctrl.createTrip);
// router.put('/trips/:tripCode', ctrl.tripsUpdateTrip);


// module.exports = router;


// app_api/routes/index.js
const express = require('express');
const router = express.Router();
const ctrlTrips = require('../controllers/trips');
const authController = require('../controllers/authentication');
const jwt = require('jsonwebtoken'); // for middleware
// const tripsController = require('../controllers/trips');

// --- JWT auth middleware
function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);
  const parts = authHeader.split(' ');
  if (parts.length < 2) return res.sendStatus(401);
  const token = parts[1];
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = verified;
    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Token invalid/expired' });
  }
}

// trips (public reads)
router.get('/trips', ctrlTrips.listTrips);
router.get('/trips/:tripCode', ctrlTrips.readTrip);

// protect writes
// router.post('/trips', ctrl.createTrip);
// router.put('/trips/:tripCode', ctrl.tripsUpdateTrip);
router.post('/trips', authenticateJWT, ctrlTrips.createTrip);
router.put('/trips/:tripCode', authenticateJWT, ctrlTrips.tripsUpdateTrip);
// (optional) delete
// router.delete('/trips/:tripCode', authenticateJWT, ctrlTrips.deleteTrip);

// auth
router.post('/register', authController.register);
router.post('/login', authController.login);

router
  .route('/trips/:tripCode')
  .get(ctrlTrips.readTrip)
  .put(authenticateJWT, ctrlTrips.tripsUpdateTrip);

module.exports = router;