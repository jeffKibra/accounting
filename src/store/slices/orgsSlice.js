import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  orgs: null,
  org: null,
  isModified: null,
  action: null,
  error: null,
};

const orgsSlice = createSlice({
  name: "orgs_slice",
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
        org: payload,
        isModified: true,
      };
    },
    orgsSuccess: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        orgs: payload,
      };
    },
    orgSuccess: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        org: payload,
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
        ...state,
        loading: false,
        error: null,
        isModified: false,
        action: null,
      };
    },
  },
});

export const { start, success, orgSuccess, orgsSuccess, fail, reset } =
  orgsSlice.actions;

export const orgsReducer = orgsSlice.reducer;

export default orgsSlice;
