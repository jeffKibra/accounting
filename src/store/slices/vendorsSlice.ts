import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IContact } from '../../types';

type State = {
  loading: boolean;
  isModified: boolean;
  vendor: IContact | null;
  vendors: IContact[] | null;
  action: string | null;
  error: { code?: string; message?: string } | null;
};

const initialState: State = {
  loading: false,
  isModified: false,
  vendor: null,
  vendors: null,
  action: null,
  error: null,
};

const vendorsSlice = createSlice({
  name: 'vendors_slice',
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
    vendorSuccess: (state: State, action: PayloadAction<IContact>) => {
      return {
        ...state,
        loading: false,
        vendor: action.payload,
      };
    },
    vendorsSuccess: (state: State, action: PayloadAction<IContact[]>) => {
      return {
        ...state,
        loading: false,
        vendors: action.payload,
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

export const { start, success, vendorSuccess, vendorsSuccess, fail, reset } =
  vendorsSlice.actions;
export const vendorsReducer = vendorsSlice.reducer;

export default vendorsSlice;
