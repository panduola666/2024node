// 圖片處理
const multer = require('multer');

const upload = multer({
  limits: {
    fileSize: 2 * 1024 * 1024, // 2mb 限制
  },
  fileFilter: (req, file, cb) => {
    // 控制什麼檔案可以上傳以及什麼檔案應該跳過
    console.log(file);
    const mimetype = ['image/png', 'image/jpeg']; // 'image/gif'
    if (!mimetype.includes(file.mimetype)) {
      cb(new Error('圖片格式錯誤'));
    }
    cb(null, true);
  },
}).single('file'); // 僅接受 formData 的 file 參數

module.exports = upload;
