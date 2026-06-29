const prisma = require('../_config/prisma');

const Question = {
    create: async (data) => {
        const { category, question_text, options, correct_answer, difficulty = 'beginner' } = data;
        const result = await prisma.question.create({
            data: {
                category,
                questionText: question_text,
                options: Array.isArray(options) ? options : JSON.parse(options),
                correctAnswer: correct_answer,
                difficulty: difficulty.toLowerCase()
            }
        });
        return result.id;
    },

    getAll: async () => {
        const rows = await prisma.question.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return rows.map(r => ({
            ...r,
            question_text: r.questionText,
            correct_answer: r.correctAnswer,
            created_at: r.createdAt
        }));
    },

    getFiltered: async ({ category, difficulty } = {}) => {
        const where = {};
        if (category) {
            where.category = { equals: category, mode: 'insensitive' };
        }
        if (difficulty) {
            where.difficulty = difficulty.toLowerCase();
        }

        const rows = await prisma.question.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
        
        return rows.map(r => ({
            ...r,
            question_text: r.questionText,
            correct_answer: r.correctAnswer,
            created_at: r.createdAt
        }));
    },

    delete: async (id) => {
        await prisma.question.delete({
            where: { id: parseInt(id, 10) }
        });
        return 1;
    },

    update: async (id, data) => {
        const { category, question_text, options, correct_answer, difficulty } = data;
        await prisma.question.update({
            where: { id: parseInt(id, 10) },
            data: {
                category,
                questionText: question_text,
                options: Array.isArray(options) ? options : JSON.parse(options),
                correctAnswer: correct_answer,
                difficulty: difficulty.toLowerCase()
            }
        });
        return 1;
    },

    getRecentCount: async (days = 3) => {
        const date = new Date();
        date.setDate(date.getDate() - days);
        const count = await prisma.question.count({
            where: {
                createdAt: {
                    gte: date
                }
            }
        });
        return count;
    }
};

module.exports = Question;
