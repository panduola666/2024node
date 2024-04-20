const Post = require('../model/Post.js');
const handleSuccess = require('../service/handleSuccess');

const routes = async (req, res) => {
  const { url, method } = req;

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  switch (url) {
    case '/posts':
      if (method === 'GET') {
        const data = await Post.find({});
        handleSuccess({ res, data });
      } else if (method === 'POST') {
        req.on('end', async () => {
          const bodyData = JSON.parse(body);
        });
      }
      break;
    default:
      break;
  }
};

module.exports = routes;
