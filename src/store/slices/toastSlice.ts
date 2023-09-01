import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type State = {
  info: string;
  warning: string;
  success: string;
  error: string;
};

const initialState = {
  info: "",
  warning: "",
  success: "",
  error: "",
};

const toastSlice = createSlice({
  name: "toast_slice",
  initialState: {
    ...initialState,
  },
  reducers: {
    info: (state: State, action: PayloadAction<string>) => {
      const { payload } = action;
      return {
        ...state,
        info: payload,
      };
    },
    warning: (state: State, action: PayloadAction<string>) => {
      const { payload } = action;
      return {
        ...state,
        warning: payload,
      };
    },
    success: (state: State, action: PayloadAction<string>) => {
      const { payload } = action;
      return {
        ...state,
        success: payload,
      };
    },
    error: (state: State, action: PayloadAction<string>) => {
      const { payload } = action;
      return {
        ...state,
        error: payload,
      };
    },
  },
});

export const { info, warning, success, error } = toastSlice.actions;
export const toastReducer = toastSlice.reducer;

export default toastSlice;
