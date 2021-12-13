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
    err ? console.log(err) : console.log('View Departments'), console.table(res);
  });
}

function viewRoles() {
  connection.query((`SELECT * FROM role`), (err, res) => {
    err ? console.log(err) :  console.log('View Roles'), console.table(res);
  });
}


// SELECT first_name AS 'First Name', last_name AS 'Last Name', role.title AS 'Job Title', role.salary AS 'Salary', department.name AS 'Department', manager_id FROM employee JOIN role ON role_id = role.id JOIN department ON department_id = department.id;
function viewAllEmps() {
  connection.query((`SELECT employee.id, employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Job Title', role.salary AS 'Salary', department.name AS 'Department', CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employee JOIN role ON role_id = role.id JOIN department ON department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id ;`), (err, res) => {
    err ? console.log(err) :  console.log('View All Employees'), console.table(res);
  });
}

enterDatabase();
viewDepartments();
viewRoles();
viewAllEmps();