INSERT INTO department(name)
VALUES('Sales'),
('Operations'),
('Receiving');


INSERT INTO role(title, salary, department_id)
VALUES('Sales Manager', 70000, 1),
('Operations Manager', 65000, 2),
('Warehouse Associate', 32000, 3);


INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES('John', 'Doe', 1, NULL),
('Alex', 'Jones', 2, NULL),
('Michael', 'Doe', 3, 1),
('Kyle', 'Savage', 3, 2),
('Adam', 'Mayfield', 3, 1);