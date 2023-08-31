import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Item } from '../../types';

type State = {
  loading: boolean;
  isModified: boolean;
  items: Item[] | null;
  item: Item | null;
  action: string | null;
  error: { code?: string; message?: string; stack?: string } | null;
};

export const initialState: State = {
  loading: false,
  isModified: false,
  items: null,
  item: null,
  action: null,
  error: null,
};

const itemsSlice = createSlice({
  name: 'items_slice',
  initialState: {
    ...initialState,
  },
  reducers: {
    startLoading: (state: State) => {
      return {
        ...state,
        loading: true,
      };
    },
    stopLoading: (state: State) => {
      return {
        ...state,
        loading: false,
      };
    },
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
    itemsSuccess: (state: State, action: PayloadAction<Item[]>) => {
      const { payload } = action;
      console.log('items success', payload);
      return {
        ...state,
        loading: false,
        items: payload,
      };
    },
    itemSuccess: (state: State, action: PayloadAction<Item>) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        item: payload,
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
  itemSuccess,
  itemsSuccess,
  fail,
  reset,
  startLoading,
  stopLoading,
} = itemsSlice.actions;

export const itemsReducer = itemsSlice.reducer;

export default itemsSlice;
