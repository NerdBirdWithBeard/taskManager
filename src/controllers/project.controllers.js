const projectService = require('../services/project.service');
const projectService = require('../services/project.service');
const sendNormalized = require('../utils/sendNormalized');

exports.createProject = asyncHandler(async (req, res) => {
    const data = req.body;
    data.ownerId = req.user.userId;
    sendNormalized(res, await projectService.createProject(data), 'New project successfully created');
});