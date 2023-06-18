const jwt = require('jsonwebtoken');

const { jwt_secret } = require('../config/jwt.config');
const MustAuthorizeError = require('../errors/must-authorize-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    const err = new MustAuthorizeError('Not authorized');
    next(err);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, jwt_secret);
  } catch (e) {
    const err = new MustAuthorizeError('Not authorized');
    next(err);
  }
  req.user = payload;
  next();
};