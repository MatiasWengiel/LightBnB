// const { query } = require('./pglink'); 
const { queryMultipleReturns, querySingleReturn, whereOrAnd } = require('./queryBuilderFunctions')

/// Users
/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {

  return querySingleReturn(`SELECT * FROM users WHERE email = $1;`, [email.toLowerCase()])
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {

  return querySingleReturn(`SELECT * FROM users WHERE id = $1`, [id])
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {

  return querySingleReturn(`
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3) RETURNING *;
  `, [user.name, user.email.toLowerCase(), user.password])
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {

  return queryMultipleReturns(`
    SELECT properties.* 
    FROM properties
    JOIN reservations ON reservations.property_id = properties.id
    JOIN property_reviews ON property_reviews.property_id = properties.id
    WHERE reservations.guest_id = $1
    GROUP BY reservations.id, properties.id
    ORDER BY start_date
    LIMIT $2
  `, [guest_id, limit])
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];

  //Start of the query
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id`;

  // If options includes a city, add it to the parameters and add to the query language that looks for the given string in the city field
  if (options.city) {
    queryParams.push(`%${options.city}%`);

    queryString += `
  ${whereOrAnd(queryParams)} city LIKE $${queryParams.length}`;
  }

  // If options includes a minimum price per night, add it to the parameters and add to the query language that compares properties against the minimum price
  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);

    queryString += `
  ${whereOrAnd(queryParams)} cost_per_night >= $${queryParams.length} * 100`;
  }

  // If options includes a maximum price per night, add it to the parameters and add to the query language that compares properties against the maximum price
  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night}`);

    queryString += `
  ${whereOrAnd(queryParams)} cost_per_night <= $${queryParams.length} * 100`;
  }
  //If options include an owner ID, add it to the parameters and add to the query language to return properties with that owner ID
  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);

    queryString += `
  ${whereOrAnd(queryParams)} owner_id = $${queryParams.length}`;
  }

  // Add GROUP BY before possible HAVING statement using aggregate functions
  queryString += `
  GROUP BY properties.id`;

  // If options includes a minimum rating, compare against average_ratings using a HAVING query (which needs to go after GROUP BY)

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);

    queryString += `
  HAVING avg(property_reviews.rating) >= $${queryParams.length}`;
  }

  //Finish the query inserting the limit
  queryParams.push(limit);
  
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
`;

  return queryMultipleReturns(queryString, queryParams)
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const queryParams = [];
  queryParams.push(property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.street, property.city, property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms);

  return querySingleReturn(`INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;`, queryParams)
};
exports.addProperty = addProperty;
