import { createContext } from 'react';

//
import {
  contextDefaultValues as searchContextDefaultValues,
  initialState as searchContextInitialState,
} from '../SearchContext/Context';

const initialState = {
  ...searchContextInitialState,
};

//
const contextDefaultValues = {
  ...searchContextDefaultValues,
  ...initialState,
  // result: null,
};

//useReducer actions

//----------------------------------------------------------------

const SearchItemsContext = createContext(contextDefaultValues);
export default SearchItemsContext;
