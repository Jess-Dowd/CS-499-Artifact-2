// seeds/seed.js
const path = require('path');
const mongoose = require('mongoose');
require('../app_api/models/db'); // sets up connection + models
const Trip = require('../app_api/models/trips');
const fs = require('fs');

// turn "Gale Reef" => "GALE-REEF", remove weird punctuation
function makeCode(name = '') {
  return name
    .normalize('NFKD')                 // normalize smart quotes/accents
    .replace(/[^\w\s-]/g, '')          // drop non-word chars
    .trim()
    .replace(/\s+/g, '-')              // spaces -> hyphen
    .toUpperCase();
}

(async () => {
  try {
    const dataPath = path.resolve(__dirname, '..', 'data', 'trips.json');
    const raw = fs.readFileSync(dataPath, 'utf8');
    const items = JSON.parse(raw);

  const docs = items.map(t => ({
    code:  t.code || makeCode(t.name),
    name:  t.name,
    image: t.image,         // keep "/images/reef1.jpg" — controller strips it
    desc1: t.desc1,
    desc2: t.desc2,

    // optional niceties for the SPA
    resort: t.resort || `${t.name.split(' ')[0]} Resort`,
    length: t.length || '3 days',
    perPerson: t.perPerson || t.price || 399
  }));


    await Trip.deleteMany({});
    const result = await Trip.insertMany(docs);
    console.log(`Seeded trips: ${result.length}`);
  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    mongoose.connection.close();
  }
})();
