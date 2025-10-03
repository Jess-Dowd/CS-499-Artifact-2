// app_api/models/db.js
const mongoose = require('mongoose');

const dbURI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/travlr';

mongoose.connect(dbURI, {
}).catch(err => {
  console.error('Mongoose initial connection error:', err.message);
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to', dbURI);
});
mongoose.connection.on('error', err => {
  console.error('Mongoose connection error:', err.message);
});
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// graceful shutdown
const gracefulShutdown = (msg) => {
  mongoose.connection.close(() => {
    console.log(`Mongoose disconnected through ${msg}`);
    process.exit(0);
  });
};

process.once('SIGINT',  () => gracefulShutdown('app termination'));    // ctrl+c
process.once('SIGTERM', () => gracefulShutdown('Heroku/Render shutdown')); // prod hosts

// bring in models so they register with mongoose
require('./trips');
