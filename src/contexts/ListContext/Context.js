import { createContext } from 'react';

//

export const initialState = {
  sortBy: ['searchScore', 'desc'],
  hitsPerPage: 2,
  filters: null,
  facets: {},
};

//
export const contextDefaultValues = {
  ...initialState,
  rawResult: null,
  loading: false,
  error: null,
  //
  page: 0,
  pageCount: 0,
  count: 0,
  list: [],
  meta: null,
  //
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
  refetchQuery: () => {},
  handleSortByChange: () => {},
  getQueryVariables: () => {},
  //form methods
  getValues: () => {},
  setValue: () => {},
  control: null,
  watch: () => {},
};

//useReducer actions

//----------------------------------------------------------------

const ListContext = createContext(contextDefaultValues);
export default ListContext;
