var express = require('express');
var router = express.Router();
const Post = require('../model/Post');
const User = require('../model/User');
const service = require('../service');

router.get('/', async (req, res, next) => {
  try {
    const { q = '', order = 'desc' } = req.query;
    const filter = {};
    const sort = {
      createDate: order === 'asc' ? 1 : -1,
    };
    if (q) {
      filter.content = new RegExp(q, 'g');
    }
    const data = await Post.find(filter).sort(sort).populate({
      path: 'user',
      select: 'nickName photo',
    });
    service.success({ res, data });
  } catch (error) {
    service.error({ res, error });
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const data = await Post.findById(req.params.id);
    service.success({ res, data });
  } catch (error) {
    service.error({ http: 404, res, error: '查無此貼文' });
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {
      userId,
      tags,
      type,
      image,
      content,
      likes = 0,
      comments = 0,
    } = req.body;

    if (!type) {
      service.error({ res, error: '貼文類型必填' });
      return;
    } else if (!content.trim()) {
      service.error({ res, error: '貼文內容必填' });
      return;
    } else if (tags && !Array.isArray(tags)) {
      service.error({ res, error: '貼文標籤型別錯誤' });
      return;
    } else if (!['public', 'private'].includes(type)) {
      service.error({ res, error: '貼文類型錯誤' });
      return;
    } else if(image && !String(image).startsWith('http')) {
      service.error({ res, error: '圖片網址錯誤' });
      return;
    } else if (!userId) {
      service.error({ res, error: '用戶id必填' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      service.error({ http: 404, res, error: '無此用戶' });
      return;
    }

    const data = await Post.create({
      content: content.trim(),
      user: userId,
      tags,
      type,
      image,
      likes,
      comments,
    });
    service.success({ res, data: '新增貼文成功' });
  } catch (error) {
    console.log(error);
    service.error({ res, error: '新增貼文失敗' });
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const {
      userId,
      tags,
      type,
      image,
      content,
      likes = 0,
      comments = 0,
    } = req.body;

    if (!type) {
      service.error({ res, error: '貼文類型必填' });
      return;
    } else if (!content.trim()) {
      service.error({ res, error: '貼文內容必填' });
      return;
    } else if (tags && !Array.isArray(tags)) {
      service.error({ res, error: '貼文標籤型別錯誤' });
      return;
    } else if (!['public', 'private'].includes(type)) {
      service.error({ res, error: '貼文類型錯誤' });
      return;
    } else if(image && !String(image).startsWith('http')) {
      service.error({ res, error: '圖片網址錯誤' });
      return;
    } else if (!userId) {
      service.error({ res, error: '用戶id必填' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      service.error({ http: 404, res, error: '無此用戶' });
      return;
    }

    const data = await Post.findById(req.params.id);
    if (data) {
      await Post.findByIdAndUpdate(req.params.id, {
        content: content.trim(),
        tags,
        type,
        image,
        likes,
        comments,
      });
      service.success({ res, data: '更新貼文成功' });
    } else {
      service.error({ http: 404, res, error: '查無此貼文' });
    }
  } catch (error) {
    service.error({ res, error: '更新貼文失敗' });
  }
});

router.delete('/all', async (req, res, next) => {
  try {
    const data = await Post.deleteMany();
    service.success({ res, data: '刪除成功' });
  } catch (error) {
    service.error({ res, error: '刪除失敗' });
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const data = await Post.findById(req.params.id);
    if (data) {
      await Post.findByIdAndDelete(req.params.id);
      service.success({ res, data: '刪除成功' });
    } else {
      service.error({ http: 404, res, error: '查無此貼文' });
    }
  } catch (error) {
    service.error({ res, error: '刪除失敗' });
  }
});

module.exports = router;
