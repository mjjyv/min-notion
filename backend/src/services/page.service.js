const Page = require('../models/page.model');
const ErrorHandler = require('../utils/errorHandler');

/**
 * Tạo một trang mới cho người dùng
 * @param {string} userId - ID của người dùng (từ req.user)
 * @param {object} pageData - Dữ liệu trang (ví dụ: { title })
 * @returns {Promise<object>} Trang mới được tạo
 */
const createPage = async (userId, pageData) => {
  const { title } = pageData;
  const newPage = await Page.create({
    userId,
    title: title || 'Untitled', // Đặt tiêu đề mặc định nếu không cung cấp
  });
  return newPage;
};

/**
 * Lấy tất cả các trang của một người dùng cụ thể
 * @param {string} userId - ID của người dùng
 * @returns {Promise<Array>} Danh sách các trang (chỉ gồm id, title, timestamps)
 */
const getPagesByUser = async (userId) => {
  // Chỉ chọn các trường cần thiết cho sidebar, tối ưu hóa payload
  const pages = await Page.find({ userId }).select(
    'title createdAt updatedAt',
  );
  return pages;
};

/**
 * Lấy chi tiết một trang cụ thể, đảm bảo quyền sở hữu
 * @param {string} pageId - ID của trang
 * @param {string} userId - ID của người dùng
 * @returns {Promise<object>} Chi tiết trang
 */
const getPageById = async (pageId, userId) => {
  const page = await Page.findById(pageId);

  if (!page) {
    throw new ErrorHandler(404, 'Page not found');
  }

  // Kiểm tra quyền sở hữu
  if (page.userId.toString() !== userId) {
    throw new ErrorHandler(403, 'User not authorized to access this page');
  }

  return page;
};

/**
 * Cập nhật một trang
 * @param {string} pageId - ID của trang
 * @param {string} userId - ID của người dùng
 * @param {object} updateData - Dữ liệu cần cập nhật (ví dụ: { title })
 * @returns {Promise<object>} Trang đã được cập nhật
 */
const updatePage = async (pageId, userId, updateData) => {
  // Lấy trang (đã bao gồm kiểm tra quyền sở hữu)
  const page = await getPageById(pageId, userId);

  // Cập nhật các trường được phép (ví dụ: title, content, icon...)
  // Hiện tại chúng ta chỉ cập nhật title
  if (updateData.title) {
    page.title = updateData.title;
  }
  
  // (Giai đoạn 4 sẽ cập nhật 'content' tại đây)
  // if (updateData.content) {
  //   page.content = updateData.content;
  // }

  await page.save();
  return page;
};

/**
 * Xóa một trang
 * @param {string} pageId - ID của trang
 * @param {string} userId - ID của người dùng
 */
const deletePage = async (pageId, userId) => {
  // Lấy trang (đã bao gồm kiểm tra quyền sở hữu)
  const page = await getPageById(pageId, userId);

  await page.deleteOne(); // Sử dụng deleteOne() thay vì remove()
};


/**
 * NÂNG CẤP GĐ 4:
 * Cập nhật CHỈ content của một trang (Tối ưu cho auto-save)
 * @param {string} pageId - ID của trang
 * @param {string} userId - ID của người dùng
 * @param {Array} contentData - Mảng content blocks
 * @returns {Promise<object>} Trang đã được cập nhật
 */
const updatePageContent = async (pageId, userId, contentData) => {
  // getPageById đã bao gồm kiểm tra quyền sở hữu
  const page = await getPageById(pageId, userId);

  // Validate (GĐ 5 sẽ làm tốt hơn)
  if (!Array.isArray(contentData)) {
    throw new ErrorHandler(400, 'Content must be an array');
  }

  page.content = contentData;
  await page.save();
  return page.content; // Chỉ trả về content đã cập nhật
};


module.exports = {
  createPage,
  
  getPagesByUser,
  getPageById,
  
  updatePage,
  deletePage,
  updatePageContent, // <-- THÊM MỚI
};