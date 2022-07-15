import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { SalesReceipt } from "../../types";

type State = {
  loading: boolean;
  isModified: boolean;
  salesReceipt: SalesReceipt | null;
  salesReceipts: SalesReceipt[] | null;
  action: string | null;
  error: { code?: string; message?: string } | null;
};

const initialState: State = {
  loading: false,
  isModified: false,
  salesReceipt: null,
  salesReceipts: null,
  action: null,
  error: null,
};

const salesReceiptsSlice = createSlice({
  name: "salesReceipts_slice",
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
    salesReceiptSuccess: (
      state: State,
      action: PayloadAction<SalesReceipt>
    ) => {
      return {
        ...state,
        loading: false,
        salesReceipt: action.payload,
      };
    },
    salesReceiptsSuccess: (
      state: State,
      action: PayloadAction<SalesReceipt[]>
    ) => {
      return {
        ...state,
        loading: false,
        salesReceipts: action.payload,
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
  salesReceiptSuccess,
  salesReceiptsSuccess,
  fail,
  reset,
} = salesReceiptsSlice.actions;
export const salesReceiptsReducer = salesReceiptsSlice.reducer;

export default salesReceiptsSlice;
