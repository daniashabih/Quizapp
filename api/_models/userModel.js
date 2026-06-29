const prisma = require('../_config/prisma');

const User = {
    create: async (name, email, password) => {
        const result = await prisma.user.create({
            data: {
                name,
                email,
                password,
                role: 'candidate'
            }
        });
        return result.id;
    },

    findByEmail: async (email) => {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) return null;
        return {
            ...user,
            created_at: user.createdAt,
            reset_token: user.resetToken,
            reset_token_expiry: user.resetTokenExpiry
        };
    },

    findById: async (id) => {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id, 10) },
            select: { id: true, name: true, email: true, role: true, createdAt: true }
        });
        if (!user) return null;
        return {
            ...user,
            created_at: user.createdAt
        };
    },

    getAll: async () => {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, createdAt: true },
            orderBy: { createdAt: 'desc' }
        });
        return users.map(u => ({
            ...u,
            created_at: u.createdAt
        }));
    },

    update: async (id, name, email) => {
        await prisma.user.update({
            where: { id: parseInt(id, 10) },
            data: { name, email }
        });
        return 1;
    },

    setResetToken: async (email, token, expiry) => {
        await prisma.user.update({
            where: { email },
            data: {
                resetToken: token,
                resetTokenExpiry: new Date(expiry)
            }
        });
        return 1;
    },

    findByResetToken: async (token) => {
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date()
                }
            }
        });
        if (!user) return null;
        return {
            ...user,
            created_at: user.createdAt,
            reset_token: user.resetToken,
            reset_token_expiry: user.resetTokenExpiry
        };
    },

    updatePassword: async (userId, hashedPassword) => {
        await prisma.user.update({
            where: { id: parseInt(userId, 10) },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });
        return 1;
    }
};

module.exports = User;
