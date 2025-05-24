const express = require('express');
const authController = require('../controllers/auth.controller');
const { registerValidation } = require('../validations/auth.validation');

const router = express.Router();

router.post('/register', registerValidation, authController.createUser);
router.post('/login', authController.getUser);

module.exports = router;
