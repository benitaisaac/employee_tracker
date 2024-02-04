-- WHEN I choose to view all roles
-- THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

-- SELECT title, role.id as role_id, salary, department.name as department
-- FROM role
-- JOIN department ON role.department_id = department.id;

-- WHEN I choose to view all employees
-- THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

-- SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager_id, manager.manager_first_name
-- FROM employee
-- JOIN role ON role.id = employee.role_id
-- JOIN department ON role.department_id = department.id
-- LEFT OUTER JOIN (SELECT employee.id as manager_id, employee.first_name as manager_first_name, employee.last_name as manager_last_name FROM employee) manager ON employee.manager_id = manager.manager_id;


-- Code for adding a new department: 
-- INSERT INTO department (name)
-- VALUES ('New Department');
-- SELECT * FROM department;

-- WHEN I choose to add a role
-- THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
-- INSERT INTO role (title, salary) VALUES ('new role title test', 1000000);
-- INSERT INTO department (name) VALUES ('new role dept name test'); 

-- WHEN I choose to add an employee
-- THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database


-- INSERT INTO employee (first_name, last_name, role_id, manager_id)
-- SELECT 'Brad', 'Bradley', role.id, employee.id
-- FROM role, employee
-- WHERE role.title = 'Financial Analyst' 
-- AND employee.first_name = 'Emily';

-- SELECT e.first_name AS employee_first_name, e.last_name AS employee_last_name, r.title AS role_title, m.first_name AS manager_first_name
-- FROM employee e
-- JOIN role r ON e.role_id = r.id
-- LEFT JOIN employee m ON e.manager_id = m.id
-- WHERE e.id = 4;

-- WHEN I choose to update an employee role
-- THEN I am prompted to select an employee to update and their new role and this information is updated in the database 

-- UPDATE employee
-- SET role_id = (SELECT role.id FROM role WHERE title = 'Hardware Engineer')
-- WHERE id = 2;


-- Code to view all roles
-- SELECT title FROM role;

-- To select a manager: 
SELECT DISTINCT manager.first_name
FROM employee AS employee
JOIN employee AS manager ON employee.manager_id = manager.id;