/**
 * This file sets up an express server and defines route handlers for disaster 
 * and property-related queries. It supports APIs for analytics, search, and 
 * dashboard functionalities, integrating with the routes defined in routes.js.
 */

const bodyParser = require('body-parser');
const express = require('express');
const config = require('./config.json')
var routes = require("./routes.js");
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*',
}));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

/* ---- (Dashboard) ---- */

// Query 1: Find the most frequent disaster types in locations where the average property price exceeds $500,000
 app.get('/frequent-disaster-high-price-properties', routes.getFrequentDisasterHighPriceProperties);

// Query 2: List properties with no disasters in the past 5 years in high-risk disaster areas 
 app.get('/recently-unimpacted-high-risk-areas', routes.getRecentlyUnimpactedHighRiskAreas);

// Query 3: Retrieve cities with fewer disasters than the average city in their state
app.get('/safest-cities-per-state', routes.getSafestCitiesPerState);

// Query 4: Retrieves statistical information about properties located in cities and states affected 
// by at least two different types of disasters
app.get('/properties-with-significant-disasters', routes.getPropertiesWithSignificantDisasterType);

// Query 5: Identifies properties affected by the highest number of disaster events 
 app.get('/most-affected-properties', routes.getMostAffectedProperties);

// Query 6: Retrieves properties with that have been affected by a disaster in the past 2 years
 app.get('/affected-properties-past-two-years', routes.getAffectedPropertyInPastTwoYears);


/* ---- (FindHouses) ---- */

// Query 7:  Retrieves properties that match property id, state, city, and/or 
// status and is within the price, bathroom, bedroom, and acre range
app.get('/search_properties', routes.search_properties);

// Query 8: Retrieves the disasters that have happened at a given property id
app.get('/get_disasters_for_property', routes.get_disasters_for_property);

/* ---- (DisasterRisks) ---- */

// Query 9: Retrieves disasters that match the provided disaster id, number, type code, and/or 
// city and is within the designated date range
app.get('/search_disasters', routes.search_disasters);

// Query 10: Summarizes disaster counts per year by type
app.get('/disaster-trends', routes.getDisasterTrends);

app.listen(config.server_port, () => {
	console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});
  
module.exports = app;