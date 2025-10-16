// app_api/controllers/trips.js
const Trip = require('../models/trips');

// helper: convert DB doc -> Angular card shape
function toCard(t) {
  // strip any leading "/images/" so Angular can do "assets/images/{{image}}"
  const imageFile = (t.image || '').replace(/^\/?images\//, '');

  // build description if not stored as one blob
  const description =
    t.description ??
    [t.desc1, t.desc2].filter(Boolean).map(p => `<p>${p}</p>`).join('');

  // prefer perPerson if present; else fall back to price
  const perPerson = (typeof t.perPerson === 'number') ? t.perPerson
                   : (typeof t.price === 'number') ? t.price
                   : undefined;

  return {
    _id:        t._id?.toString(),
    code:       t.code,
    name:       t.name,
    image:      imageFile,
    resort:     t.resort || '',       // optional, fine if empty
    length:     t.length || '',       // optional
    perPerson,                        // number or undefined
    description                       // HTML string
  };
}

const listTrips = async (req, res) => {
  try {
    const docs = await Trip.find({}).lean();
    res.status(200).json(docs.map(toCard));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trips', error: err.message });
  }
};

const readTrip = async (req, res) => {
  try {
    const doc = await Trip.findOne({ code: req.params.tripCode }).lean();
    if (!doc) return res.status(404).json({ message: 'Trip not found' });
    res.status(200).json(toCard(doc));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trip', error: err.message });
  }
};

const createTrip = async (req, res) => {
  try {
    const doc = await Trip.create({
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start,               // should be an ISO date (yyyy-mm-dd)
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

// PUT: /api/trips/:tripCode — update an existing trip by code
const tripsUpdateTrip = async (req, res) => {
  try {
    //  debug:
    // console.log('params:', req.params);
    // console.log('body:', req.body);

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


