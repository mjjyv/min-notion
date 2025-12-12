const Page = require('../models/page.model');
const ErrorHandler = require('../utils/errorHandler');

/**
 * Tạo một trang mới cho người dùng
 */
const createPage = async (userId, pageData) => {
  const { title } = pageData;
  const newPage = await Page.create({
    userId,
    title: title || 'Untitled',
  });
  return newPage;
};

/**
 * Lấy tất cả các trang của một người dùng cụ thể
 */
const getPagesByUser = async (userId) => {
  const pages = await Page.find({ userId }).select(
    'title createdAt updatedAt icon', // Thêm icon
  );
  return pages;
};

/**
 * Lấy chi tiết một trang cụ thể, đảm bảo quyền sở hữu
 */
const getPageById = async (pageId, userId) => {
  const page = await Page.findById(pageId);

  if (!page) {
    throw new ErrorHandler(404, 'Page not found');
  }

  if (page.userId.toString() !== userId) {
    throw new ErrorHandler(403, 'User not authorized to access this page');
  }

  return page;
};

/**
 * Cập nhật một trang (Title, Icon, Cover)
 */
const updatePage = async (pageId, userId, updateData) => {
  const page = await getPageById(pageId, userId);

  const allowedUpdates = ['title', 'icon', 'coverImage'];
  
  Object.keys(updateData).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      page[key] = updateData[key];
    }
  });

  await page.save();
  return page;
};

/**
 * Xóa một trang
 */
const deletePage = async (pageId, userId) => {
  const page = await getPageById(pageId, userId);
  await page.deleteOne();
};

/**
 * Cập nhật CHỈ content của một trang
 * SỬA LỖI: Dùng findOneAndUpdate để tránh VersionError khi auto-save nhanh
 */
const updatePageContent = async (pageId, userId, contentData) => {
  if (!Array.isArray(contentData)) {
    throw new ErrorHandler(400, 'Content must be an array');
  }

  const page = await Page.findOneAndUpdate(
    { _id: pageId, userId: userId }, // Điều kiện tìm (đảm bảo quyền sở hữu)
    { content: contentData },        // Dữ liệu cập nhật
    { 
      new: true,           // Trả về dữ liệu mới sau khi update
      runValidators: true  // Vẫn kiểm tra schema (enum, type...)
    }
  );

  if (!page) {
    throw new ErrorHandler(404, 'Page not found or unauthorized');
  }

  return page.content;
};

module.exports = {
  createPage,
  getPagesByUser,
  getPageById,
  updatePage,
  deletePage,
  updatePageContent, // <-- Hàm đã sửa
};