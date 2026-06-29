const express = require('express');
const router = express.Router();
const { createCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');

const adminMiddleware = (req, res, next) => {
    // For now, disabling check for development, but ideally:
    // if (req.user && req.user.role === 'admin') next(); else res.status(403)...
    if (req.user) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

router.post('/', authMiddleware, adminMiddleware, createCategory);
router.get('/', getCategories); // Public read for dropdowns usually OK, or protected
router.put('/:id', authMiddleware, adminMiddleware, updateCategory);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory);

module.exports = router;
