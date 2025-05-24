const multer = require('multer');
const storage = require('../utils/diskStorage');

const upload = multer({storage});

module.exports = upload;
