const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// ---------------------------------------------------------------------
// User schema
// Stores account info including password hash/salt and new role field.
// The role field is part of Enhancement 2 (RBAC).
// ---------------------------------------------------------------------
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name:  { type: String, required: true, trim: true },
  hash:  { type: String, required: true },
  salt:  { type: String, required: true },

  // Role (Enhancement 2)
  // Used by middleware to allow or block access to certain actions.
  role: {
    type: String,
    enum: ['admin', 'editor', 'viewer'],
    default: 'viewer'
  }
});

// ---------------------------------------------------------------------
// setPassword
// Creates a random salt and stores a hashed version of the password.
// Called during user registration.
// ---------------------------------------------------------------------
userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

// ---------------------------------------------------------------------
// validPassword
// Recomputes the hash using the stored salt and compares it.
// Used during login.
// ---------------------------------------------------------------------
userSchema.methods.validPassword = function(password){
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

// ---------------------------------------------------------------------
// generateJWT  (Enhancement 2)
// Issues a signed JWT containing the user ID, name, email, and role.
// The role is used by requireRole() to enforce admin-only operations.
// ---------------------------------------------------------------------
userSchema.methods.generateJWT = function(){
  return jwt.sign(
    { _id: this._id, email: this.email, name: this.name, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

const User = mongoose.model('users', userSchema);
module.exports = User;
