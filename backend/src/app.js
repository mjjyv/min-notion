const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/env');

const ErrorHandler = require('./utils/errorHandler');

const authRoutes = require('./routes/auth.routes');
const pageRoutes = require('./routes/page.routes'); // <-- THÊM DÒNG NÀY
// ...
const uploadRoutes = require('./routes/upload.routes'); // <-- Import


const app = express();

// 1. Middlewares Bảo mật & Thiết yếu
app.use(helmet()); // Áp dụng các headers bảo mật
app.use(cors()); // Cho phép Cross-Origin Requests


// 2. Middlewares Xử lý Dữ liệu
app.use(express.json()); // Parser cho JSON body
app.use(express.urlencoded({ extended: true })); // Parser cho form data


// 3. Middleware Logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev')); // Chỉ log request ở môi trường 'dev'
}

// 4. API Routes (sẽ được thêm ở giai đoạn sau)
// Ví dụ: app.use('/api/v1/auth', authRoutes);
// Sử dụng authRoutes cho tất cả request tới /api/v1/auth
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/pages', pageRoutes); // <-- THÊM DÒNG NÀY
app.use('/api/v1/upload', uploadRoutes); // <-- Đăng ký


// 5. Route Kiểm tra Sức khỏe (Health Check)
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is healthy' });
});


// 6. Xử lý 404 (Not Found) - Đặt sau các routes
app.use((req, res, next) => {
  // Tạo lỗi 404 và chuyển cho global handler
  next(new ErrorHandler(404, `Resource not found - ${req.originalUrl}`));
});


// 7. Global Error Handler (Xử lý lỗi tập trung) - Đặt cuối cùng
app.use((err, req, res, next) => {
  // Mặc định là lỗi 500 nếu không phải là ErrorHandler tùy chỉnh
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Log lỗi chi tiết ở môi trường dev
  if (config.nodeEnv === 'development') {
    console.error('ERROR STACK:', err.stack);
  }

  res.status(err.statusCode).json({
    message: err.message,
    // (Tùy chọn) Chỉ hiển thị stack trace ở môi trường dev
    // stack: config.nodeEnv === 'development' ? err.stack : undefined,
  });
});

module.exports = app;