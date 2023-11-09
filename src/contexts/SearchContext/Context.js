import { createContext } from 'react';

//

export const initialState = {
  sortBy: ['searchScore', 'desc'],
  hitsPerPage: 2,
  filters: null,
  valueToSearch: '',
  facets: {},
};

//
export const contextDefaultValues = {
  ...initialState,
  rawResult: null,
  loading: false,
  error: null,
  setValueToSearch: () => {},
  setFilters: () => {},
  setHitsPerPage: () => {},
  gotoPage: () => {},
  nextPage: () => {},
  previousPage: () => {},
  //modal start
  isOpen: false,
  closeFiltersModal: () => {},
  openFiltersModal: () => {},
  toggleFiltersModal: () => {},
  //modal end
  handleSearch: () => {},
  refetchQuery: () => {},
  handleSortByChange: () => {},
  getQueryVariables: () => {},
};

//useReducer actions

//----------------------------------------------------------------

const SearchContext = createContext(contextDefaultValues);
export default SearchContext;
