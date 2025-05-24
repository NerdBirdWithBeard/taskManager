const { validationResult } = require('express-validator');
const taskService = require('../services/task.services');
const asyncHandler = require('../utils/asyncHandler');
const sendNormalized = require('../utils/sendNormalized');


exports.getTasks = asyncHandler(async (req, res) => {
    const filter = req.query;
    filter.userId = req.user.userId;
    sendNormalized(res, await taskService.getTasks(filter), 'Success', 404, 'No tasks found found');
});

exports.getTask = asyncHandler(async (req, res) => {
    const filter = req.query;
    filter.userId = req.user.userId;
    sendNormalized(res, await taskService.getTask(filter), 'Success', 404, 'Task not found');

});
    
exports.createTask = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()})
    }
    const data = req.body;
    data.dueDate = new Date(data.dueDate);
    data.userId = req.user.userId;
    sendNormalized(res, await taskService.createTask(data), 'New task successfully created');
});

exports.updateTask = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()})
    }
    const filter = req.query;
    const data = req.body;
    data.dueDate = new Date(data.dueDate);
    data.userId = req.user.userId;
    sendNormalized(res,
        await taskService.updateTask(filter, data),
        'Task successfully updated',
        404,
        'Task not found for update'
    );
});

exports.deleteTask = asyncHandler(async (req, res) => {
    const { id } = req.query;
    const filter = req.query;
    filter.userId = req.user.userId;
    if (id) {
        sendNormalized(res, await taskService.deleteTask(filter), 'Task successfully deleted',
            404,
            'Task not found'
        );
    } else {
        res.status(400).json({message: 'Nothing to delete'})
    }
});
