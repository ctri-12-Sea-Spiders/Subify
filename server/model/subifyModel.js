const { Pool } = require('pg');

//URI for Elephant SQL (If not using this one then you will need to manually setup some tables for everything to work)
const PG_URI = 'postgres://avpneekp:5fsMVQDkJ7HCwrlILZCF7UhKklrdJ1OI@heffalump.db.elephantsql.com/avpneekp';

const pool = new Pool({
  connectionString: PG_URI
});

module.exports = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  }
};