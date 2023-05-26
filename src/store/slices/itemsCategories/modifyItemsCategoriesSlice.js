import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  isModified: false,
  error: null,
};

const modifyItemsCategoriesSlice = createSlice({
  name: 'modify_VEHICLEs_categories_slice',
  initialState: {
    ...initialState,
  },
  reducers: {
    start: state => {
      return {
        ...state,
        loading: true,
      };
    },
    success: state => {
      return {
        ...state,
        loading: false,
        isModified: true,
      };
    },
    fail: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        error: payload,
      };
    },
    reset: state => {
      return {
        ...initialState,
      };
    },
  },
});

export const { start, success, fail, reset } =
  modifyItemsCategoriesSlice.actions;

export const modifyItemsCategoriesReducer = modifyItemsCategoriesSlice.reducer;

export default modifyItemsCategoriesSlice;
