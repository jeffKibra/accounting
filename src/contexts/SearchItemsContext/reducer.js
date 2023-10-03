import {
  SET_FILTERS,
  SET_FILTER,
  REMOVE_FILTER,
  CLEAR_FILTERS,
  SET_FILTER_FOR_ITEMS_IDS_TO_EXCLUDE,
  SET_HITS_PER_PAGE,
  // SET_PAGE_INDEX,
  SET_VALUE_TO_SEARCH,
  SET_FIELD,
} from './actions';

function setField(state, action) {
  const payload = action?.payload || {};
  const { field, value } = payload;

  return {
    ...state,
    [field]: value,
  };
}

function removeFilter(state, action) {
  const payload = action?.payload || {};
  const { field, value } = payload;
  const currentFilters = state.filters;

  if (currentFilters) {
    const fieldValues = currentFilters[field];
    if (fieldValues) {
      delete currentFilters[field][value];
    }
  }

  return {
    ...state,
    filters: { ...currentFilters },
    pageIndex: 0, //reset page index
  };
}

// function setPageIndex(state, action) {
//   const incomingPageIndex = action.payload;
//   const currentPageIndex = state.pageIndex;
//   console.log({ currentPageIndex, incomingPageIndex });
//   const paginationAction =
//     incomingPageIndex > currentPageIndex ? 'NEXT_PAGE' : 'PREV_PAGE';

//   return { ...state, pageIndex: incomingPageIndex, paginationAction };
// }

//
function reducer(state, action) {
  const payload = action?.payload;

  switch (action.type) {
    case SET_VALUE_TO_SEARCH:
      return { ...state, valueToSearch: payload, pageIndex: 0 };

    case SET_FILTERS:
      return { ...state, filters: payload, pageIndex: 0 };
    case SET_FILTER:
      return { ...state, filters: payload, pageIndex: 0 };
    case REMOVE_FILTER:
      return removeFilter(action, payload);
    case CLEAR_FILTERS:
      return { ...state, filters: null, pageIndex: 0 };

    case SET_HITS_PER_PAGE:
      return { ...state, hitsPerPage: payload, pageIndex: 0 };

    // case SET_PAGE_INDEX:
    //   return setPageIndex(state, action);

    case SET_FILTER_FOR_ITEMS_IDS_TO_EXCLUDE:
      return {
        ...state,
        filterForItemsIdsToExclude: payload,
        pageIndex: 0, //reset page index
      };

    case SET_FIELD:
      return setField(state, action);

    default:
      return state;
  }
}

export default reducer;
