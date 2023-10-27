import cfonts from 'cfonts';
import inquirer from 'inquirer';
import mysql from 'mysql2';
import Table from 'cli-table';
// Set up the MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'EmpMan'
});

// Connect to the database
connection.connect();





function displayEmployeeManagerText() {
  cfonts.say('Employee\nManager', { // Use "\n" to add a line break
    font: 'block',
    align: 'left',
    colors: ['system'],
    background: 'transparent',
    letterSpacing: 1,
    lineHeight: 1, // Adjust the lineHeight value for more or less space
    space: true,
    maxLength: '0',
    gradient: false,
    independentGradient: false,
    transitionGradient: false,
    env: 'node',
  });
}


displayEmployeeManagerText();

function viewAllEmployees() {
  const sql = 'SELECT employee.first_name, employee.last_name, role.title, role.salary, employee.manager_id FROM employee LEFT JOIN role ON employee.role_id = role.id'; // Replace 'employee' with the actual table name

  // Run the SQL query to fetch all employees
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return;
    }

    // Display the list of employees in a formatted way (you can use console.table)
    console.table(results);

    // Call the function to continue with user prompts
    promptUser();
  });
}

function viewAllDepartments() {
  const sql = 'SELECT * FROM department'; // Replace 'employee' with the actual table name

  // Run the SQL query to fetch all employees
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return;
    }

    // Display the list of employees in a formatted way (you can use console.table)
    console.table(results);

    // Call the function to continue with user prompts
    promptUser();
  });
}




function addEmployee() {
  // Fetch a list of roles from the database
  connection.query('SELECT id, title FROM role', (err, roles) => {
    if (err) {
      console.error('Error querying database for roles:', err);
      return;
    }

    const roleChoices = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    inquirer
      .prompt([
        {
          type: 'input',
          name: 'first_name',
          message: "Enter the employee's first name:",
        },
        {
          type: 'input',
          name: 'last_name',
          message: "Enter the employee's last name:",
        },
        {
          type: 'list',
          name: 'role_id',
          message: "Select the employee's role:",
          choices: roleChoices,
        },
        {
          type: 'input',
          name: 'manager_id',
          message: "Enter the employee's manager ID (if applicable):",
        },
        {
          type: 'input',
          name: 'department_id',
          message: "Enter the employee's department ID:",
        },
      ])
      .then((answers) => {
        // Continue with the code to insert the new employee into the database
        const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id, department_id) VALUES (?, ?, ?, ?, ?)';
        const values = [
          answers.first_name,
          answers.last_name,
          answers.role_id,
          answers.manager_id || null,
          answers.department_id,
        ];

        // Run the SQL query to add the employee
        connection.query(sql, values, (err, results) => {
          if (err) {
            console.error('Error adding employee to the database:', err);
            return;
          }

          console.log('Employee added successfully!');
          promptUser();
        });
      });
  });
}








// Define functions for other options (e.g., update employee role, view roles, etc.)

function quit() {
  connection.end();
  console.log('Goodbye!');
}



function updateEmployeeRole() {
  // Fetch a list of employees from the database
  connection.query('SELECT id, first_name, last_name FROM employee', (err, employeeData) => {
    if (err) {
      console.error('Error querying database for employee list:', err);
      return;
    }

    const employeeChoices = employeeData.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employee_id',
          message: 'Select the employee whose role you want to update:',
          choices: employeeChoices,
        },
        {
          type: 'input',
          name: 'new_role_id',
          message: 'Enter the new role ID for the employee:',
        },
      ])
      .then((answers) => {
        const sql = 'UPDATE employee SET role_id = ? WHERE id = ?';
        const values = [answers.new_role_id, answers.employee_id];

        // Run the SQL query to update the employee's role
        connection.query(sql, values, (err, results) => {
          if (err) {
            console.error('Error changing employee role', err);
            return;
          }

          console.log('Employee role changed!');

          // Call the function to continue with user prompts
          promptUser();
        });
      });
  });
}

function removeEmployee() {
  // Fetch a list of employees from the database
  connection.query('SELECT id, first_name, last_name FROM employee', (err, employeeData) => {
    if (err) {
      console.error('Error querying database for employee list:', err);
      return;
    }

    const employeeChoices = employeeData.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employee_id',
          message: 'Select the employee you want to remove:',
          choices: employeeChoices,
        },
      ])
      .then((answers) => {
        const sql = 'DELETE FROM employee WHERE id = ?';
        const values = [answers.employee_id];

        // Run the SQL query to remove the employee
        connection.query(sql, values, (err, results) => {
          if (err) {
            console.error('Error removing employee', err);
            return;
          }

          console.log('Employee removed!');

          // Call the function to continue with user prompts
          promptUser();
        });
      });
  });
}




