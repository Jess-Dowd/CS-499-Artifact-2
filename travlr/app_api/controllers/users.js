const User = require('../models/user');

// ---------------------------------------------------------------------
// GET /api/users  (admin only)
// Returns a list of all users with safe fields only.
// Enhancement 3: This endpoint was added to support the new
// admin user directory page.
// ---------------------------------------------------------------------
const listUsers = async (req, res) => {
  try {
    // Only return name, email, and role (no password hash/salt)
    const users = await User.find({}, 'name email role').lean();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

// ---------------------------------------------------------------------
// PUT /api/users/:userId  (admin only)
// Updates allowed fields for a single user account.
// Enhancement 3: Added to let admins change roles or basic user info
// directly from the new admin UI.
// ---------------------------------------------------------------------
const updateUser = async (req, res) => {
  try {
    // Build an object of allowed fields only.
    // Enhancement 3: Prevents updates to unsafe fields like password/hash.
    const allowed = {};
    if (req.body.name)  allowed.name  = req.body.name.trim();
    if (req.body.email) allowed.email = req.body.email.trim().toLowerCase();
    if (req.body.role)  allowed.role  = req.body.role;

    // Update the user in MongoDB and return the new document.
    const updated = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: allowed },
      { new: true, projection: 'name email role' }
    ).lean();

    if (!updated) return res.status(404).json({ message: "User not found" });

    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
};

module.exports = { listUsers, updateUser };
