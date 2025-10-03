// app_api/controllers/trips.js
const Trip = require('../models/trips');

const listTrips = async (req, res) => {
  try {
    const trips = await Trip.find({}).lean();
    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trips', error: err.message });
  }
};

const readTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ code: req.params.tripCode }).lean();
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.status(200).json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trip', error: err.message });
  }
};

module.exports = { listTrips, readTrip };

