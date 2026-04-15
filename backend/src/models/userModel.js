const db = require('../config/db');

const User = {
    create: async (name, email, password) => {
        const role = 'candidate';
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, password, role]
        );
        return result.insertId;
    },

    findByEmail: async (email) => {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    findById: async (id) => {
        const [rows] = await db.execute('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]);
        return rows[0];
    },

    getAll: async () => {
        const [rows] = await db.execute('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
        return rows;
    },

    update: async (id, name, email) => {
        const [result] = await db.execute(
            'UPDATE users SET name = ?, email = ? WHERE id = ?',
            [name, email, id]
        );
        return result.affectedRows;
    },

    setResetToken: async (email, token, expiry) => {
        const [result] = await db.execute(
            'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
            [token, expiry, email]
        );
        return result.affectedRows;
    },

    findByResetToken: async (token) => {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
            [token]
        );
        return rows[0];
    },

    updatePassword: async (userId, hashedPassword) => {
        const [result] = await db.execute(
            'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
            [hashedPassword, userId]
        );
        return result.affectedRows;
    }
};

module.exports = User;
