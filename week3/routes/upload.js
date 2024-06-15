const express = require('express');
const { v4: uuidv4 } = require('uuid');
const sizeOf = require('image-size'); // 獲取圖片尺寸

const router = express.Router();

const catchAll = require('../service/catchAll');
const firebaseAdmin = require('../service/firebase');
const upload = require('../service/image');
const service = require('../service');

const bucket = firebaseAdmin.storage().bucket(); // 建立 Storage 的 Bucket(儲存桶)

router.post(
  '/',
  upload,
  catchAll(async (req, res, next) => {
    const { file } = req;
    console.log('這裡是file', file);
    if (file.fieldname !== 'file') {
      return next(service.errorTask('欄位填寫錯誤'));
    }
    if (!file) {
      return next(service.errorTask('請選擇要上傳圖片'));
    }

    // 基於檔案建立 blob 物件
    const blob = bucket.file(
      `upload/${uuidv4()}.${file.originalname.split('.').pop()}`
    );
    // 本地建立可寫入的 blob 物件
    const blobStream = blob.createWriteStream();

    // 監聽上傳狀態,  完畢會觸發 finish
    blobStream.on('finish', () => {
      // 設定檔案存取權限
      const config = {
        action: 'read', // 權限
        expires: '12-31-2500', // 網址有效期間
      };
      // 取得檔案網址
      blob.getSignedUrl(config, (err, fileUrl) => {
        service.success({ res, data: fileUrl });
      });
    });

    // 上傳過程失敗
    blobStream.on('error', (err) => {
      console.log(err);
      return next(service.errorTask(err));
    });

    // 把檔案的 buffer 寫入 blobStream
    blobStream.end(file.buffer);
  })
);

module.exports = router;
