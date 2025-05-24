const express = require('express');
const auth = require('../middleware/auth');
const projectController = require('../controllers/project.controller');

const router = express.Router();

router.post('/', auth, projectController.createProject);

module.exports = router;
