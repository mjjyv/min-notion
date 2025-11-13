const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/env');

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

// 5. Route Kiểm tra Sức khỏe (Health Check)
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is healthy' });
});

// 6. Xử lý 404 (Not Found) - Đặt sau các routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});

// 7. Global Error Handler (Xử lý lỗi tập trung) - Đặt cuối cùng
app.use((err, req, res, next) => {
  console.error(err.stack); // Log lỗi ra console
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;