import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  info: false,
  warning: false,
  success: false,
  error: false,
};

const toastSlice = createSlice({
  name: "toast_slice",
  initialState: {
    ...initialState,
  },
  reducers: {
    info: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        info: payload,
      };
    },
    warning: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        warning: payload,
      };
    },
    success: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        success: payload,
      };
    },
    error: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        error: payload,
      };
    },
  },
});

export const { info, warning, success, error } = toastSlice.actions;
export const toastReducer = toastSlice.reducer;

export default toastSlice;
