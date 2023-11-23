import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IAccount } from '../../types';

type State = {
  loading: boolean;
  isModified: boolean;
  account: IAccount | null;
  accounts: IAccount[] | null;
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

const chartOfAccountsSlice = createSlice({
  name: 'chart_of_accounts_slice',
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
    getOne: (state: State) => {
      return {
        ...state,
        account: null,
        error: null,
      };
    },
    getOneSuccess: (state: State, action: PayloadAction<IAccount | null>) => {
      return {
        ...state,
        loading: false,
        account: action.payload,
      };
    },
    getList: (state: State) => {
      return {
        ...state,
        accounts: null,
        error: null,
      };
    },
    getListSuccess: (
      state: State,
      action: PayloadAction<IAccount[] | null>
    ) => {
      console.log('accounts succes action', action.payload);
      return {
        ...state,
        loading: false,
        accounts: action.payload,
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
  getOne,
  getOneSuccess,
  getList,
  getListSuccess,
  fail,
  reset,
} = chartOfAccountsSlice.actions;
export const chartOfAccountsReducer = chartOfAccountsSlice.reducer;

export default chartOfAccountsSlice;
