import {
  createContext,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import algoliasearch from 'algoliasearch';

//
import {
  startLoading,
  stopLoading,
  fail,
  itemsSuccess,
} from 'store/slices/itemsSlice';

//
import {
  SET_FILTERS,
  SET_VALUE_TO_SEARCH,
  SET_HITS_PER_PAGE,
  SET_PAGE_INDEX,
  SET_FILTER_FOR_ITEMS_IDS_TO_EXCLUDE,
  SET_FIELD,
} from './actions';
import reducer from './reducer';
//
import { createObjectIdsToExcludeFilterFromArray } from './utils';
//
import { algoliaAppId, alogoliaSearchApiKey } from '../../constants';

//
const client = algoliasearch(algoliaAppId, alogoliaSearchApiKey);
const itemsIndex = client.initIndex('items');
//
const initialState = {
  hitsPerPage: 2,
  pageIndex: 0,
  filters: null,
  valueToSearch: '',
  filterForItemsIdsToExclude: '',
  result: null,
};

//
const contextDefaultValues = {
  ...initialState,
  idsForItemsToExclude: null,
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
  setPageIndex: () => {},
};

//useReducer actions

//----------------------------------------------------------------

const SearchItemsContext = createContext(contextDefaultValues);
export default SearchItemsContext;

//----------------------------------------------------------------
SearchItemsContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  idsForItemsToExclude: PropTypes.array,
};

export function SearchItemsContextProvider(props) {
  // console.log({ props });
  const { children, idsForItemsToExclude } = props;
  console.log({ idsForItemsToExclude });

  const reduxDispatch = useDispatch();

  const orgId = useSelector(state => state?.orgsReducer?.org?.orgId);
  // console.log({ orgId });

  const itemsReducer = useSelector(state => state?.itemsReducer) || {};
  const { loading, items, error } = itemsReducer;

  const setError = useCallback(
    incomingError => {
      reduxDispatch(fail(incomingError));
    },
    [reduxDispatch]
  );

  const setLoadingStatus = useCallback(
    status => {
      console.log({ status });
      reduxDispatch(status ? startLoading() : stopLoading());
    },
    [reduxDispatch]
  );

  //----------------------------------------------------------------

  const [state, contextDispatch] = useReducer(reducer, initialState);

  console.log({ state });

  const setValueToSearch = useCallback(inValue => {
    contextDispatch({
      type: SET_VALUE_TO_SEARCH,
      payload: inValue,
    });
  }, []);

  const setFilters = useCallback(inValue => {
    contextDispatch({
      type: SET_FILTERS,
      payload: inValue,
    });
  }, []);

  const setHitsPerPage = useCallback(inValue => {
    contextDispatch({
      type: SET_HITS_PER_PAGE,
      payload: inValue,
    });
  }, []);

  const setFilterForItemsIdsToExclude = useCallback(idsForItemsToExclude => {
    console.log('idsForItemsToExclude', idsForItemsToExclude);

    let filterSubString = '';

    if (Array.isArray(idsForItemsToExclude)) {
      filterSubString = createObjectIdsToExcludeFilterFromArray(
        idsForItemsToExclude || []
      );
    }

    console.log({ filterSubString });

    contextDispatch({
      type: SET_FILTER_FOR_ITEMS_IDS_TO_EXCLUDE,
      payload: filterSubString,
    });
  }, []);

  const setPageIndex = useCallback(inValue => {
    contextDispatch({ type: SET_PAGE_INDEX, payload: inValue });
  }, []);

  const setResult = useCallback(incomingResult => {
    contextDispatch({
      type: SET_FIELD,
      payload: { field: 'result', value: incomingResult },
    });
  }, []);

  //----------------------------------------------------------------
  const {
    hitsPerPage,
    pageIndex,
    filters,
    valueToSearch,
    filterForItemsIdsToExclude,
    result,
  } = state;

  //----------------------------------------------------------------

  const searchAlgolia = useCallback(
    async (valueToSearch, options) => {
      try {
        console.log('searching algolia ...', { valueToSearch, options });

        const searchResult = await itemsIndex.search(valueToSearch, {
          ...options,
        });

        console.log('algolia search result', { searchResult });

        setResult(searchResult);

        const hits = searchResult?.hits || [];

        const items = hits.map(hit => {
          const itemId = hit?.objectID;
          return { ...hit, itemId };
        });

        reduxDispatch(itemsSuccess(items));
      } catch (error) {
        console.error(error);
        setError(error);
      }

      setLoadingStatus(false);
    },
    [reduxDispatch, setResult, setError, setLoadingStatus]
  );

  //----------------------------------------------------------------

  // console.log({ filterForItemsIdsToExclude });

  useEffect(() => {
    console.log(
      ' ids for items to exclude have changed...',
      idsForItemsToExclude
    );

    setFilterForItemsIdsToExclude(idsForItemsToExclude);
  }, [idsForItemsToExclude, setFilterForItemsIdsToExclude]);

  //----------------------------------------------------------------

  const filtersCombinedString = useMemo(() => {
    console.log('filters have changed', filters);
    let combinedString = '';

    if (filters) {
      const stringsArray = Object.keys(filters).map(filterKey => {
        const filterValue = filters[filterKey];

        const filterString = `${filterKey}:${filterValue}`;

        return filterString;
      });

      combinedString = stringsArray.join(' AND ');
    }

    return combinedString;
  }, [filters]);

  // console.log({ filtersCombinedString });

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, [setError, setResult]);

  //----------------------------------------------------------------

  useEffect(() => {
    try {
      reset();
      setLoadingStatus(true);

      let filtersString = `orgId:${orgId}`; //initialize using orgId-ensure user only queries their own org

      console.log({ filterForItemsIdsToExclude });

      if (filterForItemsIdsToExclude) {
        filtersString = String(filtersString).concat(
          ` AND ${filterForItemsIdsToExclude}`
        );
      }

      const pageNumberIsValid =
        !isNaN(pageIndex) && typeof pageIndex === 'number' && pageIndex >= 0;

      console.log({ filtersString });

      searchAlgolia(valueToSearch, {
        hitsPerPage,
        ...(filtersString ? { filters: filtersString } : {}),
        ...(pageNumberIsValid ? { page: pageIndex } : {}),
      });
    } catch (error) {
      console.error(error);
      setError(error);
    }
  }, [
    valueToSearch,
    orgId,
    reset,
    setError,
    setLoadingStatus,
    filterForItemsIdsToExclude,
    hitsPerPage,
    pageIndex,
    searchAlgolia,
  ]);

  //----------------------------------------------------------------

  const updateFilters = useCallback(
    (key, value) => {
      setFilters(currentVal => {
        return {
          ...currentVal,
          [key]: value,
        };
      });
    },
    [setFilters]
  );

  const fullListLength = result?.nbHits || 0;
  const pageCount = result?.nbPages || 0;

  //----------------------------------------------------------------

  return (
    <SearchItemsContext.Provider
      value={{
        //search params
        hitsPerPage,
        pageIndex,
        filters,
        valueToSearch,
        idsForItemsToExclude,
        filterForItemsIdsToExclude,
        //search result values
        result,
        pageCount,
        fullListLength,
        //redux store values
        loading,
        items,
        error,
        //fns
        setValueToSearch,
        setFilters,
        setHitsPerPage,
        setFilterForItemsIdsToExclude,
        setPageIndex,
      }}
    >
      {children}
    </SearchItemsContext.Provider>
  );
}
