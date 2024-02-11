const viewDeptSql = 
`SELECT * FROM department`;

const viewRolesSql = 
`SELECT title, role.id as role_id, salary, department.name as department
FROM role
LEFT JOIN department ON role.department_id = department.id;`

const viewEmployeesSql = 
`SELECT employee.id as employee_id, employee.first_name, employee.last_name, role.title as job_title, department.name as department, role.salary, manager.manager_first_name
FROM employee
JOIN role ON role.id = employee.role_id
JOIN department ON role.department_id = department.id
LEFT OUTER JOIN (SELECT employee.id as manager_id, employee.first_name as manager_first_name, employee.last_name as manager_last_name FROM employee) manager ON employee.manager_id = manager.manager_id;`


//SQL code to add a new department 
const addDeptSql = 
`INSERT INTO department (name)
VALUES (?);
SELECT * FROM department;`;

//SQL code to add a role by entering name, salary and department 
//This is a prepare statement 
const addRoleSql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);`;

const addEmployeeSql = 
    `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    SELECT ?, ?, role.id, employee.id
    FROM role, employee
    WHERE role.id = ? 
    AND employee.id = ?`

// This code taken out of addEmployeeSql - 
// SELECT e.first_name AS employee_first_name, e.last_name AS employee_last_name, r.title AS role_title, m.first_name AS manager_first_name
//     FROM employee e
//     JOIN role r ON e.role_id = r.id
//     LEFT JOIN employee m ON e.manager_id = m.id
//     WHERE e.id = ${newEmployeeId};] 
    // return sql;

const updateEmployeeRole = 
    `UPDATE employee
    SET role_id = (SELECT role.id FROM role WHERE role.id = ?)
    WHERE id = ?;`


module.exports = {viewDeptSql, viewRolesSql, viewEmployeesSql, addDeptSql, addRoleSql, addEmployeeSql, updateEmployeeRole}