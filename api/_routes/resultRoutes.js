const express = require('express');
const router = express.Router();
const { saveResult, getUserResults, getUserStats } = require('../_controllers/resultController');
const authMiddleware = require('../_middlewares/authMiddleware');

router.post('/save', authMiddleware, saveResult);
router.get('/my-results', authMiddleware, getUserResults);
router.get('/stats', authMiddleware, getUserStats);

module.exports = router;
