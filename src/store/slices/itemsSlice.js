import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  loading: false,
  isModified: false,
  items: null,
  item: null,
  action: null,
  error: null,
};

const itemsSlice = createSlice({
  name: "items_slice",
  initialState: {
    ...initialState,
  },
  reducers: {
    start: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: true,
        isModified: false,
        action: payload,
        error: null,
      };
    },
    success: (state) => {
      return {
        ...state,
        loading: false,
        isModified: true,
      };
    },
    itemsSuccess: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        items: payload,
      };
    },
    itemSuccess: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        item: payload,
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
    reset: (state) => {
      return {
        ...state,
        isModified: false,
        action: null,
        error: null,
      };
    },
  },
});

export const { start, success, itemSuccess, itemsSuccess, fail, reset } =
  itemsSlice.actions;

export const itemsReducer = itemsSlice.reducer;

export default itemsSlice;
