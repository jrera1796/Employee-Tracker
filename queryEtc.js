const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'local host',
  user: 'root',
  password: 'password',
  database: 'employees'
});

connection.query(`SELECT * FROM employee`)

module.exports = connection;