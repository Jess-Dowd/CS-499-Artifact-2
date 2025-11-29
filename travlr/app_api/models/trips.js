const mongoose = require('mongoose');

/* Trip schema
 * Defines how trip documents are stored in MongoDB.
 * Angular uses these fields when displaying trip cards and details.
 */
const tripSchema = new mongoose.Schema({

  code: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },

  // Main trip info
  length: { type: String },
  start: { type: Date },
  resort: { type: String },
  perPerson: { type: Number, min: 0 },
  image: { type: String },
  description: { type: String },

  // Older fields kept for compatibility with earlier CS-465 data
  desc1: { type: String },
  desc2: { type: String },
  price: { type: Number, min: 0 }

}, { timestamps: false });

module.exports = mongoose.model('Trip', tripSchema, 'trips');
