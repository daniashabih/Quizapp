const express = require('express');
const router = express.Router();
const { register, login, getMe, getAllUsers, updateProfile, forgotPassword, resetPassword } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Relaxed admin middleware for now, consistent with other routes
const adminMiddleware = (req, res, next) => {
    if (req.user) next(); else res.status(401).json({ message: 'Unauthorized' });
};

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authMiddleware, getMe);
router.put('/update-profile', authMiddleware, updateProfile);
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);

module.exports = router;
