// app_api/models/trips.js
const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  image: { type: String },                              
  desc1: { type: String },
  desc2: { type: String },
  code: { type: String, required: true, unique: true, trim: true },

  // optional extras for later
  
  length: { type: String },
  price:  { type: Number, min: 0 },
  start:  { type: Date }
}, { timestamps: false });

module.exports = mongoose.model('Trip', tripSchema, 'trips');
