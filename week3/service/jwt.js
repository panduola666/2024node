const service = require('./index');
const jwt = require('jsonwebtoken');

const JWT = {
  createJWT: async ({ http = 200, res, data }) => {
    const payload = {
      id: data._id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_DAY,
    });

    const { exp } = await parseJWT(token);
    service.success({
      http,
      res,
      data: {
        token,
        expires: exp * 1000,
        nickName: data.nickName,
        photo: data.photo,
      },
    });
  },
  parseJWT,
};

async function parseJWT(token) {
  return await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
}

module.exports = JWT;
