const mySql = require("mysql2");

const pool = mySql.createPool({
  host: "localhost",
  user: "root",
  password: "damir1611",
  database: "echod_data_base",
});

module.exports = pool.promise();
