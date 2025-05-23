const express = require('express');
const auth = require('../middleware/auth');
const taskController = require('../controllers/task.controllers');

const router = express.Router();

router.get('/', auth, taskController.getTask);
router.post('/', auth, taskController.createTask);
router.put('/', auth, taskController.updateTask);
router.delete('/', auth, taskController.deleteTask);

module.exports = router;
