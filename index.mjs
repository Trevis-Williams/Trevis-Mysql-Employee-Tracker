import cfonts from 'cfonts';
import inquirer from 'inquirer';


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
  const sql = 'SELECT * FROM employees'; // Replace 'employee' with the actual table name

  // Run the SQL query to fetch all employees
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return;
    }

    // Display the list of employees in a formatted way (you can use console.table)
    console.table('All Employees', results);

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
  // Implement logic to update an employee's role here
  // You can prompt the user for input and then perform an UPDATE SQL query
  // Add your code here
}

function viewAllRoles() {
  // Implement logic to view all roles here
  // You can query the database and display the list of roles
  // Add your code here
}

function addRole() {
  // Implement logic to add a role here
  // You can prompt the user for input and then perform an INSERT INTO SQL query
  // Add your code here
}

function viewAllDepartments() {
  // Implement logic to view all departments here
  // You can query the database and display the list of departments
  // Add your code here
}

function addDepartment() {
  // Implement logic to add a department here
  // You can prompt the user for input and then perform an INSERT INTO SQL query
  // Add your code here
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