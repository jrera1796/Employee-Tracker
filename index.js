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
  choices: ['View All Employees', 'View Roles', 'View Departments', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee', 'Exit']
}
function choiceChecker(answers) {

  switch (answers.checkA) {
    case 'View All Employees':
      viewAllEmps();
      break;

    case 'View Roles':
      viewRoles();
      break;

    case 'View Departments':
      viewDepartments();
      break;

    case 'Add Department':
      inquirer.prompt({
        type: 'input',
        name: 'new_dept',
        message: 'What is the name of the new department?'
      }).then(deptData => {
        noSpaceDepartment = deptData.new_dept.replace(/\s+/g, ' ').trim();
        const newDepartment = noSpaceDepartment
        addDepartment(newDepartment);
      })
      break;

    case 'Add Role':
      connection.promise().query('SELECT * FROM department').then(([rows]) => {
        const departments = rows.map(({ id, name }) => ({
          name: name,
          value: id
        }))
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
          type: 'list',
          name: 'role_dept',
          message: 'What department does this role falls under?',
          choices: departments
        }])
          .then(roleData => {
            noSpaceRoleName = roleData.new_role.replace(/\s+/g, ' ').trim();
            const roleParams = [noSpaceRoleName, roleData.role_salary, roleData.role_dept]
            addRole(roleParams);

          })
      });
      break;

    case 'Add Employee':
      connection.promise().query('SELECT * FROM employee').then(([rows]) => {
        const employees = rows.map(({ id, first_name, last_name }) => ({
          name: first_name + ' ' + last_name,
          value: id
        }));

        inquirer.prompt([{
          type: 'input',
          name: 'firstName',
          message: 'What is the first name of this employee?'
        },
        {
          type: 'input',
          name: 'lastName',
          message: `What is their last name?`
        }])
          .then(empData => {
            noSpacefirstName = empData.firstName.replace(/\s+/g, ' ').trim();
            noSpacelastName = empData.lastName.replace(/\s+/g, ' ').trim();
            const empParams = [noSpacefirstName, noSpacelastName]

            connection.promise().query('SELECT * FROM role').then(([rows]) => {
              const roles = rows.map(({ id, title }) => ({
                name: title,
                value: id
              }))

              inquirer.prompt({
                type: 'list',
                name: 'empRole',
                message: `What role is ${noSpacefirstName + ' ' + noSpacelastName} in?`,
                choices: roles
              }).then(data => {
                empParams.push(data.empRole)
                inquirer.prompt(
                  {
                    type: 'list',
                    name: 'empManager',
                    message: `Who does ${noSpacefirstName + ' ' + noSpacelastName} report to?`,
                    choices: employees
                  }).then(data => {
                    empParams.push(data.empManager)
                    const newEmployee = [{
                      'Name': empParams[0]+ ' ' +empParams[1],
                      'Role': roles[empParams[2] - 1].name,
                      'Manager': employees[empParams[3] - 1].name
                    }]
                    console.log('\n', 'Employee to be Added', '\n');
                    console.table(newEmployee)

                    inquirer.prompt({
                      type: 'list',
                      name: 'finalCheck',
                      message: 'Does everything look correct?',
                      choices: ["Yes, submit new employee", "No, I'd Like to start over"]
                    }).then(check => {
                      switch (check.finalCheck) {
                        case "Yes, submit new employee":
                          addEmployee(empParams)
                          break;

                        case "No, I'd Like to start over":
                          startIQ();
                          break;

                      }
                    })
                  })
              })
            })
          })
      })
      break;

    case 'Update Employee':
      connection.promise().query('SELECT * FROM employee').then(([rows]) => {
        const employees = rows.map(({ id, first_name, last_name }) => ({
          name: first_name + ' ' + last_name,
          value: id
        }))
        inquirer.prompt({
          type: 'list',
          name: 'updateWho',
          message: 'Which employee would you like to update?',
          choices: employees

        }).then(data => {

          const updatedEmp = [data.updateWho]

          connection.promise().query('SELECT * FROM role').then(([rows]) => {
            const roles = rows.map(({ id, title }) => ({
              name: title,
              value: id
            }))

            inquirer.prompt({
              type: 'list',
              name: 'empRole',
              message: `What is the new role?`,
              choices: roles
            }).then(data => {
              updatedEmp.push(data.empRole)

              updateEmployee(updatedEmp)
            })
          })
        })
      })
      break;
    case 'Exit':
      exit();
      break;
  }
};

