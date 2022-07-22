import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PaymentReceived } from "../../types";

type State = {
  loading: boolean;
  isModified: boolean;
  payment: PaymentReceived | null;
  payments: PaymentReceived[] | null;
  action: string | null;
  error: Error | null;
};

const initialState: State = {
  loading: false,
  isModified: false,
  payment: null,
  payments: null,
  action: null,
  error: null,
};

const paymentsSlice = createSlice({
  name: "payments_slice",
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
    paymentSuccess: (
      state: State,
      action: PayloadAction<PaymentReceived | null>
    ) => {
      return {
        ...state,
        loading: false,
        payment: action.payload,
      };
    },
    paymentsSuccess: (
      state: State,
      action: PayloadAction<PaymentReceived[] | null>
    ) => {
      return {
        ...state,
        loading: false,
        payments: action.payload,
      };
    },
    fail: (state: State, action: PayloadAction<Error>) => {
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

export const { start, success, paymentSuccess, paymentsSuccess, fail, reset } =
  paymentsSlice.actions;
export const paymentsReducer = paymentsSlice.reducer;

export default paymentsSlice;
