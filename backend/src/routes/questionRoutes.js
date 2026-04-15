const express = require('express');
const router = express.Router();
const { createQuestion, importQuestions, exportQuestions, getQuestions, checkNewQuestions, deleteQuestion, updateQuestion } = require('../controllers/questionController');
const { generateQuestions } = require('../controllers/aiController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Check for admin role
const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin only.' });
    }
};

// Public / User Routes
router.get('/', authMiddleware, getQuestions);
router.get('/status', checkNewQuestions); // New status check
router.get('/export', authMiddleware, adminMiddleware, exportQuestions);

// Admin Routes
router.post('/', authMiddleware, adminMiddleware, createQuestion);
router.post('/import', authMiddleware, adminMiddleware, upload.single('file'), importQuestions);
router.post('/generate', authMiddleware, adminMiddleware, generateQuestions); // AI Generation
router.put('/:id', authMiddleware, adminMiddleware, updateQuestion);
router.delete('/:id', authMiddleware, adminMiddleware, deleteQuestion);

module.exports = router;
