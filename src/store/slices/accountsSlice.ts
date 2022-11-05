import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AccountFromDb } from '../../types';

type State = {
  loading: boolean;
  isModified: boolean;
  account: AccountFromDb | null;
  accounts: AccountFromDb[] | null;
  action: string | null;
  error: { code?: string; message?: string } | null;
};

const initialState: State = {
  loading: false,
  isModified: false,
  account: null,
  accounts: null,
  action: '',
  error: null,
};

const accountsSlice = createSlice({
  name: 'accounts_slice',
  initialState,
  reducers: {
    start: (state: State, action: PayloadAction<string>) => {
      return {
        ...state,
        loading: true,
        error: null,
        action: action.payload,
      };
    },
    success: (state: State, action: PayloadAction<string>) => {
      return {
        ...state,
        loading: false,
        isModified: true,
      };
    },
    accountSuccess: (state: State, action: PayloadAction<AccountFromDb>) => {
      return {
        ...state,
        loading: false,
        account: action.payload,
      };
    },
    accountsSuccess: (
      state: State,
      action: PayloadAction<AccountFromDb[] | null>
    ) => {
      return {
        ...state,
        loading: false,
        accounts: action.payload,
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
        action: '',
      };
    },
  },
});

export const { start, success, accountSuccess, accountsSuccess, fail, reset } =
  accountsSlice.actions;
export const accountsReducer = accountsSlice.reducer;

export default accountsSlice;
