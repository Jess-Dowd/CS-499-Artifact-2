// app_server/controllers/travel.js
const axios = require('axios');

// Base URL for the backend API
const apiBase = process.env.API_BASE || 'http://localhost:3000/api';

/* travelList
 * Fetches all trips from the API and renders the Handlebars view.
 * Used for the server-rendered (app_server) version of the site.
 */
async function travelList(req, res) {
  try {
    const { data: trips } = await axios.get(`${apiBase}/trips`);
    res.render('travel', { trips });
  } catch (err) {
    console.error('travelList error:', err.message);
    res.render('travel', { trips: [], message: 'Failed to load trips.' });
  }
}

module.exports = { travelList };
