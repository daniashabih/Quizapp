const { PrismaClient } = require('@prisma/client');

let prisma;

try {
    prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
    console.log('Prisma client initialized successfully');
} catch (error) {
    console.error('Failed to initialize Prisma client:', error.message);
    console.error(error.stack);
    // Create a fallback that will show clear errors when used
    prisma = new Proxy({}, {
        get(target, prop) {
            return async () => {
                throw new Error(`Prisma client not initialized. DB connection failed: ${error.message}`);
            };
        }
    });
}

module.exports = prisma;
