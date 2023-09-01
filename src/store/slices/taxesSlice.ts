import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Tax } from "../../types";

type State = {
  loading: boolean;
  isModified: boolean;
  taxes: Tax[] | null;
  tax: Tax | null;
  action: string | null;
  error: { code?: string; message?: string; stacktrace?: string } | null;
};

const initialState: State = {
  loading: false,
  taxes: null,
  tax: null,
  isModified: false,
  error: null,
  action: null,
};

const taxesSlice = createSlice({
  name: "taxes_slice",
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
    taxSuccess: (state: State, action: PayloadAction<Tax>) => {
      return {
        ...state,
        loading: false,
        tax: action.payload,
      };
    },
    taxesSuccess: (state: State, action: PayloadAction<Tax[]>) => {
      return {
        ...state,
        loading: false,
        taxes: action.payload,
      };
    },
    success: (state: State) => {
      return {
        ...state,
        loading: false,
        isModified: true,
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

export const { start, success, taxSuccess, taxesSuccess, fail, reset } =
  taxesSlice.actions;
export const taxesReducer = taxesSlice.reducer;

export default taxesSlice;
