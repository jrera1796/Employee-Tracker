const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'local host',
  user: 'root',
  password: 'password'
});

connection.query('SELECT * FROM `${')

module.exports = connection;