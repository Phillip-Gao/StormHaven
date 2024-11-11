const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

/* ---- (Dashboard) ---- */
// The route localhost:8081/people is registered to the function
// routes.getAllPeople, specified in routes.js.
// app.get('/people', routes.getAllPeople);

/* ---- Part 2 (FindHouses) ---- */
// app.get('/friends/:login', routes.getFriends);

// Lists areas with the highest number of properties affected by disasters
app.get('/top-affected-areas', routes.getTopAffectedAreas);

// Identifies properties affected by the highest number of disaster events
app.get('/most-affected-properties', routes.getMostAffectedProperties);

// Finds properties in frequent disaster areas and under a price threshold
app.get('/frequent-disaster-properties', routes.getFrequentDisasterProperties);

// Retrieves properties with 3+ bedrooms, 2+ bathrooms, and no disaster history
app.get('/safe-large-properties', routes.getSafeLargeProperties);

// Summarizes disaster counts per year by type
app.get('/disaster-trends', routes.getDisasterTrends);

// Finds properties with minimum specified bedrooms and bathrooms
app.get('/large-properties', routes.getLargeProperties);

// Lists disaster types occurring in California
app.get('/california-disasters', routes.getCaliforniaDisasters);

// Calculates average price of properties in disaster-prone areas
app.get('/average-price-in-disaster-areas', routes.getAveragePriceInDisasterAreas);

// Retrieves recent disasters within the last 5 years
app.get('/recent-disasters', routes.getRecentDisasters);

// Finds the most recent disaster by state
app.get('/most-recent-disasters-by-state', routes.getMostRecentDisastersByState);

app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});