var express = require('express');
var router = express.Router();
const User = require('../model/User');
const service = require('../service');
const catchAll = require('../service/catchAll')

router.get('/', catchAll(async(req, res, next) => {
    const data = await User.find()
    service.success({res, data})
}));

router.post('/register', catchAll(async(req, res, next) => {
    const { nickName, email, password  } = req.body
    const data = await User.create({ nickName, email, password  })
    service.success({res, data})
}));

module.exports = router;
