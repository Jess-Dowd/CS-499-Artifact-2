// app_server/controllers/travel.js
const fs = require('fs'); // built-in Node filesystem
// Read once at load-time
const trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

const travel = (req, res) => {
  res.render('travel', {
    title: 'Travlr Getaways',
    trips // pass array to the template
  });
};

module.exports = { travel };
