import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Org } from '../../types';

type State = {
  loading: boolean;
  isModified: boolean;
  orgs: Org[] | null;
  org: Org | null;
  action: string | null;
  error: { code?: string; message?: string; stack?: string } | null;
};

const initialState: State = {
  loading: false,
  isModified: false,
  orgs: null,
  org: null,
  action: null,
  error: null,
};

const orgsSlice = createSlice({
  name: 'orgs_slice',
  initialState: {
    ...initialState,
  },
  reducers: {
    start: (state: State, action: PayloadAction<string>) => {
      const { payload } = action;
      return {
        ...state,
        loading: true,
        action: payload,
        error: null,
      };
    },
    success: (state: State, action: PayloadAction<Org | null>) => {
      const { payload } = action;

      const orgId = payload?.orgId || '';
      localStorage.setItem('orgId', orgId);
      //todo: remove orgId from local storage on logout

      return {
        ...state,
        loading: false,
        org: payload,
        isModified: true,
      };
    },
    orgsSuccess: (state: State, action: PayloadAction<Org[] | null>) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        orgs: payload,
      };
    },
    orgSuccess: (state: State, action: PayloadAction<Org | null>) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        org: payload,
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
        loading: false,
        error: null,
        isModified: false,
        action: null,
      };
    },
  },
});

export const { start, success, orgSuccess, orgsSuccess, fail, reset } =
  orgsSlice.actions;

export const orgsReducer = orgsSlice.reducer;

export default orgsSlice;
