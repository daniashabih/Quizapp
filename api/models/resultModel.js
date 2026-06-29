const db = require('../config/db');

const Result = {
    create: async (userId, category, score, total, percentage, difficulty) => {
        const [result] = await db.execute(
            'INSERT INTO quiz_results (user_id, category, score, total, percentage, difficulty) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, category, score, total, percentage, difficulty]
        );
        return result.insertId;
    },

    findByUserId: async (userId) => {
        const [rows] = await db.execute(
            'SELECT * FROM quiz_results WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        return rows;
    },

    getStatisticsByUserId: async (userId) => {
        const [rows] = await db.execute(
            'SELECT category, MAX(percentage) as best_score, COUNT(*) as attempts FROM quiz_results WHERE user_id = ? GROUP BY category',
            [userId]
        );
        return rows;
    }
};

module.exports = Result;
