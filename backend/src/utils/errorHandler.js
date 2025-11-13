/**
 * Lớp Error tùy chỉnh để chuẩn hóa lỗi HTTP
 * Kế thừa từ lớp Error tích hợp của Node.js
 */
class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;

    // Ghi lại stack trace (dấu vết lỗi)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorHandler;