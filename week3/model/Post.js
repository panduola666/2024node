const mongoose = require('mongoose');

const schema = {
  user: {
    type: mongoose.Schema.ObjectId,
    ref:"user", // 設定要連接到哪個 collections (不用加 s), 綁定 mongoose.model() 指定的名稱
    required: [true, '用戶 Id 未填寫'],
  },
  tags: [
    {
      type: String,
      required: [true, '貼文標籤必填']
    }
  ],
  type: {
    type: String,
    default: 'public',
    enum: {
      values: ['public', 'private'],
      message: '貼文類型錯誤'
    }
  },
  image: {
    type: String,
    default: ""
  },
  content: {
    type: String,
    required: [true, '貼文內容必填'],
  },
  likes: {
    type: Number,
    default: 0
  },
  comments:{
    type: Number,
    default: 0
  },
  createDate: {
    type: Number
  },
  updateDate: {
    type: Number
  },
}

const option = {
  versionKey: false,
  timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' }
}

const postSchema = new mongoose.Schema(schema, option);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;