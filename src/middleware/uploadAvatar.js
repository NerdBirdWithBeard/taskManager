// const multer = require('../lib/multer');
const multer = require('multer');
const path = require('path');
const storage = require('../utils/diskStorage');

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const mime = allowedTypes.test(file.mimetype);
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mime && ext) {
        return cb(null, true);
    }
    cb(new Error('Only images are allowed'));
};

const upload = multer({storage, fileFilter});

module.exports = upload;
