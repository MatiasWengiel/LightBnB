const { query } = require('./pglink');

// Used for queries that return a single item (result.rows[0]). DRY up repeated query definitions
const querySingleReturn = (queryString, queryParams) => {
  return query(queryString, queryParams)
    .then((result) => {
      return result.rows.length > 0 ? result.rows[0] : null;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// Used for queries that return multiple items (result.rows). DRY up repeated query functions
const queryMultipleReturns = (queryString, queryParams) => {
  return query(queryString, queryParams)
    .then((result) => {
      return result.rows.length > 0 ? result.rows : null;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

//Determine if the first word in a query should be WHERE or AND. Used in queries that are built dynamically
const whereOrAnd = (queryParams) => {
  let queryString = '';
  if (queryParams.length === 1) {
    queryString += `WHERE `;
  } else {
    queryString += `AND `;
  }
  return queryString;
};

module.exports = {
  querySingleReturn,
  queryMultipleReturns,
  whereOrAnd
};