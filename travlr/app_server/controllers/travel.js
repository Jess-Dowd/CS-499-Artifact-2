// // app_server/controllers/travel.js
// const fs = require('fs'); // built-in Node filesystem
// // Read once at load-time
// const trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

// const travel = (req, res) => {
//   res.render('travel', {
//     title: 'Travlr Getaways',
//     trips // pass array to the template
//   });
// };



// app_server/controllers/travel.js
const axios = require('axios');

const apiBase = process.env.API_BASE || 'http://localhost:3000/api';

async function travelList(req, res) {
  try {
    const { data: trips } = await axios.get(`${apiBase}/trips`);
    // trips is an array returned by your API
    res.render('travel', { trips });
  } catch (err) {
    console.error('travelList error:', err.message);
    res.render('travel', { trips: [], message: 'Failed to load trips.' });
  }
}

module.exports = { travelList };
