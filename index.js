const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');

const connection = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employees'
  },

  console.log(`Connected to employees database.`)
);

const choices = {
  type: 'list',
  name: 'checkA',
  message: 'What would you like to do?',
  choices: ['View All Employees', 'View Roles', 'View Departments', 'Add Department', 'Add Role', 'Add Employee', 'Exit']
}

function startIQ() {
  inquirer
    .prompt(choices)
    .then(answers => {
      switch (answers.checkA) {
        case 'View All Employees':
          console.log('Viewing All Employees');
          viewAllEmps();
          startIQ();
          break;
        case 'View Roles':
          viewRoles();
          startIQ();
          break;
        case 'View Departments':
          viewDepartments();
          startIQ();
          break;
        case 'Add Department':
          inquirer.prompt({
            type: 'input',
            name: 'new_dept',
            message: 'What is the name of the new department?'
          }).then(deptData => {
            const str = deptData.new_dept
            addDepartment(str);
          })
          break;
        case 'Add Role':
          inquirer.prompt([{
            type: 'input',
            name: 'new_role',
            message: 'What is the name of the role?'
          },
          {
            type: 'input',
            name: 'role_salary',
            message: `What is the salary?`
          },
          {
            type: 'confirm',
            name: 'deptCheck',
            message: `Would you like to view departments available?`
          },
          {
            type: 'none',
            name: 'Departments',
            message: viewDepartments,
            when: (answers) => answers.deptCheck == true,

          },
          {
            type: 'input',
            name: 'role_dept',
            message: `What department does this role falls under? Please use Department ID`
          }])
            .then(roleData => {
              const roleParams = [roleData.new_role, roleData.role_salary, roleData.role_dept]
              addRole(roleParams);
              return startIQ();
            })
      
          break;
        case 'Exit':
          exit();
          break;
      }
    }).then(console.log('Done'))




};



function enterDatabase() {
  connection.query((`USE employees;`), (err) => {
    if (err) {
      console.log(err);
    }
    // console.log('Connected to Data')
  });
}

function exit() {
  connection.end;
  inquirer.prompt({type: 'message', name: 'none', message: 'Press Enter to Finish'}).then(console.log('End'))

}


//View Department
function viewDepartments() {
  connection.query((`SELECT * FROM department`), (err, res) => {
    err ? console.log(err) : console.table(res), console.table('_________________________');
  });
}
//Add Department
function addDepartment(str) {
  connection.query((`INSERT INTO department(name) VALUES('${str}')`), (err, res) => {
    err ? console.log(err) : console.log('New Department Added'), console.table(`ID ${res.insertId} Department ${str}`)
  });
}
//View Role
function viewRoles() {
  connection.query((`SELECT * FROM role`), (err, res) => {
    err ? console.log(err) : console.table(res), console.table('_________________________');
  });
}
//Add Role
function addRole(roleParams) {
  connection.query((`INSERT INTO role(title, salary, department_id) VALUES(?,?,?)`), (roleParams), (err, res) => {
    err ? console.log(err) : console.table(res), console.table('_________________________');
  });
}


// SELECT first_name AS 'First Name', last_name AS 'Last Name', role.title AS 'Job Title', role.salary AS 'Salary', department.name AS 'Department', manager_id FROM employee JOIN role ON role_id = role.id JOIN department ON department_id = department.id;
function viewAllEmps() {
  connection.query((`SELECT employee.id AS 'ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Job Title', role.salary AS 'Salary', department.name AS 'Department', CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employee JOIN role ON role_id = role.id JOIN department ON department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id ;`), (err, res) => {
    err ? console.log(err) : console.table(res);
  });
}

//Add Role
function addEmployee(employeeParams) {
  connection.query((`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)`), (employeeParams), (err, res) => {
    err ? console.log(err) : console.table(res), console.table('_________________________');
  });
}


enterDatabase();
startIQ();
