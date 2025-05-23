const express = require('express');
const auth = require('../middleware/auth');
const taskController = require('../controllers/task.controllers');
const { createTaskValidation, updateTaskValidation } = require('../validations/task.validations');

const router = express.Router();

router.get('/', auth, taskController.getTask);
router.post('/', auth, createTaskValidation, taskController.createTask);
router.put('/', auth, updateTaskValidation, taskController.updateTask);
router.delete('/', auth, taskController.deleteTask);

module.exports = router;
