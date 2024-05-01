const service = {
  success: ({http = 200, res, data}) => {
    res
    .status(http)
    .send({
      status: 'success',
      data,
    })
    .end();
  },
  error: ({http = 400, res, error}) => {
    res
    .status(http)
    .send({
      status: 'error',
      message: error.message || error,
    })
    .end();
  },
  errorTask: (errorMessage, http = 400) => {
    const error = new Error(errorMessage)
    error.status = http
    error.isOperational = true
    return error
  },
  error_dev: (err, res) => {
    res.status(err.httpStatus || 400).json({
      status: 'error',
      message: err.message,
      error: err,
      errorName: err.name,
      errorStack: err.stack
    })
  },
  error_production: (err, res) => {
    if (err.isOperational) {
      res.status(err.status || 400).json({
        status: 'error',
        message: err.message
      })
    } else {
      res.status(500).json({
        status: 'error',
        message: '服務器錯誤'
      })
    }
  }
}

module.exports = service;
