/**
 * This file defines various route handlers for querying disaster-related 
 * and property-related data from a PostgreSQL database. The queries are designed 
 * to support analytics and dashboard functionalities, such as retrieving information 
 * about disasters, properties, and their intersections.
 */

const config = require('./config.json')
var mysql = require('mysql');
const { Pool, types } = require('pg');

types.setTypeParser(20, val => parseInt(val, 10)); 
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
// Complex Query 1 (For Analytics in Dashboard)
const getFrequentDisasterHighPriceProperties = async function (req, res) {
  // Select from a materialized view
  connection.query(`
    SELECT * FROM view_frequent_disaster_high_price;
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json([])
    } else {
      console.log("Success");
      res.json(data.rows);
    }
  });
};

// Query 2: List properties that have no disasters recorded in the past 5 years but 
// are located in areas historically affected by high-risk disasters (e.g., type_code = 'HM').
// Complex Query 2 (For Overview in  Dashboard)
function getRecentlyUnimpactedHighRiskAreas(req, res) {
  // Select from a materialized view
  var query = `
    SELECT * from view_recently_unimpacted_high_risk_areas;
   `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else res.json(rows);
  });
}

// Query 3: Retrieve cities that have been impacted by fewer disasters than the 
// average number of disasters per city in their state, showing property_id, city, and state.
// Complex Query 3 (For Analytics in  Dashboard)
function getSafestCitiesPerState(req, res) {
  // Select from a materialized view
  connection.query(`
    SELECT * from view_safest_cities_per_state;
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json([])
    } else {
      console.log("Success");
      res.json(data.rows);
    }
  });
}

// Query 4: Retrieves statistical information about properties located in cities and states affected 
// by at least two different types of disasters
// Complex Query 4 (For Analytics in Dashboard)
function getPropertiesWithSignificantDisasterType(req, res) {
  // Select from a materialized view
  connection.query(`
    SELECT * FROM view_properties_with_significant_disaster_type;
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json([])
    } else {
      console.log("Success");
      res.json(data.rows);
    }
  });
}

// Query 5: Identifies properties affected by the highest number of disaster events in past year
// Part of Overview on Dashboard
function getMostAffectedProperties(req, res) {
  var query = `
      SELECT
      l.city,
      l.state,
      l.county_name,
      COUNT(DISTINCT l.property_id) AS affected_properties
      FROM Located l
      JOIN Disaster d ON l.disaster_id = d.disaster_id
      GROUP BY l.city, l.state, l.county_name
      ORDER BY affected_properties DESC
      LIMIT 20;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else res.json(rows);
  });
}

