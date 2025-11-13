/**
 * Hàm bọc (wrapper) cho các controller async.
 * Tự động bắt lỗi và chuyển cho global error handler (next(err)).
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;