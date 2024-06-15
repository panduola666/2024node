const express = require('express');
const router = express.Router();
const Post = require('../model/Post');
const User = require('../model/User');
const service = require('../service');
const catchAll = require('../service/catchAll');

router.get(
  '/',
  catchAll(async (req, res, next) => {
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
  })
);

router.get(
  '/:id',
  catchAll(async (req, res, next) => {
    const data = await Post.findById(req.params.id);
    service.success({ res, data });
  })
);

router.post(
  '/',
  catchAll(async (req, res, next) => {
    const { tags, type, image, content } = req.body;

    if (!type) {
      return next(service.errorTask('貼文類型必填'));
    } else if (!content.trim()) {
      return next(service.errorTask('貼文內容必填'));
    } else if (tags && !Array.isArray(tags)) {
      return next(service.errorTask('貼文標籤型別錯誤'));
    } else if (!['public', 'private'].includes(type)) {
      return next(service.errorTask('貼文類型錯誤'));
    } else if (image && !String(image).startsWith('http')) {
      return next(service.errorTask('圖片網址錯誤'));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(service.errorTask('查無此用戶', 404));
    }

    await Post.create({
      content: content.trim(),
      user: req.user.id,
      tags,
      type,
      image,
    });
    service.success({ res, data: '新增貼文成功' });
  })
);

router.patch(
  '/:id',
  catchAll(async (req, res, next) => {
    const {
      tags,
      type,
      image,
      content,
      likes = 0,
      comments = 0,
    } = req.body;

    if (!type) {
      return next(service.errorTask('貼文類型必填'));
    } else if (!content.trim()) {
      return next(service.errorTask('貼文內容必填'));
    } else if (tags && !Array.isArray(tags)) {
      return next(service.errorTask('貼文標籤型別錯誤'));
    } else if (!['public', 'private'].includes(type)) {
      return next(service.errorTask('貼文類型錯誤'));
    } else if (image && !String(image).startsWith('http')) {
      return next(service.errorTask('圖片網址錯誤'));
    } else if (!req.user.id) {
      return next(service.errorTask('用戶id必填'));
    } else if (Number(likes) < 0) {
      return next(service.errorTask('點讚數不可小於 0'));
    } else if (Number(comments) < 0) {
      return next(service.errorTask('評論數不可小於 0'));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(service.errorTask('查無此用戶'));
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
      return next(service.errorTask('查無此貼文'));
    }
  })
);

router.delete(
  '/all',
  catchAll(async (req, res, next) => {
    const data = await Post.deleteMany();
    service.success({ res, data: '刪除成功' });
  })
);

router.delete(
  '/:id',
  catchAll(async (req, res, next) => {
    const data = await Post.findById(req.params.id);
    if (data) {
      await Post.findByIdAndDelete(req.params.id);
      service.success({ res, data: '刪除成功' });
    } else {
      return next(service.errorTask('查無此貼文'));
    }
  })
);

module.exports = router;
