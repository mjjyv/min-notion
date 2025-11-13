import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getMe } from '../api/authApi'; // Sẽ tạo ở bước 2

// 1. Initial State
// Lấy token từ localStorage nếu có
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true, // Bắt đầu là true để chúng ta kiểm tra token
  user: null,
};

// 2. Reducer: Quản lý các thay đổi trạng thái
const authReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'USER_LOADING':
      return { ...state, isLoading: true };
    case 'USER_LOADED':
      // Tải user thành công (khi đã có token)
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: payload,
      };
    case 'LOGIN_SUCCESS':
      // Đăng nhập thành công
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload, // payload chứa { user, token }
        isAuthenticated: true,
        isLoading: false,
      };
    case 'AUTH_ERROR':
    case 'LOGOUT':
      // Đăng xuất hoặc lỗi
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        user: null,
      };
    default:
      return state;
  }
};

// 3. Create Context
const AuthContext = createContext();

// 4. Create Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // useEffect để kiểm tra token khi ứng dụng khởi chạy
  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          // Gọi API /me nếu có token
          const user = await getMe();
          dispatch({ type: 'USER_LOADED', payload: user });
        } catch (err) {
          // Token không hợp lệ
          dispatch({ type: 'AUTH_ERROR' });
        }
      } else {
        // Không có token
        dispatch({ type: 'AUTH_ERROR' });
      }
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy 1 lần khi khởi tạo

  return (
    <AuthContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {/* Chỉ render ứng dụng khi đã kiểm tra xong (loading=false) */}
      {!state.isLoading && children}
    </AuthContext.Provider>
  );
};

// 5. Custom Hook (để dễ dàng sử dụng context)
export const useAuth = () => {
  return useContext(AuthContext);
};