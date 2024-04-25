var express = require('express');
var router = express.Router();
const User = require('../model/User');
const service = require('../service');

router.get('/', async(req, res, next) => {
  try {
    const data = await User.find()
    service.success({res, data})
  } catch (error) {
    service.error({res, error})
  }
});

router.post('/register', async(req, res, next) => {
  try {
    const { nickName, email, password  } = req.body
    const data = await User.create({ nickName, email, password  })
    service.success({res, data})
  } catch (error) {
    service.error({res, error})
  }
});

module.exports = router;
