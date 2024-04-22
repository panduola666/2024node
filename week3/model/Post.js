const mongoose = require('mongoose');

const schema = {
  name: {
    type: String,
    required: [true, '貼文姓名必填']
  },
  tags: [
    {
      type: String,
      required: [true, '貼文標籤必填']
    }
  ],
  type: {
    type: String,
    required: [true, '貼文類型必填']
  },
  image: {
    type: String,
    default: ""
  },
  createAt: {
    type: Date,
    default: Date.now,
    select: false
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
}

const option = {
  versionKey: false,
  // timestamps: true
}

const postSchema = new mongoose.Schema(schema, option);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;