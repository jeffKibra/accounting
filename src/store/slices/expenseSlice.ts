import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Expense } from "../../types";

type State = {
  loading: boolean;
  isModified: boolean;
  expense: Expense | null;
  expenses: Expense[] | null;
  action: string | null;
  error: { code?: string; message?: string } | null;
};

const initialState: State = {
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
    expenseSuccess: (state: State, action: PayloadAction<Expense>) => {
      return {
        ...state,
        loading: false,
        expense: action.payload,
      };
    },
    expensesSuccess: (state: State, action: PayloadAction<Expense[]>) => {
      return {
        ...state,
        loading: false,
        expenses: action.payload,
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

export const { start, success, expenseSuccess, expensesSuccess, fail, reset } =
  expensesSlice.actions;
export const expensesReducer = expensesSlice.reducer;

export default expensesSlice;
