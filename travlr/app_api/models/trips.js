// app_api/models/trips.js
const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  name:   { type: String, required: true, trim: true },
  code:   { type: String, required: true, unique: true, trim: true },

  
  image:  { type: String },    
  desc1:  { type: String },
  desc2:  { type: String },
  price:  { type: Number, min: 0 },
  start:  { type: Date },

  
  resort:     { type: String },
  length:     { type: String },
  perPerson:  { type: Number },
  description:{ type: String }
}, { timestamps: false });

module.exports = mongoose.model('Trip', tripSchema, 'trips');
