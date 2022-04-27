import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  userProfile: null,
  action: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth_slice",
  initialState: {
    ...initialState,
  },
  reducers: {
    start: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: true,
        action: payload,
        error: null,
      };
    },
    success: (state, action) => {
      const { payload } = action;

      return {
        ...state,
        loading: false,
        userProfile: payload,
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
        ...initialState,
      };
    },
  },
});

export const { start, success, fail, reset } = authSlice.actions;

export const authReducer = authSlice.reducer;

export default authSlice;
