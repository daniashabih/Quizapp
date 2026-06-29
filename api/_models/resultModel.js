const prisma = require('../_config/prisma');

const Result = {
    create: async (userId, category, score, total, percentage, difficulty) => {
        const result = await prisma.quizResult.create({
            data: {
                userId: parseInt(userId, 10),
                category,
                score: parseInt(score, 10),
                total: parseInt(total, 10),
                percentage: parseFloat(percentage),
                difficulty
            }
        });
        return result.id;
    },

    findByUserId: async (userId) => {
        return await prisma.quizResult.findMany({
            where: { userId: parseInt(userId, 10) },
            orderBy: { createdAt: 'desc' }
        });
    },

    getStatisticsByUserId: async (userId) => {
        const results = await prisma.quizResult.groupBy({
            by: ['category'],
            where: { userId: parseInt(userId, 10) },
            _max: { percentage: true },
            _count: { _all: true }
        });
        
        return results.map(r => ({
            category: r.category,
            best_score: r._max.percentage,
            attempts: r._count._all
        }));
    }
};

module.exports = Result;
