const { body } = require('express-validator');

exports.createTaskValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({max: 100}).withMessage('The title must not exceed 100 characters.'),

    body('description')
        .optional()
        .trim()
        .isLength({max: 1000}).withMessage('The description must not exceed 1000 characters.'),

    body('dueDate')
        .optional()
        .isISO8601().withMessage('Incorrect date format'),

    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high']).withMessage('Priority should be: low, medium or high'),

    body('status')
        .optional()
        .isIn(['todo', 'in_progress', 'done']).withMessage('Status must be: todo, in_progress or done'),

    body('projectId')
        .notEmpty().withMessage('projectId is required')
        .isUUID().withMessage('projectId must be in UUID format'),
];

exports.updateTaskValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({max: 100}).withMessage('The title must not exceed 100 characters.'),

    body('description')
        .optional()
        .trim()
        .isLength({max: 1000}).withMessage('The description must not exceed 1000 characters.'),

    body('dueDate')
        .optional()
        .isISO8601().withMessage('Incorrect date format'),

    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high']).withMessage('Priority should be: low, medium or high'),

    body('status')
        .optional()
        .isIn(['todo', 'in_progress', 'done']).withMessage('Status must be: todo, in_progress or done'),

    body('projectId')
        .notEmpty().withMessage('projectId is required')
        .isUUID().withMessage('projectId must be in UUID format'),
];
