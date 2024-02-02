const viewDeptSql = 
`SELECT * FROM department`;

const viewRolesSql = 
`SELECT title, role.id as role_id, salary, department.name as department
FROM role
JOIN department ON role.department_id = department.id;`

const viewEmployeesSql = 
`SELECT employee.id as employee_id, employee.first_name, employee.last_name, role.title as job_title, department.name as department, role.salary, manager.manager_first_name
FROM employee
JOIN role ON role.id = employee.role_id
JOIN department ON role.department_id = department.id
LEFT OUTER JOIN (SELECT employee.id as manager_id, employee.first_name as manager_first_name, employee.last_name as manager_last_name FROM employee) manager ON employee.manager_id = manager.manager_id;`


// TODO: change 'new dept' to a variable name
const addDeptSql = (newDept) => {
return `INSERT INTO department (name)
VALUES ('${newDept}');
SELECT * FROM department;`
}

module.exports = {viewDeptSql, viewRolesSql, viewEmployeesSql, addDeptSql}