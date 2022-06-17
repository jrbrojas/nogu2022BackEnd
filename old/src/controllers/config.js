const { Pool, defaults } = require("pg");
const envJson = require("../env.json");
const port = process.env.PORT || 3000;

//PRODUCCION
process.env = envJson["qa"];

//DESARROLLO
//process.env = envJson['dev']

process.env.PORT = port;

const pool = new Pool({
  host: process.env.hostDB,
  user: process.env.userDB,
  password: process.env.passwordDB,
  database: process.env.databaseDB,
  port: process.env.portDB,
  /*ssl: {
    rejectUnauthorized: false,
  },*/
});

module.exports = pool;
