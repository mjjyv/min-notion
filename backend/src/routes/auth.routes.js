const express = require('express');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// Định nghĩa routes cho Authentication
router.post('/register', authController.register);
router.post('/login', authController.login);


// Route này YÊU CẦU đăng nhập (JWT)
// 'protect' sẽ chạy trước 'authController.getMe'
router.get('/me', protect, authController.getMe);
router.post('/logout', protect, authController.logout); // <-- Thêm dòng này

// THÊM ROUTE NÀY
router.put('/updatedetails', protect, authController.updateDetails);

module.exports = router;