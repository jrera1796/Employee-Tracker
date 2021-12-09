const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');


const connection = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employees'
  }
  // },
  // console.log(`Connected to employees database.`)
);

function enterDatabase() {
  connection.query((`USE employees;`), (err) => {
    if (err) {
      console.log(err);
    }
  });
}


function viewDepartments() {
  connection.query((`SELECT * FROM department`), (err, res) => {
    err ? console.log(err) : console.table(res);
  });
}

function viewRoles() {
  connection.query((`SELECT * FROM role`), (err, res) => {
    err ? console.log(err) : console.table(res);
  });
}
// SELECT first_name, last_name, role.title, role.salary  FROM employee JOIN role ON role_id = role.id ;  

// function viewAllEmps(){
//   connection.query((`SELECT employee.first, employee.last_name FROM employee, employee.manager_id AS `), (err, res) => {
//     err ? console.log(err) : console.log(res);
//   });
// }

function viewAllEmps() {
  connection.query((`SELECT first_name, last_name, role.title, role.salary  FROM employee JOIN role ON role_id = role.id;`), (err, res) => {
    err ? console.log(err) : console.table(res);
  });
}

enterDatabase();
viewDepartments();
viewRoles();
viewAllEmps();