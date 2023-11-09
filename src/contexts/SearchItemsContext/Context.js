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
  selectedDates: null,
  result: null,
  pageCount: 0,
  fullListLength: 0,
  items: null,
};

//useReducer actions

//----------------------------------------------------------------

const SearchItemsContext = createContext(contextDefaultValues);
export default SearchItemsContext;
