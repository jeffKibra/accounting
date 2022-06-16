import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  isModified: false,
  paymentTerms: null,
  action: null,
  error: null,
};

const paymentTermsSlice = createSlice({
  name: "paymentTerms_slice",
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
    paymentTermsSuccess: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        paymentTerms: payload,
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

export const { start, success, paymentTermsSuccess, fail, reset } =
  paymentTermsSlice.actions;
export const paymentTermsReducer = paymentTermsSlice.reducer;

export default paymentTermsSlice;
