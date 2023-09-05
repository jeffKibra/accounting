import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import algoliasearch from 'algoliasearch';

//
import {
  startLoading,
  stopLoading,
  fail,
  itemsSuccess,
} from 'store/slices/itemsSlice';
//

const algoliaAppId = process.env.REACT_APP_ALGOLIA_APP_ID;
const alogoliaSearchApiKey = process.env.REACT_APP_ALGOLIA_SEARCH_API_KEY;

const client = algoliasearch(algoliaAppId, alogoliaSearchApiKey);
const itemsIndex = client.initIndex('items');

// function createFilterStringFromArray(array) {
//   let string = '';

//   if (Array.isArray(array)) {
//     string = array.join(' ');
//   }

//   return string;
// }

function createObjectIdsToExcludeFilterFromArray(stringsArray = []) {
  function getStringFilter(itemId) {
    return `NOT objectID:${itemId}`;
  }

  let combinedString = '';

  const firstString = stringsArray[0];
  if (firstString) {
    combinedString = getStringFilter(firstString);
  }

  if (Array.isArray(stringsArray) && stringsArray.length > 0) {
    stringsArray.forEach((string, i) => {
      //skip first string as it is used for initialization
      if (i === 0) {
        return;
      }

      // console.log({ i });
      combinedString += ` AND ${getStringFilter(string)}`;
    });
  }

  // console.log({ combinedString, stringsArray });

  return String(combinedString).trim();
}

export default function useSearchItems(idsForItemsToExclude) {
  const dispatch = useDispatch();

  const orgId = useSelector(state => state?.orgsReducer?.org?.orgId);
  // console.log({ orgId });

  const itemsReducer = useSelector(state => state?.itemsReducer) || {};
  const { loading, items, error } = itemsReducer;

  const setError = useCallback(
    incomingError => {
      dispatch(fail(incomingError));
    },
    [dispatch]
  );

  const setLoadingStatus = useCallback(
    status => {
      console.log({ status });
      dispatch(status ? startLoading() : stopLoading());
    },
    [dispatch]
  );

  //----------------------------------------------------------------

  const [result, setResult] = useState(null);
  //
  const [state, setState] = useState({
    hitsPerPage: 2,
    pageIndex: 0,
    filters: null,
    valueToSearch: '',
    idsForItemsToExclude: null,
    filterForItemsIdsToExclude: '',
  });
  const {
    hitsPerPage,
    pageIndex,
    filters,
    valueToSearch,
    filterForItemsIdsToExclude,
  } = state;

  // console.log({ valueToSearch });

  const setValueToSearch = useCallback(inValue => {
    setState(current => ({ ...current, valueToSearch: inValue, pageIndex: 0 }));
  }, []);

  const setFilters = useCallback(inValue => {
    setState(current => ({ ...current, filters: inValue, pageIndex: 0 }));
  }, []);

  const setHitsPerPage = useCallback(inValue => {
    setState(current => ({ ...current, hitsPerPage: inValue, pageIndex: 0 }));
  }, []);

  const setFilterForItemsIdsToExclude = useCallback(idsForItemsToExclude => {
    console.log('idsForItemsToExclude', idsForItemsToExclude);

    let filterSubString = '';

    if (Array.isArray(idsForItemsToExclude)) {
      filterSubString = createObjectIdsToExcludeFilterFromArray(
        idsForItemsToExclude || []
      );
    }

    setState(current => ({
      ...current,
      idsForItemsToExclude,
      filterForItemsIdsToExclude: filterSubString,
      pageIndex: 0, //reset page index
    }));
  }, []);

  const setPageIndex = useCallback(inValue => {
    setState(current => ({ ...current, pageIndex: inValue }));
  }, []);

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
  }, [setError]);

  //----------------------------------------------------------------

  useEffect(() => {
    try {
      console.log('searching algolia ...', valueToSearch);
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

      itemsIndex
        .search(valueToSearch, {
          hitsPerPage,
          ...(filtersString ? { filters: filtersString } : {}),
          ...(pageNumberIsValid ? { page: pageIndex } : {}),
        })
        .then(searchResult => {
          console.log('algolia search result', { searchResult });

          setResult(searchResult);

          const hits = searchResult?.hits || [];

          const items = hits.map(hit => {
            const itemId = hit?.objectID;
            return { ...hit, itemId };
          });

          dispatch(itemsSuccess(items));
        })
        .catch(error => {
          console.error(error);
          setError(error);
        })
        .finally(() => {
          setLoadingStatus(false);
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
    dispatch,
    filterForItemsIdsToExclude,
    hitsPerPage,
    pageIndex,
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

  const list = result?.hits || [];
  const fullListLength = result?.nbHits || 0;
  const pageCount = result?.nbPages || 0;
  // const pageIndex = result?.page || 0;

  //----------------------------------------------------------------

  return {
    result,
    error,
    loading,
    items,
    list,
    fullListLength,
    pageCount,
    pageIndex,
    setPageIndex,
    hitsPerPage,
    setHitsPerPage,
    filters,
    updateFilters,
    valueToSearch,
    setValueToSearch,
    search: setValueToSearch,
    setFilterForItemsIdsToExclude,
    filterForItemsIdsToExclude,
  };
}
