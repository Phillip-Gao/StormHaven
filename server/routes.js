var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

// Query 1: Lists areas with the highest number of properties affected by disasters
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

// Query 2: Identifies properties affected by the highest number of disaster events
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

// Query 3: Finds properties in frequent disaster areas and under a price threshold
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

// Query 4: Retrieves properties with 3+ bedrooms, 2+ bathrooms, and no disaster history
function getSafeLargeProperties(req, res) {
  var query = `
    SELECT p.property_id, p.price, f.bedrooms, f.bathrooms, f.acre_lot
    FROM Property p
    INNER JOIN Features f ON p.property_id = f.property_id
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

// Query 5: Summarizes disaster counts per year by type
function getDisasterTrends(req, res) {
  var query = `
    SELECT YEAR(d.designated_date) AS year, dt.type_description, COUNT(d.disaster_id) AS disaster_count 
    FROM Disaster d 
    JOIN Disaster_Types dt ON d.disaster_id = dt.disaster_id 
    GROUP BY year, dt.type_description 
    ORDER BY year DESC, disaster_count DESC;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else res.json(rows);
  });
}

// Query 6: Finds properties with minimum specified bedrooms and bathrooms
function getLargeProperties(req, res) {
  var query = `
    SELECT p.property_id, f.bedrooms, f.bathrooms 
    FROM Property p 
    JOIN Features f ON p.property_id = f.property_id 
    WHERE f.bedrooms >= 3 AND f.bathrooms >= 2;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else res.json(rows);
  });
}

// Query 7: Lists disaster types occurring in California
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

// Query 8: Calculates average price of properties in disaster-prone areas
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

// Query 9: Retrieves recent disasters within the last 5 years
function getRecentDisasters(req, res) {
  var query = `
    SELECT d.disaster_id, d.designated_date, dt.type_description 
    FROM Disaster d 
    JOIN Disaster_Types dt ON d.disaster_id = dt.disaster_id 
    WHERE d.designated_date >= DATE_SUB(CURDATE(), INTERVAL 5 YEAR);
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else res.json(rows);
  });
}

// Query 10: Finds the most recent disaster by state
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

// Export the new functions to be accessible in index.js
module.exports = {
  getTopAffectedAreas: getTopAffectedAreas,
  getMostAffectedProperties: getMostAffectedProperties,
  getFrequentDisasterProperties: getFrequentDisasterProperties,
  getSafeLargeProperties: getSafeLargeProperties,
  getDisasterTrends: getDisasterTrends,
  getLargeProperties: getLargeProperties,
  getCaliforniaDisasters: getCaliforniaDisasters,
  getAveragePriceInDisasterAreas: getAveragePriceInDisasterAreas,
  getRecentDisasters: getRecentDisasters,
  getMostRecentDisastersByState: getMostRecentDisastersByState
};
