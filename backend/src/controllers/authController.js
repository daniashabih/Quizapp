const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user exists
        const userExists = await User.findByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const userId = await User.create(name, email, hashedPassword);

        // Generate Token
        const token = jwt.sign({ id: userId, role: 'candidate' }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.status(201).json({
            id: userId,
            name,
            email,
            role: 'candidate',
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate Token
        // Must include role in token payload for middleware to pick it up
        const token = jwt.sign(
            { id: user.id, role: user.role || 'candidate' },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const userId = req.user.id;

        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        const affectedRows = await User.update(userId, name, email);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedUser = await User.findById(userId);
        res.json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const crypto = require('crypto');

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findByEmail(email);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetExpiry = new Date(Date.now() + 3600000); // 1 hour

        await User.setResetToken(email, resetToken, resetExpiry);

        // In a real app, send email here. For now, log it.
        console.log(`🔑 Reset Link: http://localhost:5173/reset-password/${resetToken}`);

        res.json({ message: 'Password reset link sent to your email (mocked to console)' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        const user = await User.findByResetToken(token);

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.updatePassword(user.id, hashedPassword);

        res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { register, login, getMe, getAllUsers, updateProfile, forgotPassword, resetPassword };
