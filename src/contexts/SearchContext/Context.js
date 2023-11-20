import { createContext } from 'react';
//
import {
  initialState as ListContextInitialState,
  contextDefaultValues as ListContextDefaultValues,
} from '../ListContext/Context';

//

export const initialState = {
  ...ListContextInitialState,
  valueToSearch: '',
  facets: {},
};

//
export const contextDefaultValues = {
  ...ListContextDefaultValues,
  ...initialState,
  setValueToSearch: () => {},
  handleSearch: () => {},
  // getQueryVariables: () => {},
};

//useReducer actions

//----------------------------------------------------------------

const SearchContext = createContext(contextDefaultValues);
export default SearchContext;
