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

// // Query 1: Find the most frequent disaster types in locations where the average property price exceeds $500,000 SET
 app.get('/frequent-disaster-high-price-properties', routes.getFrequentDisasterHighPriceProperties);

// // Query 2: List properties with no disasters in the past 5 years in high-risk disaster areas SET
 app.get('/recently-unimpacted-high-risk-areas', routes.getRecentlyUnimpactedHighRiskAreas);

// // Query 3: Retrieve properties with fewer disasters than the average in their location
app.get('/safest-cities-per-state', routes.getSafestCitiesPerState);

// // Query 4: Retrieve properties affected by all disaster types in their area SET
app.get('/properties-with-significant-disasters', routes.getPropertiesWithSignificantDisasterType);

// // Query 6: Identifies properties affected by the highest number of disaster events SET
 app.get('/most-affected-properties', routes.getMostAffectedProperties);

// // Query 8: Retrieves properties with 3+ bedrooms, 2+ bathrooms, and no disaster history SET
 app.get('/affected-properties-past-two-years', routes.getAffectedPropertyInPastTwoYears);

// // Query 9: Summarizes disaster counts per year by type
app.get('/disaster-trends', routes.getDisasterTrends);


/* ---- (FindHouses) ---- */
app.get('/search_properties', routes.search_properties);
app.get('/get_disasters_for_property', routes.get_disasters_for_property);

/* ---- (DisasterRisks) ---- */
app.get('/search_disasters', routes.search_disasters);

app.listen(config.server_port, () => {
	console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});
  
module.exports = app;