// app_api/models/db.js
const mongoose = require('mongoose');

// Connection string for local or environment-based DB
const dbURI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/travlr';

// Connect to MongoDB
mongoose.connect(dbURI).catch(err => {
  console.error('Mongoose initial connection error:', err.message);
});

// Basic connection event logging
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to', dbURI);
});

mongoose.connection.on('error', err => {
  console.error('Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Graceful shutdown for Ctrl+C or server shutdown
const gracefulShutdown = (msg) => {
  mongoose.connection.close(() => {
    console.log(`Mongoose disconnected through ${msg}`);
    process.exit(0);
  });
};

process.once('SIGINT', () => gracefulShutdown('app termination'));
process.once('SIGTERM', () => gracefulShutdown('Heroku/Render shutdown'));

// Load models so Mongoose registers schemas
require('./trips');