// Query 6: Retrieves properties with that have been affected by a disaster in the past 2 years
// Part of Overview on Dashboard
function getAffectedPropertyInPastTwoYears(req, res) {
  var query = `
  SELECT DISTINCT p.property_id, p.price, p.status, l.city, l.state, d.designateddate
  FROM Property p
  JOIN Located l ON p.property_id = l.property_id
  JOIN Disaster d ON l.disaster_id = d.disaster_id
  WHERE d.designateddate >= NOW() - INTERVAL '2 year'
  ORDER BY d.designateddate DESC
  LIMIT 100;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else res.json(rows);
  });
}

// Query 7: Retrieves properties that match the provided property id, state, city, and/or 
// status (if not provided, default TRUE) and is within the price, bathroom, bedroom, and 
// acre range (if not provided, we set default ranges)
// Part of FindHouses and Favorites
const search_properties = async function (req, res) {
    // Set property id filter, default TRUE if not provided
  const propertyId = req.query.property_id;
  var propertyIdFilter  = 'TRUE';
  if (typeof propertyId !== 'undefined' && propertyId.length != 0) {
    propertyIdFilter = `p.property_id = ${propertyId}`;
  }

  // Set property state filter, default TRUE if not provided
  const state = req.query.state;
  var stateFilter = 'TRUE';
  if (typeof state !== 'undefined' && state.length != 0) {
    stateFilter = `state ILIKE '%${state}%'`;
  }

  // Set property county/city filter, default TRUE if not provided
  const county = req.query.county_name;
  var countyFilter = 'TRUE';
  if (typeof county !== 'undefined' && county.length != 0) {
    countyFilter = `county_name ILIKE '%${county}%'`;
  }

  // Set property status filter, default TRUE if not provided
  const status = req.query.status;
  var statusFilter = 'TRUE';
  if (typeof status !== 'undefined' && status.length != 0) {
    statusFilter = `status ILIKE '%${status}%'`;
  }

  // Set price, number of bathrooms, number of bedrooms, and acre size
  // minimum and maximums, set to default values if not provided
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
    LIMIT 1000;
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

// Query 8: Retrieves the disasters that have happened at a given property id
// Part of PropertyCard, which appears on FindHouses and Favorites
function get_disasters_for_property(req, res) {
  const propertyId = req.query.property_id;
  var propertyIdFilter  = 'TRUE';
  if (typeof propertyId !== 'undefined' && propertyId.length != 0) {
    propertyIdFilter = `p.property_id = ${propertyId}`;
  }

  connection.query(`
    SELECT DISTINCT(d.disaster_id), d.disasternumber, d.designateddate, d.closeoutdate, dt.type_code, dt.type_description
    FROM public.property p
    JOIN public.disaster d ON p.county_name = d.county_name
    JOIN public.disaster_types dt ON d.disaster_id = dt.disaster_id
    WHERE ${propertyIdFilter}
    ORDER BY d.designateddate DESC
    LIMIT 1000;
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


// Query 9: Retrieves disasters that match the provided disaster id, number, type code, and/or 
// city (if not provided, default TRUE) and is within the designated date range (if not provided, 
// we set a default range)
// Part of DisasterRisks page
const search_disasters = async function (req, res) {
  // Set disaster id filter, default TRUE if not provided
  const disasterId = req.query.disaster_id;
  var disasterIdFilter  = 'TRUE';
  if (typeof disasterId !== 'undefined' && disasterId.length != 0) {
    disasterIdFilter = `d.disaster_id = ${disasterId}`;
  }

  // Set disaster number filter, default TRUE if not provided
  const disasterNumber = req.query.disasternumber;
  var disasterNumberFilter = 'TRUE';
  if (typeof disasterNumber !== 'undefined' && disasterNumber.length != 0) {
    disasterNumberFilter = `d.disasternumber = ${disasterNumber}`;
  }

  // Set disaster type code filter, default TRUE if not provided
  const typeCode = req.query.type_code;
  var typeCodeFilter = 'TRUE';
  if (typeof typeCode !== 'undefined' && typeCode.length != 0) {
    typeCodeFilter = `dt.type_code = '${typeCode}'`;
  }

  // Set disaster county/city filter, default TRUE if not provided
  const county = req.query.county_name;
  var countyFilter = 'TRUE';
  if (typeof county !== 'undefined' && county.length != 0) {
    countyFilter = `county_name ILIKE '%${county}%'`;
  }

  // Set disaster date minimum, default year 1000 if not provided
  var designatedDateLow = req.query.designateddate_low; 
  if (typeof designatedDateLow !== 'undefined' && designatedDateLow.length != 0) {
    designatedDateLow = req.query.designateddate_low;
  } else {
    designatedDateLow = "1000-01-01T00:00:00.000Z";
  }

  // Set disaster date minimum, default year 3000 if not provided
  var designatedDateHigh = req.query.designateddate_high; 
  if (typeof designatedDateHigh !== 'undefined' && designatedDateHigh.length != 0) {
    designatedDateHigh = req.query.designateddate_high;
  } else {
    designatedDateHigh = "3000-01-01T00:00:00.000Z";
  }

  // Adjusted SQL query to handle the new filters and join
  connection.query(`
    SELECT * 
    FROM public.Disaster d
    JOIN public.Disaster_Types dt ON d.disaster_id = dt.disaster_id
    WHERE ${disasterIdFilter} 
      AND ${disasterNumberFilter} 
      AND ${typeCodeFilter}
      AND ${countyFilter}  
      AND d.designateddate >= '${designatedDateLow}'
      AND d.designateddate <= '${designatedDateHigh}'
    ORDER BY d.disasternumber ASC
    LIMIT 1000;
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

// Query 10: Summarizes disaster counts per year by type code
// Part of DisasterRisks page
function getDisasterTrends(req, res) {
  connection.query(`
  SELECT 
    row_number() OVER (ORDER BY EXTRACT(YEAR FROM designateddate) DESC, COUNT(d.disaster_id) DESC) AS index, 
    EXTRACT(YEAR FROM designateddate) AS year, 
    dt.type_description, 
    COUNT(d.disaster_id) AS disaster_count 
  FROM disaster d 
  JOIN disaster_types dt ON d.disaster_id = dt.disaster_id 
  WHERE EXTRACT(YEAR FROM designateddate) <= 2024
  GROUP BY year, dt.type_description 
  ORDER BY year DESC, disaster_count DESC;
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
  getSafestCitiesPerState,
  getPropertiesWithSignificantDisasterType,
  getMostAffectedProperties,
  getAffectedPropertyInPastTwoYears,
  search_properties,
  get_disasters_for_property,
  search_disasters,
  getDisasterTrends
};
