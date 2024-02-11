
INSERT INTO department (name)
VALUES
    ("Human Resources"),
    ("Sales"),
    ("Engineering"),
    ("Marketing"),
    ("IT"),
    ("Sales");

INSERT INTO role (title, salary, department_id)
	VALUES
    ('HR Manager', 60000, 1),
    ('Financial Analyst', 70000, 2),
    ('Marketing Specialist', 65000, 4),
    ('Software Engineer', 110000, 3),
    ('Sales Representative', 80000, 5),
    ('Hardware Engineer', 100000, 3);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
	VALUES
    ('John', 'Doe', 1, NULL),
    ('Jane', 'Smith', 2, NULL),
    ('Mike', 'Johnson', 3, NULL),
    ('Emily', 'Davis', 4, NULL),
    ('Alex', 'Brown', 5, NULL),
    ('Emma', 'Williams', 2, 2),
    ('Ryan', 'Miller', 6, NULL),
    ('Olivia', 'Jones', 2, 2),
    ('Ethan', 'Moore', 1, 1),
    ('Sophia', 'Wilson', 3, 3),
    ('Logan', 'Taylor', 2, 2),
    ('Ava', 'Anderson', 6, 6);