// app_api/models/trips.js
const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  image: { type: String },                              
  desc1: { type: String },
  desc2: { type: String },

  // optional extras for later
  code:   { type: String, trim: true, unique: false },
  length: { type: String },
  price:  { type: Number, min: 0 },
  start:  { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema, 'trips');
