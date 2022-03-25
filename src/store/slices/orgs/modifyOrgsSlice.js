import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  isModified: false,
  error: null,
};

const modifyOrgsSlice = createSlice({
  name: "modifyOrgsSlice",
  initialState: {
    ...initialState,
  },
  reducers: {
    modifyOrgsStart: (state, action) => {
      return {
        ...state,
        loading: true,
        error: null,
      };
    },
    modifyOrgsSuccess: (state, action) => {
      return {
        ...state,
        loading: false,
        isModified: true,
      };
    },
    modifyOrgsFail: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        error: payload,
      };
    },
    modifyOrgsReset: (state, action) => {
      return {
        ...initialState,
      };
    },
  },
});

export const {
  modifyOrgsStart,
  modifyOrgsSuccess,
  modifyOrgsFail,
  modifyOrgsReset,
} = modifyOrgsSlice.actions;

export const modifyOrgsReducer = modifyOrgsSlice.reducer;

export default modifyOrgsSlice;
