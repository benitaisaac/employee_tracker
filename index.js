const inquirer = require("inquirer");
const mysql = require("mysql2/promise");

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
    type: "number",
    name: "salary",
    message: "Enter salary for the new role",
  },
  {
    type: "list",
    name: "department",
    message: "Enter the department ID for the new role",
    choices: []
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
  }
];

const updateEmployeeInq = [
  {
    type: "list",
    name: "employee",
    message: "Which employee would you like to update?",
    choices: []
  },
  {
    type: "list",
    name: "employeeRole",
    message: "What new role will this employee have?",
    choices: []
  },
];

//TODO: make a function that will pull all the roles from the database and display that as the list for adding an employee
// async function allTitles() {
//   try {
//   // let managers;

//   let [result] = await db.query(`SELECT title FROM role;`);
//     // Extract the titles from the query results
//     // const title = result.map((row) => row.title);
//     // titles = result;
//     return result.map((e) => e.title );
//   } catch (err) {
//     throw err;
//   }

    // db.query(
    //   `SELECT DISTINCT manager.first_name
    // FROM employee
    // JOIN employee AS manager ON employee.manager_id = manager.id;`,
    //   (err, results) => {
    //     if (err) throw err;
    //     const result = results.map((row) => row.first_name);
    //     managers = result;
    //     console.log(managers);
    //   }
    // );
  // };

//for testing, it WORKS?!
// allTitles();

async function promptUser() {
  try {
    const answers = await inquirer.prompt(questions);
    let rows, fields;

    switch (answers.options) {
      case "view all departments":
        [rows, fields] = await db.query(viewDeptSql);
        console.table(rows);
        // db.query(viewDeptSql, (err, results) => {
        //   if (err) throw err;
        //   console.table(results);
        // });
        console.log("view all departments");
        promptUser();
        break;

      case "view all roles":
        [rows, fields] = await db.execute(viewRolesSql);
        console.table(rows);
        // TODO: see what fields does and if i want it
        console.log(fields);
        // console.log("view all roles");
        promptUser();
        break;

      case "view all employees":
        [rows, fields] = await db.execute(viewEmployeesSql);
        console.table(rows);
        // console.log("view all employees");
        promptUser();
        break;

      case "add a department":
        async function addDept() {
          try {
            const answers = await inquirer.prompt(addDeptInq);
            console.log("new dept:", answers.newDept);

            const sql = addDeptSql(answers.newDept);
            [rows, fields] = await db.query(sql, [answers.newDept]);
            console.log("All departments:");
            console.table(rows[1]);
            console.log("Department aded successfully!");
            promptUser();
          } catch (error) {
            console.error(error.message);
          }
        }
        addDept();
        break;

      case "add a role": {
        async function addRole() {
          try {
            // creating var departments by running viewDeptSql code and only getting the first value 
            const [departments] = await db.query(viewDeptSql)
            // Mapping the departments array that we received above
            // Setting the list options in the addRoleInq array for the user to choose from
            addRoleInq[2].choices = departments.map((e) => e.name)
            // Destructuring so we can use roleName, salary, and department as variables 
            const {roleName, salary, department} = await inquirer.prompt(addRoleInq);
            // When a user chooses the department, we will return back the id
            const depId = departments.find((e) => e.name === department).id
            // Run the SQL query to add a new department to the table using the department ID that we generated above 
            const [rows] = await db.query(addRoleSql, [roleName, salary, depId])
            // Tell the user the role has been added and show the roles table 
            console.log("congrats! Your new role has been added.")
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

      //Note that this one only works right now if we enter the role and the manager name exactly as it's supposed to be added.
      //I wont change that because I need to change 'input' to 'list' for the inquirer
      case "add an employee": {
        async function addEmployee() {
          try {
            const [roles] = await db.query(viewRolesSql);
            addEmployeeInq[2].choices = roles.map((e) => e.title);

            const [employees] = await db.query(viewEmployeesSql)
            addEmployeeInq[3].choices = employees.map((e) => e.first_name);

            // destructure the keys so we can use them as variables 
            const {employeeFirstName, employeeLastName, roleTitle, managerName} = await inquirer.prompt(addEmployeeInq);

            console.log(roles);
            console.log(employees);

            // when user selects a role, we will return back the role ID
            const roleId =  roles.find((e) => e.title === roleTitle).role_id;
            const managerId = employees.find((e) => e.first_name === managerName).employee_id;

            //Run SQL to add employee to the table using the ID's we've generated from above 
            const [rows] = await db.query(addEmployeeSql, [employeeFirstName, employeeLastName, roleId, managerId]);

            console.log("Congrats! Your new employee has been added to the database");
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

            const {employee, employeeRole} = await inquirer.prompt(updateEmployeeInq);

            const employeeId = employees.find((e) => e.first_name === employee).employee_id;
            const roleId = roles.find((e) => e.title === employeeRole).role_id;

            const [rows] = await db.query(updateEmployeeRole, [roleId, employeeId]);


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