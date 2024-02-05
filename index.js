const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");

//require template literals for SQL query
const {
  viewDeptSql,
  viewRolesSql,
  viewEmployeesSql,
  addDeptSql,
  addRoleSql,
  addEmployeeSql,
  updateEmployeeRole,
} = require("./sql");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "employee_db",
    multipleStatements: true, // Enable multiple query execution
  },
  console.log("Connected to the employee_db")
);

const questions = [
  {
    type: "list",
    name: "options",
    message: "What would you like to do?",
    choices: [
      "view all departments",
      "view all roles",
      "view all employees",
      "add a department",
      "add a role",
      "add an employee",
      "update an employee role",
      "exit",
    ],
  },
];

const addDeptInq = [
  {
    type: "input",
    name: "newDept",
    message: "Enter name for the new dept",
  },
];

const addRoleInq = [
  {
    type: "input",
    name: "roleName",
    message: "Enter name for the new role",
  },
  {
    type: "input",
    name: "salary",
    message: "Enter salary for the new role",
  },
  {
    type: "input",
    name: "department",
    message: "Enter department for new role",
  },
];

const addEmployeeInq = [
  {
    type: "input",
    name: "employeeFirstName",
    message: "Enter first name of new employee",
  },
  {
    type: "input",
    name: "employeeLastName",
    message: "Enter last name of new employee",
  },
  {
    type: "list",
    name: "roleTitle",
    message: "What is this employee role?",
    choices: [],
  },
  {
    type: "list",
    name: "managerName",
    message: "Who is the manager?",
    choices: [],
  },
];

const updateEmployeeInq = [
  {
    type: "input",
    name: "employeeId",
    message: "Enter the ID of the employee that you would like to update",
  },
  {
    type: "list",
    name: "employeeRole",
    message: "What new role will this employee have?",
    choices: [
      "HR Manager",
      "Financial Analyst",
      "Marketing Specialist",
      "Software Engineer",
      "Sales Representative",
      "Hardware Engineer",
    ],
  },
];
// Create arrays for list options
const roleTitles = () => {
  return new Promise((resolve, reject) => {
    let titles, managers;
    db.query(`SELECT title FROM role;`, (err, results) => {
      if (err) throw err;
      // Extract the titles from the query results
      const result = results.map((row) => row.title);
      // console.log(results);
      // console.log(titles);
      titles = result;
      db.query(
        `SELECT DISTINCT manager.first_name
      FROM employee
      JOIN employee AS manager ON employee.manager_id = manager.id;`,
        (err, results) => {
          if (err) throw err;
          const result = results.map((row) => row.first_name);
          managers = result;
          resolve({ titles, managers });
        }
      );
    });
  });
};

async function promptUser() {
  try {
    const answers = await inquirer.prompt(questions);
    switch (answers.options) {
      case "view all departments":
        db.query(viewDeptSql, (err, results) => {
          if (err) throw err;
          console.table(results);
        });
        console.log("view all departments");
        promptUser();

      case "view all roles":
        db.query(viewRolesSql, (err, results) => {
          if (err) throw err;
          console.table(results);
        });
        // console.log("view all roles");
        promptUser();

      case "view all employees":
        db.query(viewEmployeesSql, (err, results) => {
          if (err) throw err;
          console.table(results);
        });
        console.log("view all employees");
        promptUser();

      case "add a department":
        async function addDept() {
          try {
            const answers = await inquirer.prompt(addDeptInq);
            console.log("new dept:", answers.newDept);
            db.query(addDeptSql(answers.newDept), (err, results) => {
              if (err) throw err;
              console.table(results[1]);
            });
          } catch (error) {
            console.error(error.message);
          }
        }
        addDept();
        promptUser();

      case "add a role":
        async function addRole() {
          try {
            const answers = await inquirer.prompt(addRoleInq);
            const sqlStatements = addRoleSql(
              answers.roleName,
              answers.salary,
              answers.department
            );
            sqlStatements.forEach((sql) => {
              db.query(sql, (err, results) => {
                if (err) throw err;
                console.log(
                  "Congrats! Your new role has been added to the database. View the new title and salary below."
                );
                // TODO: combine tables so that title, salary, and dept show on printed table
                console.table(results[2]);
              });
            });
          } catch (error) {
            console.error(error.message);
          }
        }
        addRole();
    }
  } catch (error) {
    console.error(error.message);
  }
}
promptUser();

// inquirer
//   .prompt(questions)

//   .then((answers) => {
//     switch (answers.options) {
//       case "view all departments":
//         db.query(viewDeptSql, (err, results) => {
//           if (err) throw err;
//           console.table(results);
//         });
//         console.log("view all departments");
//         break;

//       case "view all roles":
//         db.query(viewRolesSql, (err, results) => {
//           if (err) throw err;
//           console.table(results);
//         });
//         console.log("view all roles");
//         return;

//       case "view all employees":
//         db.query(viewEmployeesSql, (err, results) => {
//           if (err) throw err;
//           console.table(results);
//         });
//         console.log("view all employees");
//         return;

//       case "add a department":
//         inquirer.prompt(addDeptInq).then((answers) => {
//           // console.log(answers.newDept);
//           db.query(addDeptSql(answers.newDept), (err, results) => {
//             if (err) throw err;
//             console.table(results[1]);
//           });
//         });
//         return;

// case "add a role":
//   inquirer.prompt(addRoleInq).then((answers) => {
//     // console.log(answers);
//     const sqlStatements = addRoleSql(
//       answers.roleName,
//       answers.salary,
//       answers.department
//     );
//     sqlStatements.forEach((sql) => {
//       db.query(sql, (err, results) => {
//         if (err) throw err;
//         console.log(
//           "Congrats! Your new role has been added to the database. View the new title and salary below."
//         );
//         console.table(results[2]);

//         // db.query(`SELECT title FROM role;`, (err, results) => {
//         //   if (err) throw err;
//         //   // Extract the titles from the query results
//         //   const titles = results.map((row) => row.title);
//         //   console.log('Titles:', titles);
//         //   // console.log(results);
//         //   return;
//         // })
//       });
//     });
//   });
//   return;

//       case "add an employee":
//         roleTitles().then(({ titles, managers }) => {
//           addEmployeeInq[2].choices = titles;
//           addEmployeeInq[3].choices = managers;
//           // console.log(addEmployeeInq[2]);
//           inquirer.prompt(addEmployeeInq).then((answers) => {
//             const sqlStatements = addEmployeeSql(
//               answers.employeeFirstName,
//               answers.employeeLastName,
//               answers.roleTitle,
//               answers.managerName
//             );
//             sqlStatements.forEach((sql) => {
//               db.query(sql, (err, results) => {
//                 if (err) throw err;
//                 console.log(
//                   "Congrats! Your new employee has been added to the database. View the employee, role title and manager below."
//                 );
//                 // console.table(results[1]);
//               });
//             });
//           });
//         });
//         return;

//       case "update an employee role":
//         inquirer.prompt(updateEmployeeInq).then((answers) => {
//           const sqlStatements = updateEmployeeRole(
//             answers.employeeId,
//             answers.employeeRole
//           );
//           sqlStatements.forEach((sql) => {
//             db.query(sql, (err, results) => {
//               if (err) throw err;
//               console.log("Congrats! This employees role was updated.");

//               db.query(`SELECT title FROM role`);

//               // console.table(results);
//             });
//           });
//         });
//         return;

//       case "exit":
//         process.exit();
//     }
//   });
