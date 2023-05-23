import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SaleReceipt } from '../../types';

type State = {
  loading: boolean;
  isModified: boolean;
  saleReceipt: SaleReceipt | null;
  saleReceipts: SaleReceipt[] | null;
  action: string | null;
  error: { code?: string; message?: string } | null;
};

const initialState: State = {
  loading: false,
  isModified: false,
  saleReceipt: null,
  saleReceipts: null,
  action: null,
  error: null,
};

const saleReceiptsSlice = createSlice({
  name: 'saleReceipts_slice',
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
    saleReceiptSuccess: (state: State, action: PayloadAction<SaleReceipt>) => {
      return {
        ...state,
        loading: false,
        saleReceipt: action.payload,
      };
    },
    saleReceiptsSuccess: (
      state: State,
      action: PayloadAction<SaleReceipt[]>
    ) => {
      return {
        ...state,
        loading: false,
        saleReceipts: action.payload,
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
  saleReceiptSuccess,
  saleReceiptsSuccess,
  fail,
  reset,
} = saleReceiptsSlice.actions;
export const saleReceiptsReducer = saleReceiptsSlice.reducer;

export default saleReceiptsSlice;
