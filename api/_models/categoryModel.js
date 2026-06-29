const prisma = require('../_config/prisma');

const Category = {
    create: async (name) => {
        const result = await prisma.category.create({
            data: { name }
        });
        return result.id;
    },

    getAll: async () => {
        return await prisma.category.findMany({
            orderBy: { name: 'asc' }
        });
    },

    update: async (id, name) => {
        await prisma.category.update({
            where: { id: parseInt(id, 10) },
            data: { name }
        });
        return 1;
    },

    delete: async (id) => {
        await prisma.category.delete({
            where: { id: parseInt(id, 10) }
        });
        return 1;
    }
};

module.exports = Category;
