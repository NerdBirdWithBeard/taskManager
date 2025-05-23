const bcrypt = require('bcrypt');
const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const sendNormalized = require('../utils/sendNormalized');

exports.createUser = asyncHandler(async (req, res) => {
    const data = req.body;
        data.password = await bcrypt.hash(data.password, 10);
        let user = await authService.createUser(data);
        const token = generateToken(user.id);
        sendNormalized(res, {accessToken: token}, 'New user successfully created')
});

exports.getUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({error: 'Email and password are required'});
    }
    console.log(email, password);
    user = await authService.getUser({email: email});
    if (!user) {
        return res.status(401).json({error: 'Invalid credentials'});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    let result = isMatch
        ? {accessToken: generateToken(user.id)}
        : null;
    sendNormalized(res, result, 'Authorized', 401, 'Unauthorized');
});