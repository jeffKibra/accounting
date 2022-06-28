import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  isModified: false,
  summary: null,
  summaries: null,
  action: null,
  error: null,
};

const summariesSlice = createSlice({
  name: "summaries_slice",
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
    summarySuccess: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        summary: payload,
      };
    },
    summariesSuccess: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        summaries: payload,
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

export const { start, success, summarySuccess, summariesSuccess, fail, reset } =
  summariesSlice.actions;
export const summariesReducer = summariesSlice.reducer;

export default summariesSlice;
