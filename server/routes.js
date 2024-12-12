const config = require('./config.json')
var mysql = require('mysql');
const { Pool, types } = require('pg');

types.setTypeParser(20, val => parseInt(val, 10)); //DO NOT DELETE THIS
const connection = new Pool({
  host: config.host,
  user: config.user,
  password: config.password,
  port: config.port,
  database: config.database,
  ssl: {
    rejectUnauthorized: false,
  },
});
connection.connect((err) => err && console.log(err));

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

// Query 1: Find the most frequent disaster types in locations where the
// average property price exceeds $500,000, grouped by type_code.
function getFrequentDisasterHighPriceProperties(req, res) {
  var query = `
    WITH High_Priced_Locations AS (
      SELECT l.city, l.state
      FROM Located l
      JOIN Property p ON l.property_id = p.property_id
      GROUP BY l.city, l.state
      HAVING AVG(p.price) > 500000
    ),
    Frequent_Disaster_Types AS (
      SELECT dt.type_code, COUNT(d.disaster_id) AS disaster_count
      FROM High_Priced_Locations hpl
      JOIN Located l ON hpl.city = l.city AND hpl.state = l.state
      JOIN Property_Disaster pd ON l.property_id = pd.property_id
      JOIN Disaster d ON pd.disaster_id = d.disaster_id
      JOIN Disaster_Types dt ON d.disaster_id = dt.disaster_id
      GROUP BY dt.type_code
    )
    SELECT type_code, disaster_count
    FROM Frequent_Disaster_Types
    ORDER BY disaster_count DESC;
    `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else res.json(rows);
  });
}

// Query 2: List properties that have no disasters recorded in the past 5 years but 
// are located in areas historically affected by high-risk disasters (e.g., type_code = 'HM').
function getRecentlyUnimpactedHighRiskAreas(req, res) {
  var query = `
    WITH Recent_Disasters AS (
      SELECT DISTINCT pd.property_id
      FROM Property_Disaster pd
      JOIN Disaster d ON pd.disaster_id = d.disaster_id
      WHERE d.designated_date >= CURRENT_DATE - INTERVAL '5 YEARS'
    ),
    High_Risk_Areas AS (
      SELECT DISTINCT l.city, l.state
      FROM Located l
      JOIN Disaster d ON l.disaster_id = d.disaster_id
      JOIN Disaster_Types dt ON d.disaster_id = dt.disaster_id
      WHERE dt.type_code = 'HM'
    )
    SELECT p.property_id, l.city, l.state
    FROM Property p
    JOIN Located l ON p.property_id = l.property_id
    WHERE l.city IN (SELECT city FROM High_Risk_Areas)
    AND l.state IN (SELECT state FROM High_Risk_Areas)
    AND p.property_id NOT IN (SELECT property_id FROM Recent_Disasters);
   `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else res.json(rows);
  });
}

// Query 3: Retrieve properties that have been impacted by fewer disasters than the 
// average number of disasters per property in their location, showing property_id, city, and state.
function getSafestPropertiesInHighRiskAreas(req, res) {
  var query = `
    WITH Average_Disaster_Count_Per_Location AS (
      SELECT l.city, l.state, AVG(disaster_count) AS avg_disasters
      FROM (
          SELECT l.city, l.state, p.property_id, COUNT(pd.disaster_id) AS disaster_count
          FROM Property p
          JOIN Property_Disaster pd ON p.property_id = pd.property_id
          JOIN Located l ON p.property_id = l.property_id
          GROUP BY l.city, l.state, p.property_id
      ) Property_Disaster_Count
      GROUP BY l.city, l.state
    )
    SELECT p.property_id, l.city, l.state
    FROM Property p
    JOIN Property_Disaster pd ON p.property_id = pd.property_id
    JOIN Located l ON p.property_id = l.property_id
    GROUP BY p.property_id, l.city, l.state
    HAVING COUNT(pd.disaster_id) < (
      SELECT avg_disasters
      FROM Average_Disaster_Count_Per_Location avg_loc
      WHERE avg_loc.city = l.city AND avg_loc.state = l.state
    );
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else res.json(rows);
  });
}

// Query 4: Retrieve properties that have been affected by all disaster types in their respective city and state.
function getPropertiesWithAllDisasters(req, res) {
  var query = `
    WITH Disaster_Types_Per_Location AS (
      SELECT l.city, l.state, dt.type_code
      FROM Disaster d
      JOIN Disaster_Types dt ON d.disaster_id = dt.disaster_id
      JOIN Located l ON d.disaster_id = l.disaster_id
      GROUP BY l.city, l.state, dt.type_code
    ),
    Property_Disaster_Types AS (
      SELECT l.city, l.state, p.property_id, dt.type_code
      FROM Property p
      JOIN Located l ON p.property_id = l.property_id
      JOIN Property_Disaster pd ON p.property_id = pd.property_id
      JOIN Disaster_Types dt ON pd.disaster_id = dt.disaster_id
    ),
    All_Disaster_Types_Check AS (
      SELECT pd.property_id
      FROM Property_Disaster_Types pd
      GROUP BY pd.property_id, pd.city, pd.state
      HAVING COUNT(DISTINCT pd.type_code) = (
          SELECT COUNT(DISTINCT d.type_code)
          FROM Disaster_Types_Per_Location d
          WHERE d.city = pd.city AND d.state = pd.state
      )
    )
    SELECT DISTINCT p.property_id, l.city, l.state
    FROM Property p
    JOIN Located l ON p.property_id = l.property_id
    WHERE p.property_id IN (SELECT property_id FROM All_Disaster_Types_Check);
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else res.json(rows);
  });
}

