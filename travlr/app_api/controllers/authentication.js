const passport = require('passport');
const User = require('../models/user');

const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(409).json({ message: 'User already exists' });

    const user = new User({ email: email.toLowerCase().trim(), name });
    user.role = req.body.role || 'viewer';
    user.setPassword(password);
    await user.save();

    const token = user.generateJWT();
    return res.status(201).json({ token });
  } catch (err) {
    return res.status(500).json({ message: 'Register error', error: err.message });
  }
};

const login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'All fields required' });
  }
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(404).json(err);
    if (!user) return res.status(401).json(info || { message: 'Auth failed' });
    const token = user.generateJWT();
    return res.status(200).json({ token });
  })(req, res);
};

module.exports = { register, login };
