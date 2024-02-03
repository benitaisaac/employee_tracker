const inquirer = require('inquirer');
const fs = require('fs'); 
const mysql = require('mysql2');

//require template literals for SQL query 
const {viewDeptSql, viewRolesSql, viewEmployeesSql, addDeptSql, addRoleSql, addEmployeeSql, updateEmployeeRole} = require('./sql');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_db',
    multipleStatements: true, // Enable multiple query execution
  },
  console.log('Connected to the employee_db')
);

const questions = [
    {
        type: 'list',
        name: 'options',
        message: 'What would you like to do?',
        choices: [
            'view all departments',
            'view all roles',
            'view all employees',
            'add a department',
            'add a role',
            'add an employee',
            'update an employee role',
            'exit'
        ]
    }
]

const addDeptInq = [
    {
      type: 'input',
      name: 'newDept',
      message: 'Enter name for the new dept',
  },
]

const addRoleInq = [
  {
    type: 'input',
    name: 'roleName',
    message: 'Enter name for the new role',
  },
  {
    type: 'input',
    name: 'salary',
    message: 'Enter salary for the new role',
  },
  {
    type: 'input',
    name: 'department',
    message: 'Enter department for new role',
  }
]

const addEmployeeInq = [
  {
    type: 'input',
    name: 'employeeFirstName',
    message: 'Enter first name of new employee',
  },
  {
    type: 'input',
    name: 'employeeLastName',
    message: 'Enter last name of new employee',
  },
  {
    type: 'input',
    name: 'roleTitle',
    message: 'Enter role title (ex: Financial Analyst, HR Manager, Software Engineer, etc. ',
  },
  {
    type: 'input',
    name: 'managerName',
    message: 'Enter manager name (ex: John, Jane, Mike etc. ',
  }
]

const updateEmployeeInq = [
  {
    type: 'input',
    name: 'employeeId',
    message: 'Enter the ID of the employee that you would like to update',
  },
  {
    type: 'list',
    name: 'employeeRole',
    message: 'What new role will this employee have?',
    choices: [
        'HR Manager',
        'Financial Analyst', 
        'Marketing Specialist', 
        'Software Engineer', 
        'Sales Representative',
        'Hardware Engineer'
    ]
  }
]
inquirer
.prompt(questions)

.then((answers) => {
  switch(answers.options){
    case 'view all departments':
      db.query(viewDeptSql, (err, results) => {
        if (err) throw err;
        console.table(results);
      }); 
      console.log("view all departments");
      break
    
    case 'view all roles':
      db.query(viewRolesSql, (err, results) => {
        if (err) throw err;
        console.table(results);
      }); 
      console.log("view all roles");
      return

    case 'view all employees':
      db.query(viewEmployeesSql, (err, results) => {
        if (err) throw err;
        console.table(results);
      }); 
      console.log("view all employees");
      return

    case 'add a department':
      inquirer
      .prompt(addDeptInq)
      .then((answers) => {
        // console.log(answers.newDept);
        db.query(addDeptSql(answers.newDept), (err, results) => {
          if (err) throw err;
          console.table(results[1]);
        });
      })
      return

    case 'add a role':
      inquirer
      .prompt(addRoleInq)
      .then((answers) => {
        // console.log(answers);
        const sqlStatements = addRoleSql(answers.roleName, answers.salary, answers.department);
      sqlStatements.forEach((sql) => {
        db.query(sql, (err, results) => {
          if (err) throw err;
          console.log('Congrats! Your new role has been added to the database. View the new title and salary below.')
          console.table(results[2]);
        })
        });
      })
      return
  
//       WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
    case 'add an employee':
      inquirer
      .prompt(addEmployeeInq)
      .then((answers) => {
        const sqlStatements = addEmployeeSql(answers.employeeFirstName, answers.employeeLastName, answers.roleTitle, answers.managerName);
      sqlStatements.forEach((sql) => {
        db.query(sql, (err, results) => {
          if (err) throw err;
          console.log('Congrats! Your new employee has been added to the database. View the employee, role title and manager below.')
          // console.table(results[1]);
        })
        });
      })
      return
    
    case 'update an employee role':
      inquirer
      .prompt(updateEmployeeInq)
      .then((answers) => {
        const sqlStatements = updateEmployeeRole(answers.employeeId, answers.employeeRole);
      sqlStatements.forEach((sql) => {
        db.query(sql, (err, results) => {
          if (err) throw err;
          console.log('Congrats! This employees role was updated.')
          console.table(results);
        })
        });
      })
      return

      case 'exit':
        process.exit();

  }

  // fs.writeFile('testing.txt', mm.renderSvg(), function (err) {
  //   if (err) throw err;
  //   console.log('Saved!');
  // });
})
