import { useState, useMemo,  useCallback } from 'react';
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

export default function useSearchItems() {
  const [result, setResult] = useState(null);
  const [filters, setFilters] = useState(null);

  const [searchValue, setSearchValue] = useState('');

  const dispatch = useDispatch();

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

  console.log({ filtersCombinedString });

  const hitsPerPage = 5;

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, [setError]);

  const searchItems = useCallback(
    async (string, page) => {
      try {
        console.log('searching algolia ...', string);
        reset();
        setLoadingStatus(true);

        setSearchValue(string);

        const pageNumberIsValid =
          !isNaN(page) && typeof page === 'number' && page >= 0;
        //   console.log({ pageNumberIsValid, page });

        if (string) {
          const searchResult = await itemsIndex.search(string, {
            hitsPerPage,
            ...(pageNumberIsValid ? { page } : {}),
          });
          console.log('algolia search result', { searchResult });

          setResult(searchResult);

          const hits = searchResult?.hits || [];

          dispatch(itemsSuccess(hits));
        }
      } catch (error) {
        console.error(error);
        setError(error);
      }

      setLoadingStatus(false);
    },
    [reset, setError, setLoadingStatus, dispatch]
  );

  // useEffect(() => {
  //   searchItems('');
  // }, [searchItems]);

  const updateFilters = useCallback((key, value) => {
    setFilters(currentVal => {
      return {
        ...currentVal,
        [key]: value,
      };
    });
  }, []);

  const list = result?.hits || [];
  const fullListLength = result?.nbHits || 0;

  return {
    result,
    error,
    searchItems,
    loading,
    items,
    list,
    fullListLength,
    hitsPerPage,
    filters,
    updateFilters,
    searchValue,
    setSearchValue,
  };
}
