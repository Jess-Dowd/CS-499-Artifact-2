// seeds/seed.js
const path = require('path');
const mongoose = require('mongoose');
require('../app_api/models/db'); // sets up connection + models
const Trip = require('../app_api/models/trips');
const fs = require('fs');

(async () => {
  try {
    const dataPath = path.resolve(__dirname, '..', 'data', 'trips.json');
    const raw = fs.readFileSync(dataPath, 'utf8');
    const items = JSON.parse(raw);

    // normalize fields for schema
    const docs = items.map(t => ({
    name:  t.name,
    image: t.image,
    desc1: t.desc1,
    desc2: t.desc2
    }));


    // wipe + insert (safe for dev)
    await Trip.deleteMany({});
    const result = await Trip.insertMany(docs);
    console.log(`Seeded trips: ${result.length}`);
  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    mongoose.connection.close();
  }
})();
