import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Invoice } from '../../types';
import { GET_INVOICE } from '../actions/invoicesActions';

type State = {
  loading: boolean;
  isModified: boolean;
  invoice: Invoice | null;
  invoices: Invoice[] | null;
  action: string | null;
  error: { code?: string; message?: string } | null;
};

const initialState: State = {
  loading: false,
  isModified: false,
  invoice: null,
  invoices: null,
  action: null,
  error: null,
};

const invoicesSlice = createSlice({
  name: 'invoices_slice',
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
        ...(action.payload === GET_INVOICE ? { invoice: null } : {}),
        invoices: null,
      };
    },
    success: (state: State) => {
      return {
        ...state,
        loading: false,
        isModified: true,
      };
    },
    invoiceSuccess: (state: State, action: PayloadAction<Invoice | null>) => {
      return {
        ...state,
        loading: false,
        invoice: action.payload,
      };
    },
    invoicesSuccess: (
      state: State,
      action: PayloadAction<Invoice[] | null>
    ) => {
      return {
        ...state,
        loading: false,
        invoices: action.payload,
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

export const { start, success, invoiceSuccess, invoicesSuccess, fail, reset } =
  invoicesSlice.actions;
export const invoicesReducer = invoicesSlice.reducer;

export default invoicesSlice;
