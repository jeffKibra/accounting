import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  isModified: false,
  customer: null,
  customers: null,
  action: null,
  error: null,
};

const customersSlice = createSlice({
  name: "customers_slice",
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
    customerSuccess: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        customer: payload,
      };
    },
    customersSuccess: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        customers: payload,
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
  customerSuccess,
  customersSuccess,
  fail,
  reset,
} = customersSlice.actions;
export const customersReducer = customersSlice.reducer;

export default customersSlice;
