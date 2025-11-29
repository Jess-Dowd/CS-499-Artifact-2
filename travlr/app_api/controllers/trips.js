// app_api/controllers/trips.js
const Trip = require('../models/trips');

// ---------------------------------------------------------------------
// toCard helper
// Converts a Trip DB document into the format used by the Angular SPA.
// Normalizes old fields (desc1/desc2/price) and strips image paths.
// ---------------------------------------------------------------------
function toCard(t) {
  // normalize image filename for Angular assets
  const imageFile = (t.image || '').replace(/^\/?images\//, '');

  // build description using new or legacy fields
  const description =
    t.description ??
    [t.desc1, t.desc2].filter(Boolean).map(p => `<p>${p}</p>`).join('');

  // prefer perPerson; fall back to legacy "price"
  const perPerson = (typeof t.perPerson === 'number') ? t.perPerson
                   : (typeof t.price === 'number') ? t.price
                   : undefined;

  return {
    _id:        t._id?.toString(),
    code:       t.code,
    name:       t.name,
    image:      imageFile,
    resort:     t.resort || '',
    length:     t.length || '',
    perPerson,
    description
  };
}

// ---------------------------------------------------------------------
// listTrips
// GET /api/trips
// Returns all trips formatted through toCard().
// Public route (no auth). Enhanced in Enhancement 2 because writes are
// protected, but reads remain open.
// ---------------------------------------------------------------------
const listTrips = async (req, res) => {
  try {
    const docs = await Trip.find({}).lean();
    res.status(200).json(docs.map(toCard));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trips', error: err.message });
  }
};

// ---------------------------------------------------------------------
// readTrip
// GET /api/trips/:tripCode
// Returns a single trip formatted for Angular.
// ---------------------------------------------------------------------
const readTrip = async (req, res) => {
  try {
    const doc = await Trip.findOne({ code: req.params.tripCode }).lean();
    if (!doc) return res.status(404).json({ message: 'Trip not found' });
    res.status(200).json(toCard(doc));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trip', error: err.message });
  }
};

// ---------------------------------------------------------------------
// createTrip  (Enhancement 2: now admin-only via middleware)
// POST /api/trips
// Creates a new trip using data from the request body.
// ---------------------------------------------------------------------
const createTrip = async (req, res) => {
  try {
    const doc = await Trip.create({
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start,
      resort: req.body.resort,
      perPerson: req.body.perPerson,
      image: req.body.image,
      description: req.body.description
    });
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ message: 'Create failed', error: err.message });
  }
};

// ---------------------------------------------------------------------
// tripsUpdateTrip  (Enhancement 2: now admin-only via middleware)
// PUT /api/trips/:tripCode
// Updates an existing trip by its code.
// ---------------------------------------------------------------------
const tripsUpdateTrip = async (req, res) => {
  try {
    const update = {
      code:        req.body.code,
      name:        req.body.name,
      length:      req.body.length,
      start:       req.body.start,
      resort:      req.body.resort,
      perPerson:   req.body.perPerson,
      image:       req.body.image,
      description: req.body.description
    };

    const trip = await Trip.findOneAndUpdate(
      { code: req.params.tripCode },
      update,
      { new: true, runValidators: true }
    ).lean();

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    return res.status(201).json(trip);
  } catch (err) {
    return res.status(400).json({ message: 'Update failed', error: err.message });
  }
};

module.exports = { listTrips, readTrip, createTrip, tripsUpdateTrip };
