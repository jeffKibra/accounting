import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  isModified: false,
  invoice: null,
  invoices: null,
  action: null,
  error: null,
};

const invoicesSlice = createSlice({
  name: "invoices_slice",
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
    invoiceSuccess: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        invoice: payload,
      };
    },
    invoicesSuccess: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        invoices: payload,
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

export const { start, success, invoiceSuccess, invoicesSuccess, fail, reset } =
  invoicesSlice.actions;
export const invoicesReducer = invoicesSlice.reducer;

export default invoicesSlice;
