import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  taxes: null,
  tax: null,
  isModified: false,
  error: null,
  action: null,
};

const taxesSlice = createSlice({
  name: "taxes_slice",
  initialState: {
    ...initialState,
  },
  reducers: {
    start: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: true,
        error: null,
        action: payload,
      };
    },
    taxSuccess: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        tax: payload,
      };
    },
    taxesSuccess: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        taxes: payload,
      };
    },
    success: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        isModified: true,
      };
    },
    fail: (state, { payload }) => {
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
        error: null,
        action: null,
      };
    },
  },
});

export const { start, success, taxSuccess, taxesSuccess, fail, reset } =
  taxesSlice.actions;
export const taxesReducer = taxesSlice.reducer;

export default taxesSlice;