function viewAllRoles() {
  const sql = 'SELECT * FROM role'; 

  // Run the SQL query to fetch all employees
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return;
    }

    // Display the list of employees in a formatted way (you can use console.table)
    console.table(results);

    // Call the function to continue with user prompts
    promptUser();
  });
}

function removeRole() {
  // Fetch a list of roles from the database
  connection.query('SELECT id, title FROM role', (err, roleData) => {
    if (err) {
      console.error('Error querying database for role list:', err);
      return;
    }

    const roleChoices = roleData.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'role_id',
          message: 'Select the role you want to remove:',
          choices: roleChoices,
        },
      ])
      .then((answers) => {
        const sql = 'DELETE FROM role WHERE id = ?';
        const values = [answers.role_id];

        // Run the SQL query to remove the role
        connection.query(sql, values, (err, results) => {
          if (err) {
            console.error('Error removing role', err);
            return;
          }

          console.log('Role removed!');

          // Call the function to continue with user prompts
          promptUser();
        });
      });
  });
}



function addRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: "What is the title of this role.",
      },
      {
        type: 'input',
        name: 'salary',
        message: "What is the salary for this role",
      },
      {
        type: 'input',
        name: 'department_id',
        message: "What is the department id for this role?",
      },
    ])
    .then((answers) => {
      const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
      const values = [
        answers.title,
        answers.salary,
        answers.department_id,
      ];

      // Check if the department_id exists in the department table before inserting
      connection.query('SELECT id FROM department WHERE id = ?', answers.department_id, (err, results) => {
        if (err) {
          console.error('Error checking department:', err);
          return;
        }
        if (results.length === 0) {
          console.error('Department with the provided ID does not exist.');
          return;
        }

        // Run the SQL query to add the role
        connection.query(sql, values, (err, results) => {
          if (err) {
            console.error('Error adding role to the database:', err);
            return;
          }

          console.log('Role added successfully!');

          // Call the function to continue with user prompts
          promptUser();
        });
      });
    });
}


function removeDepartment() {
  // Retrieve a list of available departments from the database
  const sql = 'SELECT id, name FROM department';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error retrieving departments from the database:', err);
      return;
    }

    // Transform the results into a format suitable for inquirer prompts
    const departmentChoices = results.map((department) => ({
      name: department.name,
      value: department.id,
    }));

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'department_id',
          message: 'Select the department you want to remove:',
          choices: departmentChoices,
        },
      ])
      .then((answers) => {
        const sql = 'DELETE FROM department WHERE id = ?';
        const values = [answers.department_id];

        // Run the SQL query to remove the selected department
        connection.query(sql, values, (err, results) => {
          if (err) {
            console.error('Error removing department from the database:', err);
            return;
          }

          console.log('Department removed successfully!');

          // Call the function to continue with user prompts
          promptUser();
        });
      });
  });
}







function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: "What is the department name",
      },
    ])
    .then((answers) => {
      const sql = 'INSERT INTO department (name) VALUES (?)';
      const values = [
        answers.name,
      ];

      // Run the SQL query to add the employee
      connection.query(sql, values, (err, results) => {
        if (err) {
          console.error('Error adding employee to the database:', err);
          return;
        }

        console.log('Department added successfully!');

        // Call the function to continue with user prompts
        promptUser();
      });
    });
}




export function seeEmployeesByDepartment() {
  // Fetch a list of departments from the database
  connection.query('SELECT id, name FROM department', (err, departmentData) => {
    if (err) {
      console.error('Error querying database for department list:', err);
      return;
    }

    const departmentChoices = departmentData.map((department) => ({
      name: department.name,
      value: department.id,
    }));

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'department_id',
          message: 'Select a department to see employees:',
          choices: departmentChoices,
        },
      ])
      .then((answers) => {
        // Fetch employees by department
        connection.query(
          'SELECT e.id, e.first_name, e.last_name, r.title, r.salary, e.manager_id FROM employee e INNER JOIN role r ON e.role_id = r.id WHERE e.department_id = ?',
          answers.department_id,
          (err, employeeData) => {
            if (err) {
              console.error('Error querying database for employee list:', err);
              return;
            }

            // Create a new table
            const table = new Table({
              head: ['(index)', 'first_name', 'last_name', 'title', 'salary', 'manager_id'],
            });

            employeeData.forEach((employee, index) => {
              table.push([index, employee.first_name, employee.last_name, employee.title, employee.salary, employee.manager_id]);
            });

            console.log(table.toString());

            // Call the function to continue with user prompts
            promptUser();
          }
        );
      });
  });
}




