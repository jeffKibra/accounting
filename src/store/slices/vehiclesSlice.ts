import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Vehicle } from '../../types';

type State = {
  loading: boolean;
  isModified: boolean;
  vehicles: Vehicle[] | null;
  vehicle: Vehicle | null;
  action: string | null;
  error: { code?: string; message?: string; stack?: string } | null;
};

export const initialState: State = {
  loading: false,
  isModified: false,
  vehicles: null,
  vehicle: null,
  action: null,
  error: null,
};

const vehiclesSlice = createSlice({
  name: 'vehicles_slice',
  initialState: {
    ...initialState,
  },
  reducers: {
    start: (state: State, action: PayloadAction<string>) => {
      const { payload } = action;
      return {
        ...state,
        loading: true,
        isModified: false,
        action: payload,
        error: null,
      };
    },
    success: (state: State) => {
      return {
        ...state,
        loading: false,
        isModified: true,
      };
    },
    vehiclesSuccess: (state: State, action: PayloadAction<Vehicle[]>) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        vehicles: payload,
      };
    },
    vehicleSuccess: (state: State, action: PayloadAction<Vehicle>) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        vehicle: payload,
      };
    },
    fail: (state: State, action: PayloadAction<{}>) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        error: payload,
      };
    },
    reset: (state: State) => {
      return {
        ...state,
        isModified: false,
        action: null,
        error: null,
      };
    },
  },
});

export const { start, success, vehicleSuccess, vehiclesSuccess, fail, reset } =
  vehiclesSlice.actions;

export const vehiclesReducer = vehiclesSlice.reducer;

export default vehiclesSlice;
