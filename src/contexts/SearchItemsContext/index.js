import {
  createContext,
  useEffect,
  useReducer,
  useCallback,
  useRef,
  useMemo,
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
};

//useReducer actions

//----------------------------------------------------------------

const SearchItemsContext = createContext(contextDefaultValues);
export default SearchItemsContext;

//----------------------------------------------------------------
function generateQueryVariables(state, incomingPage) {
  const {
    sortBy,
    hitsPerPage,
    valueToSearch,
    // filters,
  } = state;

  const pageNumberIsValid =
    !isNaN(incomingPage) &&
    typeof incomingPage === 'number' &&
    incomingPage >= 0;

  const sortByField = sortBy.field || 'searchScore';

  const sortByFieldIsNumeric =
    sortByField === 'searchScore' || sortByField === 'rate';
  console.log({ sortByField, sortByFieldIsNumeric });

  const queryOptions = {
    sortBy,
    pagination: {
      limit: hitsPerPage,
      page: pageNumberIsValid ? incomingPage : 0,
    },
    filters: {
      // make:"Toyota"
      // color: ['grey'],
      // make:["Honda"]
      // type:["sedan"]
      // rate:[20000, 40000]
      // make:["Mercedes"]
    },
  };

  return {
    query: valueToSearch,
    queryOptions,
  };
}

//----------------------------------------------------------------
SearchItemsContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  selectedDates: PropTypes.array,
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
  const originalState = useMemo(
    () => state,
    //eslint-disable-next-line
    []
  );

  //----------------------------------------------------------------
  //GQL
  const {
    loading,
    error,
    data: gqlData,
    refetch: searchVehicles,
  } = useQuery(queries.vehicles.SEARCH_VEHICLES, {
    variables: generateQueryVariables(originalState, 0),
  });

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

  const makesFacet = meta?.facets?.makes;
  console.log({ makesFacet });

  // const makes = useMemo(() => {
  //   const makesObject = {};

  //   if (Array.isArray(makesFacet)) {
  //     makesFacet.forEach((makeFacet, i) => {
  //       console.log({ makeFacet });
  //       const { models: makeModels, _id: makeId } = makeFacet;
  //       console.log({ makeModels });

  //       const makeModelsObject = {};

  //       if (Array.isArray(makeModels)) {
  //         makeModels.forEach(model => {
  //           const { _id: modelId } = model;
  //           makeModelsObject[modelId] = model;
  //         });
  //       }

  //       const convertedModels = Object.values(makeModelsObject);
  //       const modelsIds = Object.keys(makeModelsObject);
  //       console.log({ makeModelsObject, convertedModels, modelsIds });

  //       makesObject[makeId] = {
  //         // ...makeFacet,
  //         models: convertedModels,
  //         [i]: i,
  //       };
  //     });
  //   }

  //   const makes = Object.values(makesObject);

  //   console.log('usememo makes', { makes, makesObject });

  //   return makes;
  // }, [makesFacet]);

  // console.log({ makes });

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
    incomingPage => {
      try {
        // reset();
        // setLoadingStatus(true);

        const queryVariables = generateQueryVariables(state, incomingPage);

        console.log({ queryVariables });

        console.log('searching vehicles...');

        searchVehicles({
          ...queryVariables,
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
    incomingPageIndex => {
      searchVehiclesCB(incomingPageIndex);
    },
    [searchVehiclesCB]
  );
  //----------------------------------------------------------------
  const nextPage = useCallback(
    currentPageIndex => {
      console.log('fetching next page...', { currentPageIndex });
      gotoPage(currentPageIndex + 1, null);
    },
    [gotoPage]
  );
  const previousPage = useCallback(
    currentPageIndex => {
      console.log('fetching previous page...', {
        currentPageIndex,
      });
      gotoPage(currentPageIndex - 1);
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
  }, [searchVehiclesCB]);

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

  const facets = meta?.facets || {};
  const pageIndex = meta?.page || 0;
  const fullListLength = meta?.count || 0;
  const page = meta?.page || 0;
  const numberOfPages = Math.ceil(
    Number(fullListLength || 1) / Number(hitsPerPage || 1)
  );
  const pageCount = numberOfPages > 0 ? numberOfPages : 0;
  console.log({ pageCount, fullListLength, hitsPerPage, numberOfPages });
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
        facets: {
          ...facets,
          // makes,
        },
      }}
    >
      {children}
    </SearchItemsContext.Provider>
  );
}
