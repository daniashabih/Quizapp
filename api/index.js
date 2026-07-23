const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./_routes/authRoutes');
const questionRoutes = require('./_routes/questionRoutes');
const categoryRoutes = require('./_routes/categoryRoutes');
const resultRoutes = require('./_routes/resultRoutes');
const activityRoutes = require('./_routes/activityRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// --- CORS Configuration ---
const allowedOrigins = [
    'https://quizapp-tawny.vercel.app',
    'http://localhost:5173',
    'http://localhost:4173',
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (server-to-server, curl, etc.)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(helmet());
app.use(morgan(process.env.VERCEL ? 'short' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/activity', activityRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Global Error Handler
app.use((err, req, res, _next) => {
    console.error('=== ERROR ===');
    console.error('Message:', err.message);
    console.error('Stack:', err.stack);
    console.error('URL:', req.originalUrl);
    console.error('Method:', req.method);
    
    // Log Prisma-specific errors with more detail
    if (err.code && err.code.startsWith('P')) {
        console.error('Prisma Error Code:', err.code);
        console.error('Prisma Error Meta:', JSON.stringify(err.meta, null, 2));
    }

    res.status(err.status || 500).json({ 
        message: err.message || 'Something went wrong!',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// --- Start server (local) or export (Vercel) ---
if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
