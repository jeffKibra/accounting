import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  isModified: false,
  payment: null,
  payments: null,
  action: null,
  error: null,
};

const paymentsSlice = createSlice({
  name: "payments_slice",
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
    paymentSuccess: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        payment: payload,
      };
    },
    paymentsSuccess: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        payments: payload,
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

export const { start, success, paymentSuccess, paymentsSuccess, fail, reset } =
  paymentsSlice.actions;
export const paymentsReducer = paymentsSlice.reducer;

export default paymentsSlice;
