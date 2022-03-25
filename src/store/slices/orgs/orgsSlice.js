import { createSlice } from "@reduxjs/toolkit";

const orgsSlice = createSlice({
  name: "orgsSlice",
  initialState: {
    loading: false,
    orgs: null,
    org: null,
    error: null,
  },
  reducers: {
    getOrgsStart: (state, action) => {
      return {
        ...state,
        loading: true,
        error: null,
      };
    },
    getOrgsSuccess: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        orgs: payload,
      };
    },
    getOrgSuccess: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        org: payload,
      };
    },
    getOrgsFail: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        error: payload,
      };
    },
  },
});

export const { getOrgsStart, getOrgsSuccess, getOrgSuccess, getOrgsFail } =
  orgsSlice.actions;

export const orgsReducer = orgsSlice.reducer;

export default orgsSlice;
