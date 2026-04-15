const Result = require('../models/resultModel');

const resultController = {
    saveResult: async (req, res) => {
        try {
            const { category, score, total, percentage, difficulty } = req.body;
            console.log('📥 Saving result for user:', req.user.id, { category, score, total, percentage, difficulty });
            
            const userId = req.user.id; 

            const insertId = await Result.create(userId, category, score, total, percentage, difficulty);
            
            res.status(201).json({
                message: 'Result saved successfully.',
                resultId: insertId
            });
        } catch (error) {
            console.error('❌ Error saving result:', error);
            res.status(500).json({ 
                message: 'Internal server error while saving result',
                error: error.message,
                code: error.code 
            });
        }
    },

    getUserResults: async (req, res) => {
        try {
            const userId = req.user.id;
            const results = await Result.findByUserId(userId);
            res.status(200).json(results);
        } catch (error) {
            console.error('❌ Error fetching results:', error);
            res.status(500).json({ 
                message: 'Internal server error while fetching results',
                error: error.message 
            });
        }
    },

    getUserStats: async (req, res) => {
        try {
            const userId = req.user.id;
            const stats = await Result.getStatisticsByUserId(userId);
            res.status(200).json(stats);
        } catch (error) {
            console.error('❌ Error fetching stats:', error);
            res.status(500).json({ 
                message: 'Internal server error while fetching stats',
                error: error.message 
            });
        }
    }
};

module.exports = resultController;
