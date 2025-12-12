const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler'); 
const ErrorHandler = require('../utils/errorHandler');
const User = require('../models/user.model');
// const bcrypt = require('bcryptjs'); 

/**
 * Đăng ký người dùng mới
 */
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    // Vẫn cần validation cơ bản
    return next(new ErrorHandler(400, 'Please provide all fields'));
  }

  const user = await authService.registerUser({ name, email, password });
  res.status(201).json(user);
});

/**
 * Đăng nhập người dùng
 */
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler(400, 'Please provide email and password'));
  }

  const { user, token } = await authService.loginUser(email, password);
  res.status(200).json({ user, token });
});

/**
 * Lấy thông tin user hiện tại
 */
const getMe = asyncHandler(async (req, res, next) => {
  // req.user được gán từ 'protect' middleware
  res.status(200).json(req.user);
});

/**
 * Đăng xuất người dùng (Chỉ mang tính hình thức cho client)
 */
const logout = asyncHandler(async (req, res, next) => {
  // Với JWT stateless, backend không cần làm gì.
  // Client chịu trách nhiệm xóa token.
  // Chúng ta trả về 200 OK để xác nhận.
  res.status(200).json({ message: 'Logout successful' });
});

// ... (các import cũ)
// Thêm import bcrypt nếu chưa có để xử lý đổi mật khẩu

// ... (register, login, getMe giữ nguyên)

/**
 * @desc    Cập nhật hồ sơ người dùng (Name, Avatar, Password)
 * @route   PUT /api/v1/auth/updatedetails
 * @access  Private
 */
const updateDetails = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler(404, 'User not found'));
  }

  // 1. Cập nhật Tên
  if (req.body.name) {
    user.name = req.body.name;
  }

  // 2. Cập nhật Avatar
  if (req.body.avatar) {
    user.avatar = req.body.avatar;
  }

  // 3. Cập nhật Email (Cần logic xác thực phức tạp hơn ở thực tế, ở đây làm đơn giản)
  if (req.body.email) {
    user.email = req.body.email;
  }

  // 4. Cập nhật Mật khẩu
  if (req.body.password) {
    // Hash mật khẩu mới
    // const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(req.body.password, salt);
    user.password = req.body.password;
  }

  await user.save();

  // Trả về token mới (nếu cần) hoặc user mới
  res.status(200).json({
    success: true,
    data: user,
  });
});


module.exports = {
  register,
  login,
  getMe,
  logout, // <-- Thêm dòng này
  updateDetails, // <-- Export thêm hàm này
};