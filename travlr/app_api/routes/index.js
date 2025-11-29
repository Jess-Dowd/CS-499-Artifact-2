// app_api/routes/index.js
const express = require('express');
const router = express.Router();

const ctrlTrips = require('../controllers/trips');
const authController = require('../controllers/authentication');
const jwt = require('jsonwebtoken');
const ctrlUsers = require('../controllers/users');

// JWT authentication middleware  (Enhancement 2)
// Extracts and verifies the JWT, then attaches the decoded payload
// to req.auth for use in permission checks.
// - Used by any protected route (trips writes, admin users, etc.)
// ---------------------------------------------------------------
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

// Role-based access check  (Enhancement 2)
// Blocks requests unless the user's JWT contains the required role.
// - Used for admin-only routes (trip writes, user management)
// ---------------------------------------------------------------
function requireRole(role) {
  return function (req, res, next) {
    if (!req.auth || !req.auth.role) {
      return res.status(403).json({ message: 'No role in token' });
    }
    if (req.auth.role !== role) {
      return res.status(403).json({ message: 'Forbidden: role ' + req.auth.role + ' cannot do this' });
    }
    next();
  };
}

// Trip routes  (Enhancement 2 protects writes)
// Public: read-only (GET)
// Admin only: create/update (POST, PUT) when JWT + role = admin
// ---------------------------------------------------------------
router.get('/trips', ctrlTrips.listTrips);
router.get('/trips/:tripCode', ctrlTrips.readTrip);

router.post('/trips', authenticateJWT, requireRole('admin'), ctrlTrips.createTrip);
router.put('/trips/:tripCode', authenticateJWT, requireRole('admin'), ctrlTrips.tripsUpdateTrip);

// (optional) delete trip route
// router.delete('/trips/:tripCode', authenticateJWT, ctrlTrips.deleteTrip);

// Auth routes
// Handles user registration + login (returns JWT used above)
// ---------------------------------------------------------------
router.post('/register', authController.register);
router.post('/login', authController.login);

// ADMIN-ONLY USER MANAGEMENT  (Enhancement 3)
// These routes were added to support the new admin user directory page.
// - GET lists all users
// - PUT updates allowed fields
// Both require a valid JWT and admin role.
// ---------------------------------------------------------------
router.get('/users', authenticateJWT, requireRole('admin'), ctrlUsers.listUsers);
router.put('/users/:userId', authenticateJWT, requireRole('admin'), ctrlUsers.updateUser);

module.exports = router;
