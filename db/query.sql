-- WHEN I choose to view all roles
-- THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

SELECT title, role.id, salary, department.name, department.id 
FROM role
JOIN department ON role.department_id = department.id;

-- WHEN I choose to view all employees
-- THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager_id, manager.manager_first_name
FROM employee
JOIN role ON role.id = employee.role_id
JOIN department ON role.department_id = department.id
LEFT OUTER JOIN (SELECT employee.id as manager_id, employee.first_name as manager_first_name, employee.last_name as manager_last_name FROM employee) manager ON employee.manager_id = manager.manager_id;

