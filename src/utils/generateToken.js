const jwt = require('jsonwebtoken');

function generateToken(userId) {
  return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '1d'});
}

module.exports = generateToken;
