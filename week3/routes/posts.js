var express = require('express');
var router = express.Router();
const Post = require('../model/Post');
const service = require('../service');


router.get('/', async(req, res, next) => {
  try {
    const data = await Post.find()
    service.success({res, data})
  } catch (error) {
    service.error({res, error})
  }
});

router.get('/:id', async(req, res, next) => {
  try {
    const data = await Post.findById(req.params.id)
    service.success({res, data})
  } catch (error) {
    service.error({res, error: '查無此貼文'})
  }
});

router.post('/', async(req, res, next) => {
  try {
    const { name, tags, type, image, content, likes = 0, comments = 0  } = req.body

    if (!name) {
      service.error({res, error: '貼文姓名必填'})
      return
    } else if (!type) {
      service.error({res, error: '貼文類型必填'})
      return
    } else if (!content) {
      service.error({res, error: '貼文內容必填'})
      return
    } else if (!Array.isArray(tags)) {
      service.error({res, error: '貼文標籤型別錯誤'})
      return
    }

    
    const data = await Post.create({name, tags, type, image, content, likes, comments})
    service.success({res, data: '新增貼文成功'})
  } catch (error) {
    service.error({res, error: '新增貼文失敗'})
  }
});

router.patch('/:id', async(req, res, next) => {
  try {
    const { name, tags, type, image, content, likes = 0, comments = 0  } = req.body

    if (!name) {
      service.error({res, error: '貼文姓名必填'})
      return
    } else if (!type) {
      service.error({res, error: '貼文類型必填'})
      return
    } else if (!content) {
      service.error({res, error: '貼文內容必填'})
      return
    } else if (!Array.isArray(tags)) {
      service.error({res, error: '貼文標籤型別錯誤'})
      return
    }

    
    const data = await Post.findById(req.params.id)
    if (data) {
      await Post.findByIdAndUpdate(req.params.id, {name, tags, type, image, content, likes, comments})
      service.success({res, data: '更新貼文成功'})
    } else {
    service.error({res, error: '查無此貼文'})
    }
  } catch (error) {
    service.error({res, error: '更新貼文失敗'})
  }
});

router.delete('/', async(req, res, next) => {
  try {
    const data = await Post.deleteMany()
    service.success({res, data: '刪除成功'})
  } catch (error) {
    service.error({res, error: '刪除失敗'})
  }
});

router.delete('/:id', async(req, res, next) => {
  try {
    const data = await Post.findById(req.params.id)
    if (data) {
      await Post.findByIdAndDelete(req.params.id)
      service.success({res, data: '刪除成功'})
    } else {
    service.error({res, error: '查無此貼文'})
    }
  } catch (error) {
    service.error({res, error: '刪除失敗'})
  }
});

module.exports = router;
