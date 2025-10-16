var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// use routes from app_server
var indexRouter  = require('./app_server/routes/index');
var travelRouter = require('./app_server/routes/travel');
var usersRouter = require('./app_server/routes/users');
require('./app_api/models/db');                       // connects to Mongo + loads models
var apiRouter = require('./app_api/routes/index');    // API routes
const cors = require('cors');

var app = express();

// view engine setup
// views now live in app_server/views
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

// register Handlebars partials
const hbs = require('hbs');
hbs.registerPartials(path.join(__dirname, 'app_server', 'views', 'partials'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

//enable CORS
app.use('/api', cors({ origin: 'http://localhost:4200' }));

// Check if ok
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/', indexRouter);
app.use('/', travelRouter);
app.use('/', usersRouter);
app.use('/api', apiRouter);  

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
