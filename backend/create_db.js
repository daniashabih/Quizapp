require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        // Prepare a more helpful error message specifically for authentication
        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('\nAccess denied. Please check your DB_PASSWORD in the .env file.');
            console.error('Current configured user:', process.env.DB_USER);
            console.error('Current configured password:', process.env.DB_PASSWORD);
        }
        process.exit(1);
    }
    console.log('Connected to MySQL server.');

    connection.query('CREATE DATABASE IF NOT EXISTS codequiz', (err, result) => {
        if (err) {
            console.error('Error creating database:', err);
            process.exit(1);
        }
        console.log('Database "codequiz" created or already exists.');
        connection.end();
    });
});
