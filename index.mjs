import cfonts from 'cfonts';
import inquirer from 'inquirer';
import mysql from 'mysql2';

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
  const sql = 'SELECT employee.first_name, employee.last_name, role.title, role.salary, employee.manager_id FROM employee JOIN role'; // Replace 'employee' with the actual table name

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
        type: 'input',
        name: 'role_id',
        message: 'Enter the role ID for the employee:',
      },
      {
        type: 'input',
        name: 'manager_id',
        message: "Enter the manager's employee ID (or leave it empty if there's no manager):",
      },
    ])
    .then((answers) => {
      const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
      const values = [
        answers.first_name,
        answers.last_name,
        answers.role_id,
        answers.manager_id || null, // Set manager_id to NULL if it's empty
      ];

      // Run the SQL query to add the employee
      connection.query(sql, values, (err, results) => {
        if (err) {
          console.error('Error adding employee to the database:', err);
          return;
        }

        console.log('Employee added successfully!');

        // Call the function to continue with user prompts
        promptUser();
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

      // Run the SQL query to add the employee
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
          'Update Employee Role',
          'View All Roles',
          'Add Role',
          'View All Departments',
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