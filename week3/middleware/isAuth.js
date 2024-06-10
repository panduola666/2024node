const catchAll = require('../service/catchAll');
const service = require('../service');
const jwt = require('../service/jwt');
const User = require('../model/User');

const isAuth = catchAll(async (req, res, next) => {
  let token;

  const authorization =
    req.header('Authorization') || req.header('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    token = authorization.split(' ')[1];
  }

  if (!token) {
    return next(service.errorTask('尚未登入', 401));
  }

  const decoded = await jwt.parseJWT(token);
  const user = await User.findById(decoded.id);

  req.user = user;
  next();
});

module.exports = isAuth;
