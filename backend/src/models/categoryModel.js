const db = require('../config/db');

const Category = {
    create: async (name) => {
        const [result] = await db.execute(
            'INSERT INTO categories (name) VALUES (?)',
            [name]
        );
        return result.insertId;
    },

    getAll: async () => {
        const [rows] = await db.execute('SELECT * FROM categories ORDER BY name ASC');
        return rows;
    },

    update: async (id, name) => {
        const [result] = await db.execute(
            'UPDATE categories SET name = ? WHERE id = ?',
            [name, id]
        );
        return result.affectedRows;
    },

    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM categories WHERE id = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = Category;
