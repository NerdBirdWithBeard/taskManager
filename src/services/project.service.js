const prisma = require('../lib/prisma');

module.exports.createProject = async (data) => {
    const project = await prisma.project.create({data: data});
    return project;
};