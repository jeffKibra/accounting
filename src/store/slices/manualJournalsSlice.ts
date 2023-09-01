import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IManualJournal } from '../../types';

type State = {
  loading: boolean;
  isModified: boolean;
  manualJournal: IManualJournal | null;
  manualJournals: IManualJournal[] | null;
  action: string | null;
  error: { code?: string; message?: string } | null;
};

const initialState: State = {
  loading: false,
  isModified: false,
  manualJournal: null,
  manualJournals: null,
  action: '',
  error: null,
};

const manualJournalsSlice = createSlice({
  name: 'manualJournals_slice',
  initialState,
  reducers: {
    start: (state: State, action: PayloadAction<string>) => {
      console.log('starting');
      return {
        ...state,
        loading: true,
        error: null,
        action: action.payload,
      };
    },
    success: (state: State) => {
      console.log('success');
      return {
        ...state,
        loading: false,
        isModified: true,
      };
    },
    manualJournalSuccess: (
      state: State,
      action: PayloadAction<IManualJournal>
    ) => {
      return {
        ...state,
        loading: false,
        manualJournal: action.payload,
      };
    },
    manualJournalsSuccess: (
      state: State,
      action: PayloadAction<IManualJournal[] | null>
    ) => {
      console.log('manualJournals succes action', action.payload);
      return {
        ...state,
        loading: false,
        manualJournals: action.payload,
      };
    },

    fail: (state: State, action: PayloadAction<{}>) => {
      console.log('failed');
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
        action: '',
      };
    },
  },
});

export const {
  start,
  success,
  manualJournalSuccess,
  manualJournalsSuccess,
  fail,
  reset,
} = manualJournalsSlice.actions;
export const manualJournalsReducer = manualJournalsSlice.reducer;

export default manualJournalsSlice;
