import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IContact } from '../../types';

type State = {
  loading: boolean;
  isModified: boolean;
  customer: IContact | null;
  customers: IContact[] | null;
  action: string | null;
  error: {
    code?: number;
    message?: string;
    stack?: string;
    errorMessage?: string;
    stackTrace?: string;
  } | null;
};

const initialState: State = {
  loading: false,
  isModified: false,
  customer: null,
  customers: null,
  action: null,
  error: null,
};

const customersSlice = createSlice({
  name: 'customers_slice',
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
    customerSuccess: (state: State, action: PayloadAction<IContact>) => {
      return {
        ...state,
        loading: false,
        customer: action.payload,
      };
    },
    customersSuccess: (state: State, action: PayloadAction<IContact[]>) => {
      return {
        ...state,
        loading: false,
        customers: action.payload,
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

export const {
  start,
  success,
  customerSuccess,
  customersSuccess,
  fail,
  reset,
} = customersSlice.actions;
export const customersReducer = customersSlice.reducer;

export default customersSlice;
