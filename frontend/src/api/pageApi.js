import api from './axios'; // Import instance Axios đã tùy chỉnh

/**
 * Lấy danh sách (sidebar) các trang của người dùng.
 * (Backend chỉ trả về: id, title, timestamps)
 * @returns {Promise<Array>} Danh sách các trang
 */
export const getPages = async () => {
  try {
    const response = await api.get('/pages');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Tạo một trang mới.
 * @param {object} pageData - { title: string }
 * @returns {Promise<object>} Trang mới đã được tạo
 */
export const createPage = async (pageData = { title: 'Untitled' }) => {
  try {
    const response = await api.post('/pages', pageData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Lấy chi tiết đầy đủ của một trang (bao gồm cả 'content').
 * @param {string} id - Page ID
 * @returns {Promise<object>} Chi tiết trang
 */
export const getPageDetail = async (id) => {
  try {
    const response = await api.get(`/pages/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Cập nhật tiêu đề của một trang.
 * (GĐ 4 sẽ mở rộng hàm này để cập nhật 'content')
 * @param {string} id - Page ID
 * @param {object} updateData - { title: string }
 * @returns {Promise<object>} Trang đã được cập nhật
 */
export const updatePage = async (id, updateData) => {
  try {
    const response = await api.put(`/pages/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Xóa một trang.
 * @param {string} id - Page ID
 * @returns {Promise<void>}
 */
export const deletePage = async (id) => {
  try {
    await api.delete(`/pages/${id}`);
    // Backend trả về 204 No Content, nên không có data
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};


/**
 * NÂNG CẤP GĐ 4:
 * Cập nhật chỉ nội dung (content) của một trang.
 * @param {string} id - Page ID
 * @param {Array} contentData - Mảng content blocks
 * @returns {Promise<object>} Nội dung đã được cập nhật
 */
export const updatePageContent = async (id, contentData) => {
  try {
    const response = await api.put(`/pages/${id}/content`, {
      content: contentData,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};