-- Add your code below and execute file in MySQL Shell --
const mysql = require('mysql2');

// Set up the MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employees'
});

// Connect to the database
connection.connect();


// Close the connection
connection.end();