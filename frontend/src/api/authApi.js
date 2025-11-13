import api from './axios'; // Import instance Axios đã tùy chỉnh

/**
 * Gọi API đăng nhập
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} { user, token }
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    // Ném lỗi để component/context có thể bắt
    throw error.response.data || error.message;
  }
};

/**
 * Gọi API đăng ký
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} { user }
 */
export const register = async (name, email, password) => {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};

/**
 * Gọi API lấy thông tin user hiện tại (Yêu cầu token)
 * @returns {Promise<object>} { user }
 */
export const getMe = async () => {
  try {
    // Interceptor sẽ tự động đính kèm token
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};

/**
 * Gọi API đăng xuất (Chỉ mang tính hình thức)
 */
export const logout = async () => {
  try {
    // Interceptor sẽ tự động đính kèm token
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};