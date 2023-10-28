import { createContext } from 'react';

//

const initialState = {
  sortBy: {
    field: 'searchScore',
    direction: 'desc',
  },
  hitsPerPage: 2,
  filters: null,
  valueToSearch: '',
  facets: {
    makes: [],
    types: [],
    colors: [],
    rateRange: { min: 0, max: 0 },
  },
};

//
const contextDefaultValues = {
  ...initialState,
  selectedDates: null,
  result: null,
  pageCount: 0,
  fullListLength: 0,
  loading: false,
  items: null,
  error: null,
  setValueToSearch: () => {},
  setFilters: () => {},
  setHitsPerPage: () => {},
  setFilterForItemsIdsToExclude: () => {},
  gotoPage: () => {},
  nextPage: () => {},
  previousPage: () => {},
  closeFiltersModal: () => {},
  openFiltersModal: () => {},
  toggleFiltersModal: () => {},
  handleSearchVehicles: () => {},
};

//useReducer actions

//----------------------------------------------------------------

const SearchItemsContext = createContext(contextDefaultValues);
export default SearchItemsContext;
