import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  isModified: false,
  expense: null,
  expenses: null,
  action: null,
  error: null,
};

const expensesSlice = createSlice({
  name: "expenses_slice",
  initialState: {
    ...initialState,
  },
  reducers: {
    start: (state, { payload }) => {
      return {
        ...state,
        loading: true,
        error: null,
        action: payload,
      };
    },
    success: (state) => {
      return {
        ...state,
        loading: false,
        isModified: true,
      };
    },
    expenseSuccess: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        expense: payload,
      };
    },
    expensesSuccess: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        expenses: payload,
      };
    },
    fail: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        error: payload,
      };
    },
    reset: (state) => {
      return {
        ...state,
        isModified: false,
        error: null,
        action: null,
      };
    },
  },
});

export const { start, success, expenseSuccess, expensesSuccess, fail, reset } =
  expensesSlice.actions;
export const expensesReducer = expensesSlice.reducer;

export default expensesSlice;