function updateEmployeeManager() {
  // Fetch a list of employees to choose a new manager from
  connection.query('SELECT id, first_name, last_name FROM employee', (err, employees) => {
    if (err) {
      console.error('Error querying database for employees:', err);
      return;
    }

    const employeeChoices = employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employee_id',
          message: 'Select the employee you want to update the manager for:',
          choices: employeeChoices,
        },
        {
          type: 'list',
          name: 'new_manager_id',
          message: 'Select the new manager for the employee:',
          choices: employeeChoices, // Choose from the list of employees
        },
      ])
      .then((answers) => {
        // Update the database with the new manager's ID for the selected employee
        const sql = 'UPDATE employee SET manager_id = ? WHERE id = ?';
        const values = [answers.new_manager_id, answers.employee_id];

        connection.query(sql, values, (err, results) => {
          if (err) {
            console.error('Error updating employee manager:', err);
            return;
          }

          console.log('Employee manager updated successfully!');

          // Call the function to continue with user prompts
          promptUser();
        });
      });
  });
}

function seeEmployeesByManager() {
  // Fetch a list of employees to choose a manager from
  connection.query('SELECT id, first_name, last_name FROM employee', (err, employees) => {
    if (err) {
      console.error('Error querying database for employees:', err);
      return;
    }

    const employeeChoices = employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'manager_id',
          message: 'Select a manager to see their employees:',
          choices: employeeChoices,
        },
      ])
      .then((answers) => {
        // Query the database to fetch employees reporting to the selected manager
        const sql = 'SELECT id, first_name, last_name FROM employee WHERE manager_id = ?';
        const values = [answers.manager_id];

        connection.query(sql, values, (err, employeeData) => {
          if (err) {
            console.error('Error querying database for employee list:', err);
            return;
          }

          console.log(`Employees reporting to the selected manager:`);
          console.table(employeeData); // Display the employees in a table format

          // Call the function to continue with user prompts
          promptUser();
        });
      });
  });
}

function addEmployeeToDepartment() {
  // Prompt for department selection
  connection.query('SELECT id, name FROM department', (err, departmentData) => {
    if (err) {
      console.error('Error querying database for department list:', err);
      return;
    }

    const departmentChoices = departmentData.map((department) => ({
      name: department.name,
      value: department.id,
    }));

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'department_id',
          message: 'Select a department to add an employee to:',
          choices: departmentChoices,
        },
        {
          type: 'input',
          name: 'employee_id',
          message: 'Enter the ID of the employee to move to the selected department:',
        },
      ])
      .then((answers) => {
        // Check if the employee with the provided ID exists
        connection.query('SELECT id, first_name, last_name FROM employee WHERE id = ?', answers.employee_id, (err, employeeData) => {
          if (err) {
            console.error('Error querying database for employee:', err);
            return;
          }

          if (employeeData.length === 0) {
            console.log('Employee not found with the provided ID.');
            promptUser();
          } else {
            // Update the employee's department
            connection.query(
              'UPDATE employee SET department_id = ? WHERE id = ?',
              [answers.department_id, answers.employee_id],
              (err) => {
                if (err) {
                  console.error('Error moving the employee to the department:', err);
                } else {
                  console.log('Employee moved to the selected department.');
                }

                // Call the function to continue with user prompts
                promptUser();
              }
            );
          }
        });
      });
  });
}



function promptUser() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: [
          'View All Employees',
          'Add Employee',
          'Remove Employee',
          'See Employees by Departments',
          'See Employees by Manager',
          'Update Employee Manager',
          'Update Employee Role',
          'Remove Role',
          'View All Roles',
          'Add Role',
          'Remove Department',
          'View All Departments',
          'Add Employee to Department',
          'Add Department',
          'Quit',
        ],
      },
    ]) 
    .then((answers) => {
      switch (answers.choice) {
        case 'View All Employees':
          viewAllEmployees();
          break;
        case 'Add Role':
          addRole();
          break;
        case 'Add Employee to Department':
            addEmployeeToDepartment();
          break;
        case 'See Employees by Manager':
            seeEmployeesByManager();
          break;
        case 'Update Employee Manager': 
          updateEmployeeManager();
          break;
        case 'See Employees by Departments':
          seeEmployeesByDepartment();
          break;
        case 'Remove Role':
            removeRole();
          break;
        case 'Remove Department':
          removeDepartment();
          break;
        case 'Remove Employee':
          removeEmployee();
          break;
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
        case 'View All Roles':
          viewAllRoles();
          break;
        case 'Add Department':
          addDepartment();
          break;
        case 'View All Departments':
          viewAllDepartments();
          break;
        case 'Add Employee':
          addEmployee();
          break;
        // Add cases for other options and corresponding functions
        case 'Quit':
          quit();
          break;
        default:
          console.log('Invalid choice. Please select a valid option.');
          promptUser();
      }
    });
}

// Start the application
promptUser();