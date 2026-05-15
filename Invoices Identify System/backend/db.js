const mysql = require('mysql2/promise');
const { database } = require('./config');

const pool = mysql.createPool({
  host: database.host,
  user: database.user,
  password: database.password,
  database: database.database
});

module.exports = pool;