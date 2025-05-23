const express = require('express');
const auth = require('../middleware/auth');
const taskController = require('../controllers/task.controllers');

const router = express.Router();

router.get('/', auth, taskController.getTasks);

module.exports = router;
