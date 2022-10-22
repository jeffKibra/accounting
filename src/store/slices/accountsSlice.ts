import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Account } from '../../types';

type State = {
  loading: boolean;
  isModified: boolean;
  account: Account | null;
  accounts: Account[] | null;
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

const startR: (state: State, action: PayloadAction<string>) => State =
  function (state, { payload }) {
    return {
      ...state,
      loading: true,
      error: null,
      action: payload,
    };
  };

const successR: (state: State, action: PayloadAction<string>) => State =
  function (state) {
    return {
      ...state,
      loading: false,
      isModified: true,
    };
  };

const accountSuccessR: (state: State, action: PayloadAction<Account>) => State =
  function (state, { payload }) {
    return {
      ...state,
      loading: false,
      account: payload,
    };
  };

const accountsSuccessR: (
  state: State,
  action: PayloadAction<Account[] | null>
) => State = (state, { payload }) => {
  return {
    ...state,
    loading: false,
    accounts: payload,
  };
};

const failR: (state: State, action: PayloadAction<{}>) => State = (
  state,
  { payload }
) => {
  return {
    ...state,
    loading: false,
    error: payload,
  };
};

const resetR: (state: State) => State = state => {
  return {
    ...state,
    isModified: false,
    error: null,
    action: '',
  };
};

const accountsSlice = createSlice({
  name: 'accounts_slice',
  initialState,
  reducers: {
    start: startR,
    success: successR,
    accountSuccess: accountSuccessR,
    accountsSuccess: accountsSuccessR,
    fail: failR,
    reset: resetR,
  },
});

export const { start, success, accountSuccess, accountsSuccess, fail, reset } =
  accountsSlice.actions;
export const accountsReducer = accountsSlice.reducer;

export default accountsSlice;
