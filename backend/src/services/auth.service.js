const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');

/**
 * Đăng ký người dùng mới
 * @param {object} userData - Dữ liệu người dùng (name, email, password)
 * @returns {object} - Người dùng mới (đã loại bỏ mật khẩu)
 */
const registerUser = async (userData) => {
  const { name, email, password } = userData;

  // 1. Kiểm tra email đã tồn tại chưa
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('Email already exists');
  }

  // 2. Tạo người dùng mới (mật khẩu sẽ được tự động băm bởi model)
  const user = await User.create({
    name,
    email,
    password,
  });

  // 3. Trả về người dùng (loại bỏ mật khẩu)
  const userResponse = user.toObject();
  delete userResponse.password;

  return userResponse;
};

/**
 * Đăng nhập người dùng
 * @param {string} email
 * @param {string} password
 * @returns {object} - { user, token }
 */
const loginUser = async (email, password) => {
  // 1. Tìm người dùng (lấy cả trường password đã bị ẩn)
  const user = await User.findOne({ email }).select('+password');

  // 2. Kiểm tra người dùng và mật khẩu
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  // 3. Tạo token
  const token = generateToken(user._id);

  // 4. Trả về người dùng (loại bỏ mật khẩu) và token
  const userResponse = user.toObject();
  delete userResponse.password;

  return { user: userResponse, token };
};

module.exports = {
  registerUser,
  loginUser,
};