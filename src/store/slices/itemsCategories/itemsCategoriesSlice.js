import { createSlice } from "@reduxjs/toolkit";

const itemsCategoriesSlice = createSlice({
  name: "itemsCategoriesSlice",
  initialState: {
    loading: false,
    categories: null,
    category: null,
    error: null,
  },
  reducers: {
    start: (state, action) => {
      return {
        ...state,
        loading: true,
        error: null,
      };
    },
    categoriesSuccess: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        categories: payload,
      };
    },
    categorySuccess: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        category: payload,
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
  },
});

export const { start, categorySuccess, categoriesSuccess, fail } =
  itemsCategoriesSlice.actions;

export const itemsCategoriesReducer = itemsCategoriesSlice.reducer;

export default itemsCategoriesSlice;