// Query 5: Lists areas with the highest number of properties affected by disasters
function getTopAffectedAreas(req, res) {
  var query = `
    SELECT l.city, l.state_code, COUNT(pd.property_id) AS property_count, dt.type_description 
    FROM Property_Disaster pd 
    JOIN Property p ON pd.property_id = p.property_id 
    JOIN Located l ON p.property_id = l.property_id 
    JOIN Disaster_Types dt ON pd.disaster_id = dt.disaster_id 
    GROUP BY l.city, l.state_code, dt.type_description 
    ORDER BY property_count DESC 
    LIMIT 10;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else res.json(rows);
  });
}

// Query 6: Identifies properties affected by the highest number of disaster events
function getMostAffectedProperties(req, res) {
  var query = `
    SELECT p.property_id, p.price, COUNT(pd.disaster_id) AS disaster_count 
    FROM Property p 
    JOIN Property_Disaster pd ON p.property_id = pd.property_id 
    GROUP BY p.property_id 
    HAVING disaster_count = (SELECT MAX(count) 
               FROM (SELECT COUNT(disaster_id) AS count 
                     FROM Property_Disaster 
                     GROUP BY property_id) AS subquery);
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else res.json(rows);
  });
}

// Query 7: Finds properties in frequent disaster areas and under a price threshold
function getFrequentDisasterProperties(req, res) {
  var query = `
    SELECT p.property_id, p.price, l.city, l.state_code 
    FROM Property p 
    JOIN Located l ON p.property_id = l.property_id 
    JOIN Property_Disaster pd ON p.property_id = pd.property_id 
    WHERE l.state_code = 'FL' 
      AND p.price < 200000 
      AND (SELECT COUNT(pd_inner.disaster_id) 
           FROM Property_Disaster pd_inner 
           WHERE pd_inner.property_id = p.property_id) > 3;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else res.json(rows);
  });
}

// Query 8: Retrieves properties with 3+ bedrooms, 2+ bathrooms, and no disaster history
function getSafeLargeProperties(req, res) {
  var query = `
    SELECT p.property_id, p.price, f.bedrooms, f.bathrooms, f.acre_lot
    FROM property p
    INNER JOIN features f ON p.property_id = f.property_id
    WHERE f.bedrooms >= 3
      AND f.bathrooms >= 2
      AND p.property_id NOT IN (
          SELECT DISTINCT pd.property_id
          FROM Property_Disaster pd
      )
    ORDER BY p.property_id;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else res.json(rows);
  });
}

// Query 9: Summarizes disaster counts per year by type
function getDisasterTrends(req, res) {
  var query = `
    SELECT YEAR(d.designated_date) AS year, dt.type_description, COUNT(d.disaster_id) AS disaster_count 
    FROM disaster d 
    JOIN disaster_types dt ON d.disaster_id = dt.disaster_id 
    GROUP BY year, dt.type_description 
    ORDER BY year DESC, disaster_count DESC;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else res.json(rows);
  });
}

// Query 10: Finds properties with minimum specified bedrooms and bathrooms
function getLargeProperties(req, res) {
  var query = `
    SELECT p.property_id, f.bedrooms, f.bathrooms 
    FROM property p 
    JOIN features f ON p.property_id = f.property_id 
    WHERE f.bedrooms >= 3 AND f.bathrooms >= 2;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else res.json(rows);
  });
}

