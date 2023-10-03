import {
  createContext,
  useEffect,
  useReducer,
  useCallback,
  useRef,
  // useMemo,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
//
import { useQuery } from '@apollo/client';

//
import { queries } from 'gql';
//
import { getDatesWithinRange } from 'utils/dates';
//
import {
  startLoading,
  stopLoading,
  fail,
  reset as resetItems,
  // itemsSuccess,
} from 'store/slices/itemsSlice';

//
import {
  SET_FILTERS,
  SET_VALUE_TO_SEARCH,
  SET_HITS_PER_PAGE,
  // SET_PAGE_INDEX,
  // SET_FIELD,
} from './actions';
import reducer from './reducer';
//
//

//
const initialState = {
  hitsPerPage: 2,
  filters: null,
  valueToSearch: '',
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
};

//useReducer actions

//----------------------------------------------------------------

const SearchItemsContext = createContext(contextDefaultValues);
export default SearchItemsContext;

//----------------------------------------------------------------
SearchItemsContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  selectedDates: PropTypes.array,
};

const sortBy = {
  field: 'searchScore',
  direction: 'desc',
};

export function SearchItemsContextProvider(props) {
  // console.log({ props });

  const calendar = getDatesWithinRange('2023/Jan/01', '2023/Dec/31');
  // console.log({ calendar });
  const { children, selectedDates } = props;
  // console.log({ selectedDates });

  //----------------------------------------------------------------
  const isMounted = useRef(null);
  useEffect(() => {
    isMounted.current = true;
  }, []);
  //----------------------------------------------------------------

  const reduxDispatch = useDispatch();

  // console.log({ orgId });

  // const itemsReducer = useSelector(state => state?.itemsReducer) || {};
  // const { isModified } = itemsReducer;
  // console.log({ isModified });

  // const setError = useCallback(
  //   incomingError => {
  //     reduxDispatch(fail(incomingError));
  //   },
  //   [reduxDispatch]
  // );

  // const setLoadingStatus = useCallback(
  //   status => {
  //     // console.log({ status });
  //     reduxDispatch(status ? startLoading() : stopLoading());
  //   },
  //   [reduxDispatch]
  // );

  //----------------------------------------------------------------

  const [state, contextDispatch] = useReducer(reducer, initialState);

  // console.log({ state });

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

  // const setPageIndex = useCallback(inValue => {
  //   // console.log('setting pageIndex', inValue);
  //   contextDispatch({ type: SET_PAGE_INDEX, payload: inValue });
  // }, []);

  //----------------------------------------------------------------

  //----------------------------------------------------------------
  //GQL
  const {
    loading,
    error,
    data: gqlData,
    refetch: searchVehicles,
  } = useQuery(queries.vehicles.SEARCH_VEHICLES);

  const result = gqlData?.searchVehicles;
  const vehicles = result?.vehicles || [];
  const meta = result?.meta || {};
  console.log('gql search vehicles result', {
    gqlData,
    result,
    loading,
    error,
    searchVehicles,
  });

  //----------------------------------------------------------------

  // console.log({ filterForItemsIdsToExclude });

  // useEffect(() => {
  //   console.log(' selected dates have changed...', selectedDates);
  // }, [selectedDates]);

  //----------------------------------------------------------------

  // console.log({ filtersCombinedString });

  // const reset = useCallback(() => {
  //   setResult(null);
  //   setError(null);
  // }, [setError, setResult]);

  //----------------------------------------------------------------
  const searchVehiclesCB = useCallback(
    (currentPage, firstVehicle, lastVehicle) => {
      console.log({ firstVehicle, lastVehicle });

      try {
        // reset();
        // setLoadingStatus(true);

        const {
          hitsPerPage,
          // filters,
          valueToSearch,
        } = state;

        const pageNumberIsValid =
          !isNaN(currentPage) &&
          typeof currentPage === 'number' &&
          currentPage >= 0;

        console.log('searching vehicles...');

        const sortByField = sortBy.field || 'searchScore';
        const sortByFieldIsNumeric =
          sortByField === 'searchScore' || sortByField === 'rate';

        searchVehicles({
          query: valueToSearch,
          queryOptions: {
            pagination: {
              limit: hitsPerPage,
              currentPage: pageNumberIsValid ? currentPage : 0,
              ...(lastVehicle && typeof lastVehicle === 'object'
                ? {
                    after: {
                      _id: lastVehicle._id,
                      field: sortByField,
                      value: String(lastVehicle[sortByField]),
                      isNumber: sortByFieldIsNumeric,
                    },
                  }
                : {}),
              ...(firstVehicle && typeof firstVehicle === 'object'
                ? {
                    before: {
                      _id: firstVehicle._id,
                      field: sortByField,
                      value: String(firstVehicle[sortByField]),
                      isNumber: sortByFieldIsNumeric,
                    },
                  }
                : {}),
            },
            filters: {
              // make:"Toyota"
              // color: ['grey'],
              // make:["Honda"]
              // type:["sedan"]
              // rate:[20000, 40000]
              // make:["Mercedes"]
            },
          },
        });
      } catch (error) {
        console.error(error);
        // setError(error);
      }
    },
    [state, searchVehicles]
  );
  //----------------------------------------------------------------
  const gotoPage = useCallback(
    (currentPageIndex, firstVehicle, lastVehicle) => {
      searchVehiclesCB(currentPageIndex, firstVehicle, lastVehicle);
    },
    [searchVehiclesCB]
  );
  //----------------------------------------------------------------
  const nextPage = useCallback(
    (currentPageIndex, lastVehicle) => {
      console.log('fetching next page...', { currentPageIndex, lastVehicle });
      gotoPage(currentPageIndex, null, lastVehicle);
    },
    [gotoPage]
  );
  const previousPage = useCallback(
    (currentPageIndex, firstVehicle) => {
      console.log('fetching previous page...', {
        currentPageIndex,
        firstVehicle,
      });
      gotoPage(currentPageIndex, firstVehicle);
    },
    [gotoPage]
  );
  //----------------------------------------------------------------

  useEffect(() => {
    console.log('fetching data start stage');
    //fetching data
    if (isMounted.current) {
      console.log('fetching data continue stage');

      searchVehiclesCB(0);
    }
  }, [searchVehiclesCB, state]);

  useEffect(() => {
    console.log('state has changed', state);
  }, [state]);

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

  //----------------------------------------------------------------

  // useEffect(() => {
  //   //if an action (delete) is done, reset and refetch list
  //   if (isModified) {
  //     console.log('reseting items list due to list modification...');
  //     //reset
  //     reduxDispatch(resetItems());
  //     //refetch items-change active page to trigger refresh
  //     setPageIndex(pageIndex > 0 ? pageIndex - 1 : 0);
  //   }
  //   //eslint-disable-next-line
  // }, [isModified]);
  //----------------------------------------------------------------

  const { hitsPerPage, filters, valueToSearch } = state;

  const pageIndex = meta?.page || 0;
  const fullListLength = meta?.count || 0;
  const page = meta?.page || 0;
  const numberOfPages = Math.floor(
    Number(fullListLength) || 1 / Number(hitsPerPage) || 1
  );
  const pageCount = numberOfPages > 0 ? numberOfPages : 0;
  // console.log({ fullListLength, page, numberOfPages, hitsPerPage, pageCount });

  //----------------------------------------------------------------

  return (
    <SearchItemsContext.Provider
      value={{
        //search params
        hitsPerPage,
        pageIndex,
        filters,
        valueToSearch,
        //search result values
        result,
        pageCount,
        page,
        fullListLength,
        //redux store values
        loading,
        items: vehicles,
        error,
        //fns
        setValueToSearch,
        setFilters,
        setHitsPerPage,
        gotoPage,
        nextPage,
        previousPage,
        selectedDates,
      }}
    >
      {children}
    </SearchItemsContext.Provider>
  );
}
