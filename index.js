const inquirer = require('inquirer');
const fs = require('fs'); 
const mysql = require('mysql2');

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
      //TODO: set this code in query.sql and import module to this
      const viewDeptSql = `SELECT * FROM department`;
      db.query(viewDeptSql, (err, results) => {
        if (err) throw err;
        console.table(results);
      }); 
      console.log("view all departments");
      break
    
    case 'view all roles':
      const viewRoleSql = `SELECT * FROM role`;
      db.query(viewRoleSql, (err, results) => {
        if (err) throw err;
        console.table(results);
      }); 
      console.log("view all roles");
      return

    case 'view all employees':
      const viewEmployeeSql = `SELECT * FROM employee`;
      db.query(viewEmployeeSql, (err, results) => {
        if (err) throw err;
        console.table(results);
      }); 
      console.log("view all employees");
      return

    case 'add a department':
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