function startIQ() {
  inquirer
    .prompt(choices)
    .then(answers => {
      choiceChecker(answers)
    });
};
//Use Database
function enterDatabase() {
  connection.query((`USE employees;`), (err) => {
    if (err) {
      console.log(err);
    }
  });
}

//Exit Connection
function exit() {
  connection.end;
  console.log('Goodbye!')
  // This will exit after 1 second, with signal 1
  setTimeout((function () {
    return process.exit(1);
  }), 1000);
}

// View Department
function viewDepartments() {
  connection.query((`SELECT * FROM department`), (err, res) => {
    if (err) {
      throw err
    }
    else {
      console.table(res)
      startIQ();
    }
  });
}

//Add Department
function addDepartment(newDepartment) {
  newString = newDepartment.replace(/\s+/g, ' ').trim();

  if (newString === "" || null) {
    console.log('\n', 'Please enter a department name', '\n');
    startIQ();

  }
  else {
    connection.query((`INSERT INTO department(name) VALUES('${newString}')`), (err, res) => {
      if (err) {
        throw err;
      }
      else {
        const new_department = [{
          'Department': newString
        }]
        console.log('\n', 'New Department Added', '\n');
        console.table(new_department)
        startIQ();
      }
    });
  }
}

//View Role
function viewRoles() {
  connection.query((`SELECT * FROM role`), (err, res) => {
    if (err) {
      throw err;
    }
    else {
      console.table(res)
      startIQ();
    }
  });
}

//Add Role
function addRole(roleParams) {
  connection.query((`INSERT INTO role(title, salary, department_id) VALUES(?,?,?)`), (roleParams), (err, res) => {
    if (err) {
      console.log('\n', 'Please enter a valid salary', '\n');
      startIQ();
    }
    else {
      connection.query((`SELECT * FROM department WHERE ID = ${roleParams[2]}`), (err, res) => {
        if (err) {
          throw err
        }
        const newRole = [{
          'Role': roleParams[0],
          'Salary': roleParams[1],
          'Department': res[0].name
        }]
        console.log('\n', 'New Role Added', '\n');
        console.table(newRole);
        startIQ();
      })
    }
  })
}

//View Employees
function viewAllEmps() {
  connection.query((`SELECT employee.id AS 'ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Job Title', role.salary AS 'Salary', department.name AS 'Department', CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employee JOIN role ON role_id = role.id JOIN department ON department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id ;`), (err, res) => {
    if (err) {
      throw err
    }
    else {
      console.table(res)
      startIQ();
    }
  });
}

//Add Employee
function addEmployee(empParams) {
  connection.query((`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)`), (empParams), (err, res) => {
    if (err) {
      throw err
    }
    else {
      const newEmployeePrint = [{
        'Employee': empParams[0] + ' ' + empParams[1],
      }]
      console.log('\n', 'New Employee Added', '\n');
      console.table(newEmployeePrint);
      startIQ();
    }
  });
};

//Update Employee
// updatedEmpRev = updatedEmp.reverse();
//connection.query((`UPDATE employee SET role_id = ? WHERE id = ?`), (updatedEmpRev)

function updateEmployee(updatedEmp) {
  const employeeU = []
  connection.query((`SELECT * FROM employee WHERE id = ${updatedEmp[0]}`), (err, res) => {
    if (err) {
      throw err;
    } else {
      employeeU.push(res[0].first_name, res[0].last_name);
      connection.query((`SELECT * FROM role WHERE id = ${updatedEmp[1]}`), (err, res) => {
        if (err) {
          throw err;
        }
        else {
          employeeU.push(res[0].title)
          updatedEmpRev = updatedEmp.reverse();
          connection.query((`UPDATE employee SET role_id = ? WHERE id = ?`), (updatedEmpRev), (err) => {
            if (err) {
              throw err;
            }
            else {
              const updatedEmployeePrint = [{
                'Employee': employeeU[0] + ' ' + employeeU[1],
                'New Role': employeeU[2]
              }]
              console.log('\n', 'Employee Updated', '\n');
              console.table(updatedEmployeePrint);
              startIQ();
            }
          })
        }
      })
    }
  });
};


enterDatabase();
startIQ();
