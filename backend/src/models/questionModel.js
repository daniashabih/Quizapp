const db = require('../config/db');

const Question = {
    create: async (data) => {
        const { category, question_text, options, correct_answer, difficulty = 'beginner' } = data;
        const [result] = await db.execute(
            'INSERT INTO questions (category, question_text, options, correct_answer, difficulty) VALUES (?, ?, ?, ?, ?)',
            [category, question_text, JSON.stringify(options), correct_answer, difficulty]
        );
        return result.insertId;
    },

    getAll: async () => {
        const [rows] = await db.execute('SELECT * FROM questions ORDER BY created_at DESC');
        return rows;
    },

    getFiltered: async ({ category, difficulty } = {}) => {
        const whereClauses = [];
        const params = [];

        if (category) {
            whereClauses.push('LOWER(TRIM(category)) = LOWER(TRIM(?))');
            params.push(category);
        }

        if (difficulty) {
            whereClauses.push('LOWER(TRIM(difficulty)) = LOWER(TRIM(?))');
            params.push(difficulty);
        }

        const whereSql = whereClauses.length > 0
            ? `WHERE ${whereClauses.join(' AND ')}`
            : '';

        const [rows] = await db.execute(
            `SELECT * FROM questions ${whereSql} ORDER BY created_at DESC`,
            params
        );
        return rows;
    },

    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM questions WHERE id = ?', [id]);
        return result.affectedRows;
    },

    update: async (id, data) => {
        const { category, question_text, options, correct_answer, difficulty } = data;
        const [result] = await db.execute(
            'UPDATE questions SET category=?, question_text=?, options=?, correct_answer=?, difficulty=? WHERE id=?',
            [category, question_text, Array.isArray(options) ? JSON.stringify(options) : options, correct_answer, difficulty, id]
        );
        return result.affectedRows;
    },

    getRecentCount: async (days = 3) => {
        const [rows] = await db.execute(
            'SELECT COUNT(*) as count FROM questions WHERE created_at >= NOW() - INTERVAL ? DAY',
            [days]
        );
        return rows[0].count;
    }
};

module.exports = Question;
