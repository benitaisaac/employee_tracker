const inquirer = require('inquirer');
const fs = require('fs'); 
const mysql = require('mysql2');

//require template literals for SQL query 
const {viewDeptSql, viewRolesSql, viewEmployeesSql, addDeptSql} = require('./sql');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_db'
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
            'update an employee role'
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
        db.query(answers, (err, results) => {
          if (err) throw err;
          console.table(results);
        });
      })
      console.log("add a department");
      return

    case 'add a role':
      console.log("add a role");
      return
  
    case 'add an employee':
      console.log("add an employee");
      return
    
    case 'update an employee role':
      console.log("update an employee role");
      return

  }
  // fs.writeFile('testing.txt', mm.renderSvg(), function (err) {
  //   if (err) throw err;
  //   console.log('Saved!');
  // });
})
