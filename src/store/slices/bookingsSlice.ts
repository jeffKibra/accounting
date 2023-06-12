import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IBooking } from '../../types';
import { GET_BOOKING } from '../actions/bookingsActions';

type State = {
  loading: boolean;
  isModified: boolean;
  booking: IBooking | null;
  bookings: IBooking[] | null;
  action: string | null;
  error: { code?: string; message?: string } | null;
};

const initialState: State = {
  loading: false,
  isModified: false,
  booking: null,
  bookings: null,
  action: null,
  error: null,
};

const bookingsSlice = createSlice({
  name: 'bookings_slice',
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
        ...(action.payload === GET_BOOKING ? { booking: null } : {}),
        bookings: null,
      };
    },
    success: (state: State) => {
      return {
        ...state,
        loading: false,
        isModified: true,
      };
    },
    bookingSuccess: (state: State, action: PayloadAction<IBooking | null>) => {
      return {
        ...state,
        loading: false,
        booking: action.payload,
      };
    },
    bookingsSuccess: (
      state: State,
      action: PayloadAction<IBooking[] | null>
    ) => {
      return {
        ...state,
        loading: false,
        bookings: action.payload,
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

export const { start, success, bookingSuccess, bookingsSuccess, fail, reset } =
  bookingsSlice.actions;
export const bookingsReducer = bookingsSlice.reducer;

export default bookingsSlice;
