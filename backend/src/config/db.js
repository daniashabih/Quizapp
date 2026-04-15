const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Create tables if they don't exist
const promisePool = pool.promise();

const initDB = async () => {
    try {
        console.log('🚀 Initializing Database Tables...');
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'candidate') DEFAULT 'candidate',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Check if role column exists (for existing tables)
        const [columns] = await promisePool.query("SHOW COLUMNS FROM users LIKE 'role'");
        if (columns.length === 0) {
            await promisePool.query("ALTER TABLE users ADD COLUMN role ENUM('admin', 'candidate') DEFAULT 'candidate' AFTER email");
            console.log('✅ Added role column to users table');
        }

        const [resetTokenCol] = await promisePool.query("SHOW COLUMNS FROM users LIKE 'reset_token'");
        if (resetTokenCol.length === 0) {
            await promisePool.query("ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) AFTER role, ADD COLUMN reset_token_expiry DATETIME AFTER reset_token");
            console.log('✅ Added reset token columns to users table');
        }

        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS questions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category VARCHAR(50) NOT NULL,
                question_text TEXT NOT NULL,
                options JSON NOT NULL,
                correct_answer VARCHAR(255) NOT NULL,
                difficulty ENUM('beginner', 'intermediate', 'expert') DEFAULT 'beginner',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Check if difficulty column exists in questions (for existing tables)
        const [qColumns] = await promisePool.query("SHOW COLUMNS FROM questions LIKE 'difficulty'");
        if (qColumns.length === 0) {
            await promisePool.query("ALTER TABLE questions ADD COLUMN difficulty ENUM('beginner', 'intermediate', 'expert') DEFAULT 'beginner' AFTER correct_answer");
            console.log('✅ Added difficulty column to questions table');
        }
        console.log('✅ Questions table ready');

        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS quiz_results (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                category VARCHAR(50) NOT NULL,
                score INT NOT NULL,
                total INT NOT NULL,
                percentage DECIMAL(5,2) NOT NULL,
                difficulty VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Quiz Results table ready');

        console.log('✅ Users table ready');
    } catch (err) {
        console.error('❌ Error initializing DB tables:', err);
        throw err; // Propagate error
    }
};

initDB().catch(err => {
    console.error('FATAL DB ERROR:', err);
});

module.exports = promisePool;
