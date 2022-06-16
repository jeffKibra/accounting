import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  isModified: false,
  salesReceipt: null,
  salesReceipts: null,
  action: null,
  error: null,
};

const salesReceiptsSlice = createSlice({
  name: "salesReceipts_slice",
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
    salesReceiptSuccess: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        salesReceipt: payload,
      };
    },
    salesReceiptsSuccess: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        salesReceipts: payload,
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

export const {
  start,
  success,
  salesReceiptSuccess,
  salesReceiptsSuccess,
  fail,
  reset,
} = salesReceiptsSlice.actions;
export const salesReceiptsReducer = salesReceiptsSlice.reducer;

export default salesReceiptsSlice;
