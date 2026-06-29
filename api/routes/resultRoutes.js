const express = require('express');
const router = express.Router();
const { saveResult, getUserResults, getUserStats } = require('../controllers/resultController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/save', authMiddleware, saveResult);
router.get('/my-results', authMiddleware, getUserResults);
router.get('/stats', authMiddleware, getUserStats);

module.exports = router;
