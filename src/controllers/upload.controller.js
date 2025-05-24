const sendNormalized = require('../utils/sendNormalized');

exports.sendTaskAttachment = (req, res) => {
    const result = req.file;
    sendNormalized(res, result, 'File uploaded', 400, 'File was not uploaded');
};
