const Post = require('../model/Post.js');
const handleSuccess = require('../service/handleSuccess');
const handleError = require('../service/handleError.js');

const routes = async (req, res) => {
  const { url, method } = req;

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  if (url === '/posts' && method === 'GET') {
    const data = await Post.find();
    handleSuccess({ res, data });
  } else if (url === '/posts' && method === 'DELETE') {
    await Post.deleteMany()
    handleSuccess({ res, data: '刪除成功' });
  } else if (url === '/post' && method === 'POST') {
    req.on('end', async () => {
      try {
        const { name, tags, type, image, content } = JSON.parse(body);

        if (!Array.isArray(tags)) {
          handleError({
            res,
            err: {
              message: '貼文標籤格式錯誤'
            },
          });
          return
        }
        await Post.create({
          name,
          tags,
          type,
          image,
          content,
        });
        handleSuccess({ res, data: '新增成功' });
      } catch (err) {
        handleError({ res, err });
      }
    });
  } else if (url.startsWith('/post') && method === 'GET') {
    try {
      const id = url.replace('/post/', '')
      if (!id) {
        handleError({ res, err: {message: '請輸入要查的貼文id'} })
        return
      }
      const data = await Post.findById(id)
      if (data) {
        handleSuccess({res, data})
      } else {
      handleError({ res, err: {message: '查無此貼文'} });
      }
    } catch(err) {
      handleError({ res, err: {message: '查無此貼文'} });
    }
  } else if (url.startsWith('/post') && method === 'PATCH') {
    req.on('end', async () => {
      try {
        const id = url.replace('/post/', '')
      if (!id) {
        handleError({ res, err: {message: '請輸入要查的貼文id'} })
        return
      }
        const { name, tags, type, image, content, likes, comments } = JSON.parse(body);

        if (tags && !Array.isArray(tags)) {
          handleError({
            res,
            err: {
              message: '貼文標籤格式錯誤'
            },
          });
          return
        }
        await Post.findByIdAndUpdate(id, {
          name,
          tags,
          type,
          image,
          content,
          likes,
          comments
        });
        handleSuccess({ res, data: '修改成功' });
      } catch (err) {
        handleError({ res, err });
      }
    });
  }else if (url.startsWith('/post') && method === 'DELETE') {
    try {
      const id = url.replace('/post/', '')
      if (!id) {
        handleError({ res, err: {message: '請輸入要查的貼文id'} })
        return
      }
      const data = await Post.findById(id)
      if (data) {
        await Post.findByIdAndDelete(id)
        handleSuccess({res, data: '刪除成功'})
      } else {
        handleError({ res, err: {message: '查無此貼文'} });
      }
    } catch(err) {
      handleError({ res, err: {message: '查無此貼文'} });
    }
  } else if (method === 'OPTIONS') {
    handleSuccess({ res, data: '' });
  } else {
    handleError({
      res,
      err: {
        message: '查無此路由'
      }
    })
  }
};

module.exports = routes;
