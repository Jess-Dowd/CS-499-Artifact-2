// app_api/config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../models/user');

// ---------------------------------------------------------------------
// LocalStrategy setup  (Enhancement 2)
// This defines how username/password login is handled.
// ---------------------------------------------------------------------
passport.use(
  new LocalStrategy(
    { usernameField: 'email' },   // use email instead of default "username"

    // -----------------------------------------------------------------
    // Authentication callback
    // Looks up the user by email, validates password using the model's
    // validPassword() helper, and returns the user if correct.
    // -----------------------------------------------------------------
    async (email, password, done) => {
      try {
        // normalize input email
        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user)
          return done(null, false, { message: 'User not found' });

        // password hashing + comparison happens inside validPassword()
        if (!user.validPassword(password))
          return done(null, false, { message: 'Wrong password' });

        // success — pass the user into passport
        return done(null, user);

      } catch (err) {
        return done(err);
      }
    }
  )
);
