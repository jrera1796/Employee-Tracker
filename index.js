const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'local host',
  user: 'root',
  password: 'password',
  database: 'employee'
});

function enterDatabase(){
connection.query(('SHOW DATABASES;'), (err, res) => {
  if(err){
    console.log(err);
  }else{
    console.log(res);
  }
});
connection.query(('USE employee;'), (err, res) => {
  if(err){
    console.log(err);
  }else{
    console.log(res);
  }
});
};

connection.query(('SELECT * FROM `employee`;'), (err, res) => {
  res ? console.table(err) : console.log(res);
});

enterDatabase();