const inquirer = require("inquirer");
// use the promise versin of mysql
const mysql = require("mysql2/promise");

// require template literals for SQL query
const {
  viewDeptSql,
  viewRolesSql,
  viewEmployeesSql,
  addDeptSql,
  addRoleSql,
  addEmployeeSql,
  updateEmployeeRole,
} = require("./sql");

// Connect to database using an asyc/await function
let db;
(async function () {
  db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "employee_db",
    multipleStatements: true, // Enable multiple query execution
  });
  console.log("Connected to the employee_db");
})();

// main array of questions for the inquirer prompt
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

// nested inquirer to ask user specifics about adding a department
const addDeptInq = [
  {
    type: "input",
    name: "newDept",
    message: "Enter name for the new dept",
  },
];

// nested inquirer to ask user specifics about adding a role
// note that department is an empty array that we will populate with data from the database
const addRoleInq = [
  {
    type: "input",
    name: "roleName",
    message: "Enter name for the new role",
  },
  {
    type: "number",
    name: "salary",
    message: "Enter salary for the new role",
  },
  {
    type: "list",
    name: "department",
    message: "Enter the department ID for the new role",
    choices: [],
  },
];

// nested inquirer to ask user specifics about adding an employee
// roleTitle and managerName are empty arrays that we will populate with data from the database
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

// nested inquirer to ask user specifics about updating an employee
// both employee and employee role are empty arrays that we will populate with data from the database
const updateEmployeeInq = [
  {
    type: "list",
    name: "employee",
    message: "Which employee would you like to update?",
    choices: [],
  },
  {
    type: "list",
    name: "employeeRole",
    message: "What new role will this employee have?",
    choices: [],
  },
];

// main inquirer prompt as an async function
async function promptUser() {
  try {
    // await for the inquirer prompt and popuate with main questions array above
    const answers = await inquirer.prompt(questions);

    switch (answers.options) {
      case "view all departments": {
        // destructure rows element and only use first element of rows array
        const [rows] = await db.query(viewDeptSql);
        // display the table for the user to see
        console.table(rows);
        console.log("view all departments");
        //run inquirer again for user to select other options
        promptUser();
        break;
      }

      case "view all roles": {
        // destructure rows element and only use first element of rows array
        const [rows] = await db.execute(viewRolesSql);
        // display the table for the user to see
        console.table(rows);
        //run inquirer again for user to select other options
        promptUser();
        break;
      }

      case "view all employees": {
        // destructure rows element and only use first element of rows array
        const [rows] = await db.execute(viewEmployeesSql);
        // display the table for the user to see
        console.table(rows);
        //run inquirer again for user to select other options
        promptUser();
        break;
      }

      case "add a department": {
        // define addDept funtion as asynchronous
        async function addDept() {
          try {
            // await nested inquirer prompt
            const answers = await inquirer.prompt(addDeptInq);
            // display to user the name of the new dept that they chose
            console.log("new dept:", answers.newDept);
            // destructure rows element 
            //insert user input for newDept in SQL query through a prepared statement
            const [rows] = await db.query(addDeptSql, [answers.newDept]);
            console.log("All departments:");
            //display second element in rows array 
            console.table(rows[1]);
            console.log("Department aded successfully!");
            promptUser();
          } catch (error) {
            console.error(error.message);
          }
        }
        addDept();
        break;
      }

      case "add a role": {
        async function addRole() {
          try {
            // creating departments array by running viewDeptSql code and only getting the first value
            const [departments] = await db.query(viewDeptSql);
            // Mapping the departments array that we received above
            // Setting the list options in the addRoleInq array for the user to choose from
            addRoleInq[2].choices = departments.map((e) => e.name);
            // Destructuring so we can use roleName, salary, and department as variables
            const { roleName, salary, department } = await inquirer.prompt(
              addRoleInq
            );
            // When a user chooses the department, we will return back the id
            const depId = departments.find((e) => e.name === department).id;
            // Run the SQL query to add a new department to the table using the department ID that we generated above
            const [rows] = await db.query(addRoleSql, [
              roleName,
              salary,
              depId,
            ]);
            // Tell the user the role has been added and show the roles table
            console.log("congrats! Your new role has been added.");
            const roles = await db.query(viewRolesSql);
            console.table(roles[0]);
            // Give the user an option to perform another action
            promptUser();
          } catch (error) {
            console.error(error.message);
          }
        }
        addRole();
        break;
      }

      case "add an employee": {
        async function addEmployee() {
          try {
            const [roles] = await db.query(viewRolesSql);
            addEmployeeInq[2].choices = roles.map((e) => e.title);

            const [employees] = await db.query(viewEmployeesSql);
            addEmployeeInq[3].choices = employees.map((e) => e.first_name);

            // destructure the keys so we can use them as variables
            const {
              employeeFirstName,
              employeeLastName,
              roleTitle,
              managerName,
            } = await inquirer.prompt(addEmployeeInq);

            console.log(roles);
            console.log(employees);

            // when user selects a role, we will return back the role ID
            const roleId = roles.find((e) => e.title === roleTitle).role_id;
            const managerId = employees.find(
              (e) => e.first_name === managerName
            ).employee_id;

            //Run SQL to add employee to the table using the ID's we've generated from above
            const [rows] = await db.query(addEmployeeSql, [
              employeeFirstName,
              employeeLastName,
              roleId,
              managerId,
            ]);

            console.log(
              "Congrats! Your new employee has been added to the database"
            );
            const [viewEmployee] = await db.query(viewEmployeesSql);
            console.table(viewEmployee);
            promptUser();
          } catch (error) {
            console.error(error.message);
          }
        }
        addEmployee();
        break;
      }

      case "update an employee role": {
        async function updateEmployee() {
          try {
            //to populate the inquirer with the approprite list options: employee and roles
            const [employees] = await db.query(viewEmployeesSql);
            updateEmployeeInq[0].choices = employees.map((e) => e.first_name);

            const [roles] = await db.query(viewRolesSql);
            updateEmployeeInq[1].choices = roles.map((e) => e.title);

            const { employee, employeeRole } = await inquirer.prompt(
              updateEmployeeInq
            );

            const employeeId = employees.find(
              (e) => e.first_name === employee
            ).employee_id;
            const roleId = roles.find((e) => e.title === employeeRole).role_id;

            const [rows] = await db.query(updateEmployeeRole, [
              roleId,
              employeeId,
            ]);

            console.log("congrats! You have updated the employees info");
            promptUser();
          } catch (error) {
            console.error(error.message);
          }
        }
        updateEmployee();
        break;
      }
    }
  } catch (error) {
    console.error(error.message);
  }
}

promptUser();
