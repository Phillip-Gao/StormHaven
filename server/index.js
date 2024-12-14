const bodyParser = require('body-parser');
const express = require('express');
const config = require('./config.json')
var routes = require("./routes.js");
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*',
}));

// app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

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

// // Query 5: Lists areas with the highest number of properties affected by disasters
// app.get('/top-affected-areas', routes.getTopAffectedAreas);

// // Query 6: Identifies properties affected by the highest number of disaster events SET
 app.get('/most-affected-properties', routes.getMostAffectedProperties);

// // Query 7: Finds properties in frequent disaster areas and under a price threshold
// app.get('/frequent-disaster-properties', routes.getFrequentDisasterProperties);

// // Query 8: Retrieves properties with 3+ bedrooms, 2+ bathrooms, and no disaster history SET
 app.get('/affected-properties-past-two-years', routes.getAffectedPropertyInPastTwoYears);

// // Query 9: Summarizes disaster counts per year by type
app.get('/disaster-trends', routes.getDisasterTrends);

// // Query 10: Finds properties with minimum specified bedrooms and bathrooms
// app.get('/large-properties', routes.getLargeProperties);

// // Query 11: Lists disaster types occurring in California
// app.get('/california-disasters', routes.getCaliforniaDisasters);

// // Query 12: Calculates average price of properties in disaster-prone areas
// app.get('/average-price-in-disaster-areas', routes.getAveragePriceInDisasterAreas);

// // Query 13: Retrieves recent disasters within the last 5 years
// app.get('/recent-disasters', routes.getRecentDisasters);

// // Query 14: Finds the most recent disaster by state
// app.get('/most-recent-disasters-by-state', routes.getMostRecentDisastersByState);

/* ---- (FindHouses) ---- */
app.get('/search_properties', routes.search_properties);
app.get('/get_disasters_for_property', routes.get_disasters_for_property);

/* ---- (DisasterRisks) ---- */
app.get('/search_disasters', routes.search_disasters);

app.listen(config.server_port, () => {
	console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});
  
module.exports = app;