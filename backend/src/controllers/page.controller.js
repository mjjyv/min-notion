const pageService = require('../services/page.service');
const asyncHandler = require('../utils/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');

/**
 * @desc    Tạo trang mới
 * @route   POST /api/v1/pages
 * @access  Private
 */
const createPage = asyncHandler(async (req, res, next) => {
  // req.user.id được gán từ middleware 'protect'
  const newPage = await pageService.createPage(req.user.id, req.body);
  res.status(201).json(newPage);
});

/**
 * @desc    Lấy tất cả các trang của người dùng đã đăng nhập
 * @route   GET /api/v1/pages
 * @access  Private
 */
const getMyPages = asyncHandler(async (req, res, next) => {
  const pages = await pageService.getPagesByUser(req.user.id);
  res.status(200).json(pages);
});

/**
 * @desc    Lấy chi tiết một trang
 * @route   GET /api/v1/pages/:id
 * @access  Private
 */
const getPage = asyncHandler(async (req, res, next) => {
  const page = await pageService.getPageById(req.params.id, req.user.id);
  res.status(200).json(page);
});

/**
 * @desc    Cập nhật một trang (ví dụ: title)
 * @route   PUT /api/v1/pages/:id
 * @access  Private
 */
const updatePage = asyncHandler(async (req, res, next) => {
  const { title } = req.body;

  // Validate (GĐ 5 sẽ làm tốt hơn)
  if (!title) {
     return next(new ErrorHandler(400, 'Title is required for update'));
  }

  const updatedPage = await pageService.updatePage(
    req.params.id,
    req.user.id,
    { title },
  );
  res.status(200).json(updatedPage);
});

/**
 * @desc    Xóa một trang
 * @route   DELETE /api/v1/pages/:id
 * @access  Private
 */
const deletePage = asyncHandler(async (req, res, next) => {
  await pageService.deletePage(req.params.id, req.user.id);
  // Trả về 204 No Content khi xóa thành công
  res.status(204).send();
});


/**
 * NÂNG CẤP GĐ 4:
 * @desc    Cập nhật nội dung (content) của một trang
 * @route   PUT /api/v1/pages/:id/content
 * @access  Private
 */
const updateContent = asyncHandler(async (req, res, next) => {
  // Controller này chỉ nhận 'content'
  const { content } = req.body;

  if (content === undefined) {
    return next(new ErrorHandler(400, 'Content array is required'));
  }

  const updatedContent = await pageService.updatePageContent(
    req.params.id,
    req.user.id,
    content,
  );
  
  res.status(200).json(updatedContent);
});

module.exports = {
  createPage,
  getMyPages,
  getPage,
  updatePage,
  deletePage,
  updateContent, // <-- THÊM MỚI
};