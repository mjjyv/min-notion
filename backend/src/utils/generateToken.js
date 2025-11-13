const jwt = require('jsonwebtoken');

// Lấy secret từ biến môi trường (CẦN THÊM VÀO .env)
const JWT_SECRET = process.env.JWT_SECRET;
// Lấy thời gian hết hạn (CẦN THÊM VÀO .env)
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

const generateToken = (userId) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }

  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

module.exports = generateToken;