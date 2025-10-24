const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../models/user');

passport.use(new LocalStrategy(
  { usernameField: 'email' },                 // expect email + password
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) return done(null, false, { message: 'User not found' });
      if (!user.validPassword(password)) return done(null, false, { message: 'Wrong password' });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));
