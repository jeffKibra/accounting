import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AccountType } from '../../types';

type State = {
  loading: boolean;
  accountType: AccountType | null;
  accountTypes: AccountType[] | null;
  action: string | null;
  error: { code?: string; message?: string } | null;
};

const initialState: State = {
  loading: false,
  accountType: null,
  accountTypes: null,
  action: '',
  error: null,
};

const accountTypesSlice = createSlice({
  name: 'account_types_slice',
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

    accountTypeSuccess: (state: State, action: PayloadAction<AccountType>) => {
      return {
        ...state,
        loading: false,
        accountType: action.payload,
      };
    },
    accountTypesSuccess: (
      state: State,
      action: PayloadAction<AccountType[] | null>
    ) => {
      return {
        ...state,
        loading: false,
        accountTypes: action.payload,
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

export const { start, accountTypeSuccess, accountTypesSuccess, fail, reset } =
  accountTypesSlice.actions;
export const accountTypesReducer = accountTypesSlice.reducer;

export default accountTypesSlice;
