import { createContext } from 'react';

//
import {
  contextDefaultValues as searchContextDefaultValues,
  initialState as searchContextInitialState,
} from '../SearchContext/Context';

const initialState = {
  ...searchContextInitialState,
  facets: {
    makes: [],
    types: [],
    colors: [],
    rateRange: { min: 0, max: 0 },
  },
};

//
const contextDefaultValues = {
  ...searchContextDefaultValues,
  ...initialState,
  result: null,
  pageCount: 0,
  fullListLength: 0,
  bookings: null,
};

//useReducer actions

//----------------------------------------------------------------

const ListInvoicesContext = createContext(contextDefaultValues);
export default ListInvoicesContext;
