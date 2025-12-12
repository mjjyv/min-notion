const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Tự động ẩn mật khẩu khi truy vấn
    },
    avatar: { type: String },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Middleware (pre-save hook) để băm mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
  // Chỉ băm mật khẩu nếu nó được thay đổi (hoặc là mới)
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Thêm phương thức 'comparePassword' vào model
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;