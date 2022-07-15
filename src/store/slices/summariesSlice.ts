import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { DailySummary } from "../../types";

type State = {
  loading: boolean;
  isModified: boolean;
  summary: DailySummary | null;
  summaries: DailySummary[] | null;
  action: string | null;
  error: { code?: string; message?: string } | null;
};

const initialState: State = {
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
    start: (state: State, action: PayloadAction<string>) => {
      return {
        ...state,
        loading: true,
        error: null,
        action: action.payload,
      };
    },
    success: (state: State) => {
      return {
        ...state,
        loading: false,
        isModified: true,
      };
    },
    summarySuccess: (state: State, action: PayloadAction<DailySummary>) => {
      return {
        ...state,
        loading: false,
        summary: action.payload,
      };
    },
    summariesSuccess: (state: State, action: PayloadAction<DailySummary[]>) => {
      return {
        ...state,
        loading: false,
        summaries: action.payload,
      };
    },
    fail: (state: State, action: PayloadAction<{}>) => {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    reset: (state: State) => {
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
