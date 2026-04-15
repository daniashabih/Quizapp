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

const promisePool = pool.promise();

const initDB = async () => {
    try {
        console.log('🔌 Connecting to database...');

        // Users Table
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
        console.log('✅ Users table checked/created');

        // Check/Add role column if missing (migration)
        try {
            const [columns] = await promisePool.query("SHOW COLUMNS FROM users LIKE 'role'");
            if (columns.length === 0) {
                await promisePool.query("ALTER TABLE users ADD COLUMN role ENUM('admin', 'candidate') DEFAULT 'candidate' AFTER email");
                console.log('✅ Added role column to users table');
            }
        } catch (e) {
            console.log('ℹ️ Role column check skipped/failed (might already exist)');
        }

        // Categories Table
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Categories table checked/created');

        // Questions Table
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS questions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category VARCHAR(50) NOT NULL,
                question_text TEXT NOT NULL,
                options JSON NOT NULL,
                correct_answer VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Questions table checked/created');

        console.log('🎉 Database initialization complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error initializing DB tables:', err);
        process.exit(1);
    }
};

initDB();
