import { useReducer, useEffect, useCallback } from 'react';
import {
  getPages,
  createPage,
  deletePage,
} from '../api/pageApi';

// 1. Định nghĩa các hành động (Actions)
const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  ADD_PAGE: 'ADD_PAGE',
  DELETE_PAGE: 'DELETE_PAGE',
};

// 2. Định nghĩa Reducer
const pagesReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, isLoading: true, error: null };
    case ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        pages: action.payload,
      };
    case ACTIONS.FETCH_ERROR:
      return { ...state, isLoading: false, error: action.payload };
    case ACTIONS.ADD_PAGE:
      // Thêm trang mới vào đầu danh sách
      return {
        ...state,
        pages: [action.payload, ...state.pages],
      };
    case ACTIONS.DELETE_PAGE:
      // Lọc bỏ trang đã xóa khỏi danh sách
      return {
        ...state,
        pages: state.pages.filter((page) => page._id !== action.payload),
      };
    default:
      return state;
  }
};

// 3. Định nghĩa Hook
export const usePages = () => {
  const [state, dispatch] = useReducer(pagesReducer, {
    pages: [],
    isLoading: true,
    error: null,
  });

  // 4. Hàm fetch dữ liệu ban đầu (chỉ chạy 1 lần)
  useEffect(() => {
    const fetchInitialPages = async () => {
      dispatch({ type: ACTIONS.FETCH_START });
      try {
        const pages = await getPages();
        dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: pages });
      } catch (err) {
        dispatch({
          type: ACTIONS.FETCH_ERROR,
          payload: err.message || 'Failed to fetch pages',
        });
      }
    };

    fetchInitialPages();
  }, []); // Mảng rỗng đảm bảo chỉ chạy 1 lần

  // 5. Hàm để component bên ngoài gọi (Thêm trang)
  const addNewPage = useCallback(async (title) => {
    try {
      const newPage = await createPage({ title });
      dispatch({ type: ACTIONS.ADD_PAGE, payload: newPage });
      return newPage; // Trả về trang mới để có thể chọn nó
    } catch (err) {
      // Xử lý lỗi (ví dụ: hiển thị thông báo)
      console.error('Failed to add page:', err);
      // Có thể dispatch FETCH_ERROR ở đây nếu muốn
    }
  }, []);

  // 6. Hàm để component bên ngoài gọi (Xóa trang)
  const removePage = useCallback(async (id) => {
    try {
      await deletePage(id);
      dispatch({ type: ACTIONS.DELETE_PAGE, payload: id });
    } catch (err) {
      console.error('Failed to delete page:', err);
    }
  }, []);

  // 7. Trả về state và các hàm
  return {
    ...state,
    addNewPage,
    removePage,
  };
};