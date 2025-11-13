const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler'); // <-- Thêm dòng này
const ErrorHandler = require('../utils/errorHandler'); // <-- Thêm dòng này

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

module.exports = {
  register,
  login,
  getMe,
  logout, // <-- Thêm dòng này
};