import { useReducer, useEffect, useCallback } from 'react';
import {
  getPages,
  createPage,
  deletePage,
} from '../api/pageApi';

const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  ADD_PAGE: 'ADD_PAGE',
  DELETE_PAGE: 'DELETE_PAGE',
  UPDATE_PAGE_IN_LIST: 'UPDATE_PAGE_IN_LIST',
};

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
      return {
        ...state,
        pages: [action.payload, ...state.pages],
      };
    case ACTIONS.DELETE_PAGE:
      return {
        ...state,
        pages: state.pages.filter((page) => page._id !== action.payload),
      };
    case ACTIONS.UPDATE_PAGE_IN_LIST:
      return {
        ...state,
        pages: state.pages.map((page) =>
          page._id === action.payload._id
            ? { ...page, ...action.payload }
            : page
        ),
      };
    default:
      return state;
  }
};

export const usePages = () => {
  const [state, dispatch] = useReducer(pagesReducer, {
    pages: [],
    isLoading: true,
    error: null,
  });

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
  }, []);

  const addNewPage = useCallback(async (title) => {
    try {
      const newPage = await createPage({ title });
      dispatch({ type: ACTIONS.ADD_PAGE, payload: newPage });
      return newPage;
    } catch (err) {
      console.error('Failed to add page:', err);
    }
  }, []);

  const removePage = useCallback(async (id) => {
    try {
      await deletePage(id);
      dispatch({ type: ACTIONS.DELETE_PAGE, payload: id });
    } catch (err) {
      console.error('Failed to delete page:', err);
    }
  }, []);

  const updatePageInList = useCallback((updatedPage) => {
    const { _id, title, icon } = updatedPage;
    dispatch({ type: ACTIONS.UPDATE_PAGE_IN_LIST, payload: { _id, title, icon } });
  }, []);

  return {
    ...state,
    addNewPage,
    removePage,
    updatePageInList,
  };
};