const prisma = require('../lib/prisma');

module.exports.createUser = async (data) => {
    const user = await prisma.user.create({data: data});
    return user;
};

module.exports.getUser = async (filter) => {
    const user = await prisma.user.findUnique({where: filter});
    return user;
};
