import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserProfile } from "../../types";

type State = {
  loading: boolean;
  userProfile: UserProfile | null;
  action: string | null;
  error: Error | null;
};

const initialState: State = {
  loading: false,
  userProfile: null,
  action: "",
  error: null,
};

const authSlice = createSlice({
  name: "auth_slice",
  initialState: { ...initialState },
  reducers: {
    start: (state: State, action: PayloadAction<string>) => {
      const { payload } = action;
      return {
        ...state,
        loading: true,
        action: payload,
        error: null,
      };
    },
    success: (state: State, action: PayloadAction<UserProfile | null>) => {
      const { payload } = action;

      return {
        ...state,
        loading: false,
        userProfile: payload,
      };
    },
    fail: (state: State, action: PayloadAction<Error | null>) => {
      const { payload } = action;

      return {
        ...state,
        loading: false,
        error: payload,
      };
    },
    reset: () => {
      return {
        ...initialState,
      };
    },
  },
});

export const { start, success, fail, reset } = authSlice.actions;

export const authReducer = authSlice.reducer;

export default authSlice;
