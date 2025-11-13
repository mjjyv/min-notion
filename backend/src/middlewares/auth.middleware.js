const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require('../config/env'); // Dùng cho JWT_SECRET

/**
 * Middleware bảo vệ routes
 * Kiểm tra JWT và gắn user vào req
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Kiểm tra header 'Authorization'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Lấy token từ header (format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Lấy user từ DB (loại bỏ mật khẩu)
      // Gắn user vào request để các controllers sau có thể sử dụng
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
         return res.status(401).json({ message: 'User not found' });
      }

      // 5. Cho phép đi tiếp
      next();
    } catch (error) {
      // Bắt lỗi nếu token hết hạn hoặc không hợp lệ
      console.error('Authentication Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // 6. Nếu không có token
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };