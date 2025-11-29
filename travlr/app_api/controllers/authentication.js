const passport = require('passport');
const User = require('../models/user');

/*
 * ---------------------------------------------------------
 * register()
 * Creates a new user account.
 *
 * Enhancement 2:
 * - Added role-based access control (RBAC).
 * - 'role' field is accepted but defaults to 'viewer' for safety.
 * - Password hashing handled through User.setPassword().
 * - Email normalized (lowercase/trim) for consistency.

 * ---------------------------------------------------------
 */
const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // Basic required field checks
    if (!email || !name || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    // Ensure unique email
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(409).json({ message: 'User already exists' });

    // Create user document
    const user = new User({
      email: email.toLowerCase().trim(),
      name
    });
    // Enhancement 2: assign role (default viewer)
    user.role = req.body.role || 'viewer';

    // Hash password (salt + pbkdf2)
    user.setPassword(password);

    await user.save();

    // Generate JWT to auto-login after registration
    const token = user.generateJWT();
    return res.status(201).json({ token });

  } catch (err) {
    return res.status(500).json({ message: 'Register error', error: err.message });
  }
};

/*
 * ---------------------------------------------------------
 * login()
 * Authenticates existing users using Passport LocalStrategy.
 *
 * Enhancement 2:
 * - JWT now contains { _id, email, name, role } so the SPA
 *   can enforce RBAC (hiding buttons, route protection, etc.).

 * ---------------------------------------------------------
 */
const login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(404).json(err);

    // Reject invalid credentials
    if (!user) return res.status(401).json(info || { message: 'Auth failed' });

    // Enhancement 2: includes updated role inside JWT
    const token = user.generateJWT();

    return res.status(200).json({ token });
  })(req, res);
};

module.exports = { register, login };
