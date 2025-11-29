var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Server-side (Handlebars) routes
var indexRouter  = require('./app_server/routes/index');
var travelRouter = require('./app_server/routes/travel');
var usersRouter  = require('./app_server/routes/users');

// Connects to MongoDB + loads models
require('./app_api/models/db');

// API routes (Express controllers for MEAN backend)
var apiRouter = require('./app_api/routes/index');

const cors = require('cors');
require('dotenv').config();

var passport = require('passport');
// Enhancement 2:
// Loads the LocalStrategy + password/auth setup for JWT + RBAC
require('./app_api/config/passport');

var app = express();

/* View engine setup
 * Uses Handlebars for the server-rendered pages (CS-465 part of the project).
 * The Angular SPA is separate, running on port 4200.
 */
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

// Load Handlebars partials
const hbs = require('hbs');
hbs.registerPartials(path.join(__dirname, 'app_server', 'views', 'partials'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static public assets (images, CSS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

/* Enable CORS
 * Allows the Angular SPA (localhost:4200) to call this backend (localhost:3000).
 * Required for all front-end/backend communication.
 */
app.use('/api', cors({ origin: 'http://localhost:4200' }));

// Allow basic HTTP verbs
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

/* Health check endpoint
 * Useful during debugging. Confirms server is running.
 */
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Register server-side routes (Handlebars pages)
app.use('/', indexRouter);
app.use('/', travelRouter);
app.use('/', usersRouter);

// Register API routes (used by Angular)
app.use('/api', apiRouter);

/* 404 handler
 * For requests that don’t match any route.
 */
app.use(function(req, res, next) {
  next(createError(404));
});

/* Error handler
 * Renders Handlebars error page for app_server.
 */
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

/* CORS headers for all routes
 * Explicitly allows auth headers for JWT.
 */
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Static assets (duplicate but harmless)
app.use(express.static(path.join(__dirname, 'public')));

// Enhancement 2:
// Initialize passport for login + JWT validation.
app.use(passport.initialize());

/* JWT unauthorized error handler
 * If the token is invalid/expired, send 401.
 */
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: err.name + ': ' + err.message });
  }
  next(err);
});

module.exports = app;
