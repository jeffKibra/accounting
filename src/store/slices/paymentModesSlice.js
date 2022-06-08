import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  isModified: false,
  paymentModes: null,
  action: null,
  error: null,
};

const paymentModesSlice = createSlice({
  name: "paymentModes_slice",
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
    paymentModesSuccess: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        paymentModes: payload,
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

export const { start, success, paymentModesSuccess, fail, reset } =
  paymentModesSlice.actions;
export const paymentModesReducer = paymentModesSlice.reducer;

export default paymentModesSlice;
