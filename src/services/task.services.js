const prisma = require('../lib/prisma');

module.exports.createTask = async (data) => {
    const task = await prisma.task.create({data: data});
    return task;
};

module.exports.updateTask = async (filter, data) => {
    const task = await prisma.task.update({
        where: filter,
        data: data
    });
    return task;
};

module.exports.getTask = async (filter) => {
    const task = await prisma.task.findUnique({where: filter});
    return task;
};

module.exports.getTasks = async (filter) => {
    const task =  await prisma.task.findMany({where: filter});
    return task;
};

module.exports.deleteTask = async (filter) => {
    const task = await prisma.task.delete({where: filter});
    return task;
};
