const { body } = require('express-validator');

module.exports.registerValidation = [
    body('email').isEmail().withMessage('Incorrect email'),
    body('password')
        .isLength({min: 8}).withMessage('Password must be at least 8 characters')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/\d/).withMessage('Password must contain at least one number')
        .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character'),,
];
