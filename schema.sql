DROP DATABASE IF EXISTS EmpMan;
CREATE DATABASE EmpMan;
USE EmpMan;
UPDATE employee
SET role_id = 1  -- Assuming '1' is the new role_id
WHERE id = [employee_id];  -- Replace [employee_id] with the actual employee's ID you want to update.
INSERT INTO department (name) VALUES ('employee_role')



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
  FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Create the employee table
CREATE TABLE employee (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);
