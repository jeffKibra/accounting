import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { PaymentMode } from '../../types';

type State = {
  loading: boolean;
  isModified: boolean;
  paymentModes: Record<string, PaymentMode> | null;
  action: string | null;
  error: { code?: string; message?: string } | null;
};

const initialState: State = {
  loading: false,
  isModified: false,
  paymentModes: null,
  action: null,
  error: null,
};

const paymentModesSlice = createSlice({
  name: 'paymentModes_slice',
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
    paymentModesSuccess: (
      state: State,
      action: PayloadAction<Record<string, PaymentMode>>
    ) => {
      return {
        ...state,
        loading: false,
        paymentModes: action.payload,
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

export const { start, success, paymentModesSuccess, fail, reset } =
  paymentModesSlice.actions;
export const paymentModesReducer = paymentModesSlice.reducer;

export default paymentModesSlice;
