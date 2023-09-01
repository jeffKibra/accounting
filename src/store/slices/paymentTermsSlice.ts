import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PaymentTerm } from "../../types";

type State = {
  loading: boolean;
  isModified: boolean;
  paymentTerms: PaymentTerm[] | null;
  action: string | null;
  error: { code?: string; message?: string } | null;
};

const initialState: State = {
  loading: false,
  isModified: false,
  paymentTerms: null,
  action: null,
  error: null,
};

const paymentTermsSlice = createSlice({
  name: "paymentTerms_slice",
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
    paymentTermsSuccess: (
      state: State,
      action: PayloadAction<PaymentTerm[]>
    ) => {
      return {
        ...state,
        loading: false,
        paymentTerms: action.payload,
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

export const { start, success, paymentTermsSuccess, fail, reset } =
  paymentTermsSlice.actions;
export const paymentTermsReducer = paymentTermsSlice.reducer;

export default paymentTermsSlice;
