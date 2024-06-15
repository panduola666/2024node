const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

const service = require('./service')
const isAuth = require('./middleware/isAuth')

const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const uploadRouter = require('./routes/upload');

const app = express();

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

app.use('/posts',isAuth, postsRouter);
app.use('/users', usersRouter);
app.use('/upload', isAuth,uploadRouter);

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
