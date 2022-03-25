import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  userProfile: null,
  isNewUser: false,
  error: null,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    ...initialState,
  },
  reducers: {
    newUser: (state, action) => {
      const { payload } = action;

      return {
        ...state,
        isNewUser: payload,
      };
    },
    start: (state) => {
      return {
        ...state,
        loading: true,
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
    userOrgsSuccess: (state, action) => {
      const { payload } = action;

      return {
        ...state,
        loading: false,
        userProfile: { ...state.userProfile, orgs: payload },
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
      console.log({ yy: this });
      return {
        ...initialState,
      };
    },
  },
});

export const { start, success, fail, reset, newUser, userOrgsSuccess } =
  authSlice.actions;

export const authReducer = authSlice.reducer;

export default authSlice;