// Query 11: Lists disaster types occurring in California
function getCaliforniaDisasters(req, res) {
  var query = `
    SELECT DISTINCT dt.type_description 
    FROM Disaster d 
    JOIN Disaster_Types dt ON d.disaster_id = dt.disaster_id 
    JOIN Located l ON d.disaster_id = l.disaster_id 
    WHERE l.state_code = 'CA';
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else res.json(rows);
  });
}

// Query 12: Calculates average price of properties in disaster-prone areas
function getAveragePriceInDisasterAreas(req, res) {
  var query = `
    SELECT AVG(p.price) AS avg_price 
    FROM Property p 
    JOIN Property_Disaster pd ON p.property_id = pd.property_id;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else res.json(rows);
  });
}

// Query 13: Retrieves recent disasters within the last 5 years
function getRecentDisasters(req, res) {
  var query = `
    SELECT d.disaster_id, d.designated_date, dt.type_description 
    FROM disaster d 
    JOIN disaster_Types dt ON d.disaster_id = dt.disaster_id 
    WHERE d.designated_date >= DATE_SUB(CURDATE(), INTERVAL 5 YEAR);
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else res.json(rows);
  });
}

// Query 14: Finds the most recent disaster by state
function getMostRecentDisastersByState(req, res) {
  var query = `
    SELECT l.state, d.disaster_number, MAX(d.designated_date) AS most_recent_disaster
    FROM Disaster d
    JOIN Located l ON d.disaster_id = l.disaster_id
    GROUP BY l.state;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else res.json(rows);
  });
}

const search_properties = async function (req, res) {
  const propertyId = req.query.property_id;
  const propertyIdFilter = propertyId  ? `p.property_id = ${propertyId}` : 'TRUE';
  const state = req.query.state;
  const stateFilter = state  ? `state LIKE '%${state}%'` : 'TRUE';
  const county = req.query.county_name;
  const countyFilter = county  ? `county_name LIKE '%${county}%'` : 'TRUE';
  const status = req.query.status;
  const statusFilter = status  ? `status LIKE '%${status}%'` : 'TRUE';
  const priceLow = req.query.price_low ?? 0;
  const priceHigh = req.query.price_high ?? 10000000000;
  const bathroomsLow = req.query.bathrooms_low ?? 0;
  const bathroomsHigh = req.query.bathrooms_high ?? 100;
  const bedroomsLow = req.query.bedrooms_low ?? 0;
  const bedroomsHigh = req.query.bedrooms_high ?? 1000;
  const acreLotLow = req.query.acres_low ?? 0;
  const acreLotHigh = req.query.acres_high ?? 10000;

  // Adjusted SQL query to handle the new filters and join
  connection.query(`
    SELECT * 
    FROM public.Property p
    JOIN public.Features f ON p.property_id = f.property_id
    WHERE ${propertyIdFilter} 
      AND ${stateFilter} 
      AND ${countyFilter}
      AND ${statusFilter}  
      AND price BETWEEN ${priceLow} AND ${priceHigh}
      AND bathrooms BETWEEN ${bathroomsLow} AND ${bathroomsHigh}
      AND bedrooms BETWEEN ${bedroomsLow} AND ${bedroomsHigh}
      AND acre_lot BETWEEN ${acreLotLow} AND ${acreLotHigh}
    ORDER BY p.property_id ASC
    LIMIT 100;
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json([]);
    } else {
      console.log("Success");
      res.json(data.rows);
    }
  });
}


// Export the new functions to be accessible in index.js
module.exports = {
  getFrequentDisasterHighPriceProperties,
  getRecentlyUnimpactedHighRiskAreas,
  getSafestPropertiesInHighRiskAreas,
  getPropertiesWithAllDisasters,
  getTopAffectedAreas,
  getMostAffectedProperties,
  getFrequentDisasterProperties,
  getSafeLargeProperties,
  getDisasterTrends,
  getLargeProperties,
  getCaliforniaDisasters,
  getAveragePriceInDisasterAreas,
  getRecentDisasters,
  getMostRecentDisastersByState,
  search_properties
};
