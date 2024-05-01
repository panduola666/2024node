var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

const service = require('./service')

var postsRouter = require('./routes/posts');
var usersRouter = require('./routes/users');

var app = express();

process.on('uncaughtException', (err) => {
  console.log('uncaughtException', err);
  console.log(err.name);
  console.log(err.message);
  console.log(err.stack);
  process.exit(1)
})

require('./handle/connections')

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/posts', postsRouter);
app.use('/users', usersRouter);

app.use((req, res, next) => {
  next(service.errorTask('查無此路由'))
})

app.use((err, req, res, next) => {
  err.status = err.status || 500
  if (process.env.NODE_ENV === 'dev') {
    return service.error_dev(err, res)

  }

  if (err.name === 'ValidationError') {
    // mongoose 驗證錯誤
    err.isOperational = true
    err.message = '參數錯誤'
    return service.error_production(err, res)
  }
  if (err.name === 'CastError') {
    err.isOperational = true
    err.status = 404
    err.message = '參數錯誤'
    return service.error_production(err, res)
  }

  service.error_production(err, res)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('未捕捉到的 catch', promise, '原因：', reason)
})

module.exports = app;
