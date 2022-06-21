import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  isModified: false,
  vendor: null,
  vendors: null,
  action: null,
  error: null,
};

const vendorsSlice = createSlice({
  name: "vendors_slice",
  initialState: {
    ...initialState,
  },
  reducers: {
    start: (state, { payload }) => {
      return {
        ...state,
        loading: true,
        error: null,
        action: payload,
      };
    },
    success: (state) => {
      return {
        ...state,
        loading: false,
        isModified: true,
      };
    },
    vendorSuccess: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        vendor: payload,
      };
    },
    vendorsSuccess: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        vendors: payload,
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

export const { start, success, vendorSuccess, vendorsSuccess, fail, reset } =
  vendorsSlice.actions;
export const vendorsReducer = vendorsSlice.reducer;

export default vendorsSlice;
