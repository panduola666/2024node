var express = require('express');
const bcrypt = require('bcryptjs');
const validator = require('validator');

var router = express.Router();
const User = require('../model/User');
const service = require('../service');
const catchAll = require('../service/catchAll');
const jwt = require('../service/jwt');
const isAuth = require('../middleware/isAuth');

// 註冊
router.post(
  '/sign_up',
  catchAll(async (req, res, next) => {
    const { nickName, email, password } = req.body;

    if (!email || !password || !nickName) {
      return next(service.errorTask('欄位填寫錯誤'));
    }
    if (!validator.isEmail(email)) {
      return next(service.errorTask('信箱格式錯誤'));
    }
    if (!validator.isLength(password, { min: 8 })) {
      return next(service.errorTask('密碼不可低於 8 位數'));
    }

    const hasUser = await User.findOne({ email });
    if (hasUser) {
      return next(service.errorTask('此信箱已被註冊'));
    }

    // 密碼加密
    const newPwd = await bcrypt.hash(password, 12);

    const data = await User.create({ nickName, email, password: newPwd });
    // jwt.createJWT({res, data, http: 201})
    service.success({ res, data: '註冊成功' });
  })
);

// 登入
router.post(
  '/sign_in',
  catchAll(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(service.errorTask('欄位填寫錯誤'));
    }
    if (!validator.isEmail(email)) {
      return next(service.errorTask('信箱格式錯誤'));
    }
    if (!validator.isLength(password, { min: 8 })) {
      return next(service.errorTask('密碼不可低於 8 位數'));
    }

    const user = await User.findOne({ email }).select('+password');
    const checkPwd = await bcrypt.compare(password, user.password);
    if (!checkPwd) {
      return next(service.errorTask('密碼不正確'));
    }
    jwt.createJWT({ res, data: user });
  })
);

// 取得個人資料
router.get(
  '/profile',
  isAuth,
  catchAll(async (req, res, next) => {
    service.success({ res, data: req.user });
  })
);

// 更新個人資料
router.patch(
  '/profile',
  isAuth,
  catchAll(async (req, res, next) => {
    const { nickName, gender, photo } = req.body;

    if (!nickName) {
      return next(service.errorTask('暱稱不可為空'));
    }
    if (!['male', 'female'].includes(gender)) {
      return next(service.errorTask('性別格式錯誤'));
    }
    if (photo && !validator.isURL(photo)) {
      return next(service.errorTask('頭像格式錯誤'));
    }
    await User.findByIdAndUpdate(req.user.id, {
      nickName,
      gender,
      photo,
    });
    service.success({ res, data: '修改資料成功' });
  })
);

// 重設密碼
router.post(
  '/updatePassword',
  isAuth,
  catchAll(async (req, res, next) => {
    const { password, checkPwd } = req.body;

    if (!password || !checkPwd) {
      return next(service.errorTask('欄位填寫錯誤'));
    }

    if (!validator.isLength(password, { min: 8 })) {
      return next(service.errorTask('密碼不可低於 8 位數'));
    }
    if (password !== checkPwd) {
      return next(service.errorTask('兩次密碼不一致'));
    }
    const newPwd = await bcrypt.hash(password, 12);

    const user = await User.findByIdAndUpdate(req.user.id, {
      password: newPwd,
    });
    service.success({ res, data: '修改密碼成功' });
  })
);

module.exports = router;
