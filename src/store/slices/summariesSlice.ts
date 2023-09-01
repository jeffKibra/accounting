import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DailySummary } from '../../types';

type State = {
  loading: boolean;
  isModified: boolean;
  summary: {
    [key: string]: DailySummary | null | {};
    main: DailySummary | null | {};
  };
  action: string | null;
  error: { code?: string; message?: string } | null;
};

const initialState: State = {
  loading: false,
  isModified: false,
  summary: { main: null },
  action: null,
  error: null,
};

const summariesSlice = createSlice({
  name: 'summaries_slice',
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
        summary: {
          ...state.summary,
          main: null,
        },
      };
    },
    success: (state: State) => {
      return {
        ...state,
        loading: false,
        isModified: true,
      };
    },

    summarySuccess: (
      state: State,
      action: PayloadAction<{
        summaryId: string;
        summaryData: DailySummary | null;
      }>
    ) => {
      const { summaryId, summaryData } = action.payload;

      return {
        ...state,
        loading: false,
        summary: {
          ...state.summary,
          [summaryId]: summaryData,
        },
      };
    },
    fail: (state: State, action: PayloadAction<{}>) => {
      return {
        ...state,
        loading: false,
        error: action.payload,
        summary: {
          ...state.summary,
          main: {},
        },
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

export const { start, success, summarySuccess, fail, reset } =
  summariesSlice.actions;
export const summariesReducer = summariesSlice.reducer;

export default summariesSlice;
