import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ICarModel } from '../../types';
//
type ICarModels = Record<string, ICarModel>;

type State = {
  loading: boolean;
  isModified: boolean;
  carModels: ICarModels | null;
  carModel: ICarModel | null;
  action: string | null;
  error: { code?: string; message?: string; stack?: string } | null;
};

export const initialState: State = {
  loading: false,
  isModified: false,
  carModels: null,
  carModel: null,
  action: null,
  error: null,
};

const carModelsSlice = createSlice({
  name: 'car_models_slice',
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
    carModelsSuccess: (state: State, action: PayloadAction<ICarModels>) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        carModels: payload,
      };
    },
    carModelSuccess: (state: State, action: PayloadAction<ICarModel>) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        carModel: payload,
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

export const {
  start,
  success,
  carModelSuccess,
  carModelsSuccess,
  fail,
  reset,
} = carModelsSlice.actions;

export const carModelsReducer = carModelsSlice.reducer;

export default carModelsSlice;
