DROP DATABASE IF EXISTS EmpMan;
CREATE DATABASE EmpMan;
USE EmpMan;

-- Create the department table
CREATE TABLE department (
   id INT PRIMARY KEY AUTO_INCREMENT,
   name VARCHAR(30)
);

-- Create the role table
CREATE TABLE role (
   id INT PRIMARY KEY AUTO_INCREMENT,
   title VARCHAR(30),
   salary DECIMAL,
   department_id INT,
   FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

-- Create the employee table with the department_id column
CREATE TABLE employee (
   id INT PRIMARY KEY AUTO_INCREMENT,
   first_name VARCHAR(30),
   last_name VARCHAR(30),
   role_id INT,
   manager_id INT,
   department_id INT, -- Add the department_id column here
   FOREIGN KEY (role_id) REFERENCES role(id),
   FOREIGN KEY (manager_id) REFERENCES employee(id),
   FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

-- Add reassignment and deletion of employees and role
-- First, identify employees associated with the role you want to delete
SELECT id FROM employee WHERE role_id = 6;

-- Then, update employees' roles to a new role or set it to NULL
-- Replace 'newRoleId' with the ID of the new role you want to assign them to, or use NULL to remove the role entirely
UPDATE employee
SET role_id = newRoleId
WHERE role_id = 6;

-- Delete employees (if needed)
-- Be very cautious, as this permanently removes employee records
DELETE FROM employee
WHERE role_id = 6;

-- Finally, delete the role from the role table
DELETE FROM role WHERE id = 6;
