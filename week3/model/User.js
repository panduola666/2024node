const mongoose = require('mongoose');

const schema = {
  nickName: {
    type: String,
    required: [true, '請輸入您的名字'],
    minLength: [2, '暱稱至少2個字']
  },
  email: {
    type: String,
    required: [true, '信箱不可為空'],
    unique: true, // 唯一性
    select: false
  },
  password: {
    type: String,
    required: [true, '密碼不可為空'],
    minLength: [8, '密碼至少8碼'],
    select: false // 禁止 find() 顯示
  },
  gender: {
    type: String,
    default: '',
    enum: {
      values: ['', 'male', 'female'],
      message: '性別格式錯誤'
    }
  },
  photo: {
    type: String,
    default: ''
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

const userSchema = new mongoose.Schema(schema, option);

const User = mongoose.model('user', userSchema);

module.exports = User;