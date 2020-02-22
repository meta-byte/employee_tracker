USE employee_management_db;

-- Department Seeds
INSERT INTO department (name)
VALUES ("Engineering");

INSERT INTO department (name)
VALUES ("Human Resources");

INSERT INTO department (name)
VALUES ("Customer Service");

-- Role Seeds
INSERT INTO role (title, salary, department_id)
VALUES ("Director of Product", 150000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Senior Developer", 100000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Junior Developer", 60000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Human Resources Director", 120000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Receptionist", 40000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Talent Aquisition Specialist", 50000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Customer Support Specialist", 120000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Accounts Payable Specialist", 40000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Team Lead", 70000, 3);

-- Employee Seeds

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Quintin", "Smith", 2, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Garrett", "Howard", 3, 1);

INSERT INTO employee (first_name, last_name, role_id,)
VALUES ("Riley", "Barlow", 1);