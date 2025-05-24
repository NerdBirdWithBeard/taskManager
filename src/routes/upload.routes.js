const express = require('express');
const auth = require('../middleware/auth');
const uploadAvatar = require('../middleware/uploadAvatar');
const uploadFile = require('../middleware/uploadFile');
const uploadController = require('../controllers/upload.controller')

const router = express.Router();

router.post('/avatar', auth,  uploadAvatar.single('avatar'), uploadController.sendTaskAttachment);
router.post('/file', auth, uploadFile.single('file'), uploadController.sendTaskAttachment);

module.exports = router;
