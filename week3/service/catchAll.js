const catchAll = (callback) => {
  return function (req, res, next) {
    callback(req, res, next).catch((err) => {
      return next(err);
    });
  };
};

module.exports = catchAll;
