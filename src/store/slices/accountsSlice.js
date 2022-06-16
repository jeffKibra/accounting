import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  isModified: false,
  account: null,
  accounts: null,
  action: null,
  error: null,
};

const accountsSlice = createSlice({
  name: "accounts_slice",
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
    accountSuccess: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        account: payload,
      };
    },
    accountsSuccess: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        accounts: payload,
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

export const { start, success, accountSuccess, accountsSuccess, fail, reset } =
  accountsSlice.actions;
export const accountsReducer = accountsSlice.reducer;

export default accountsSlice;
