const express = require('express');
const pageController = require('../controllers/page.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// ÁP DỤNG 'PROTECT' MIDDLEWARE CHO TẤT CẢ CÁC ROUTE BÊN DƯỚI
// Bất kỳ ai gọi các API này đều phải gửi kèm JWT token hợp lệ.
router.use(protect);

// Định tuyến các routes tới controller tương ứng
router
  .route('/')
  .post(pageController.createPage)   // POST /api/v1/pages (Tạo trang mới)
  .get(pageController.getMyPages);  // GET /api/v1/pages (Lấy tất cả trang)

router
  .route('/:id')
  .get(pageController.getPage)        // GET /api/v1/pages/:id (Lấy 1 trang)
  .put(pageController.updatePage)     // PUT /api/v1/pages/:id (Cập nhật trang)
  .delete(pageController.deletePage); // DELETE /api/v1/pages/:id (Xóa trang)

module.exports = router;