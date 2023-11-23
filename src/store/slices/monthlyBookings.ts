import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IMonthlyBookings } from '../../types';
import { GET_MONTHLY_BOOKINGS } from '../actions/monthlyBookings';

type State = {
  loading: boolean;
  isModified: boolean;
  monthlyBookings: IMonthlyBookings | null;
  action: string | null;
  error: { code?: string; message?: string } | null;
};

const initialState: State = {
  loading: false,
  isModified: false,
  monthlyBookings: {},
  action: null,
  error: null,
};

const monthlyBookingsSlice = createSlice({
  name: 'monthly_bookings_slice',
  initialState: {
    ...initialState,
  },
  reducers: {
    // start: (state: State, action: PayloadAction<string | string[]>) => {
    //   const months =
    //     typeof action.payload === 'string' ? [action.payload] : action.payload;
    //   const monthlyBookingsToReset: Record<string, null> = {};
    //   months.forEach(monthId => {
    //     monthlyBookingsToReset[monthId] = null;
    //   });
    //   const { monthlyBookings } = state;
    //   return {
    //     ...state,
    //     loading: true,
    //     error: null,
    //     action: GET_MONTHLY_BOOKINGS,
    //     monthlyBookings: {
    //       ...monthlyBookings,
    //       ...monthlyBookingsToReset,
    //     },
    //   };
    // },
    // success: (state: State, action: PayloadAction<IMonthlyBookings>) => {
    //   const loadedMonthlyBookings = action.payload;
    //   const { monthlyBookings } = state;
    //   return {
    //     ...state,
    //     loading: false,
    //     monthlyBookings: {
    //       ...monthlyBookings,
    //       ...loadedMonthlyBookings,
    //     },
    //   };
    // },
    // fail: (state: State, action: PayloadAction<{}>) => {
    //   return {
    //     ...state,
    //     loading: false,
    //     error: action.payload,
    //   };
    // },
    // reset: (state: State) => {
    //   return {
    //     ...state,
    //     loading: false,
    //     isModified: false,
    //     error: null,
    //     action: null,
    //   };
    // },
  },
});

// export const { start, success, fail, reset } = monthlyBookingsSlice.actions;
export const monthlyBookingsReducer = monthlyBookingsSlice.reducer;

export default monthlyBookingsSlice;
