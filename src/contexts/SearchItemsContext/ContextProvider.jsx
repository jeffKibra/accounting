import {
  useState,
  createContext,
  useEffect,
  useReducer,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
//
import { useQuery } from '@apollo/client';

//
import SearchItemsContext from './Context';
//
import { queries } from 'gql';
//
import VehiclesFiltersModalForm from 'components/forms/VehiclesFilters/ModalForm';
import FiltersDisplay from 'components/Custom/Vehicles/FiltersDisplay';

//
import { getDatesWithinRange } from 'utils/dates';
//
import { generateQueryVariables } from './utils';
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

//useReducer actions

//----------------------------------------------------------------

//----------------------------------------------------------------

//----------------------------------------------------------------
SearchItemsContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  selectedDates: PropTypes.array,
};

export default function SearchItemsContextProvider(props) {
  // console.log({ props });

  const calendar = getDatesWithinRange('2023/Jan/01', '2023/Dec/31');
  // console.log({ calendar });
  const { children, selectedDates, defaultValues } = props;
  // console.log({ selectedDates });

  // const defaultRatesRange =
  //   defaultValues?.ratesRange || getFacetsRatesRange(facets);
  // console.log({ defaultRatesRange, facets });
  const formMethods = useForm({
    defaultValues: {
      hitsPerPage: 2,
      valueToSearch: '',
      filters: null,
      sortBy: null,
    },
  });

  const { setValue, getValues, control, watch } = formMethods;

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

  // console.log({ state });

  // const setPageIndex = useCallback(inValue => {
  //   // console.log('setting pageIndex', inValue);
  //   contextDispatch({ type: SET_PAGE_INDEX, payload: inValue });
  // }, []);

  //----------------------------------------------------------------
  const originalState = useMemo(
    () => {
      return getValues();
    },
    //eslint-disable-next-line
    [getValues]
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
    fetchPolicy: 'cache-and-network',
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

  const incomingFacets = meta?.facets;

  const [facets, setFacets] = useState(null);

  useEffect(() => {
    console.log({ incomingFacets });
    if (incomingFacets) {
      setFacets(incomingFacets);
    }
  }, [incomingFacets]);

  const makesFacet = meta?.facets?.makes;
  // console.log({ makesFacet });

  //----------------------------------------------------------------

  // console.log({ filtersCombinedString });

  // const reset = useCallback(() => {
  //   setResult(null);
  //   setError(null);
  // }, [setError, setResult]);

  //----------------------------------------------------------------
  const {
    isOpen,
    onClose: closeFiltersModal,
    onOpen: openFiltersModal,
    onToggle: toggleFiltersModal,
  } = useDisclosure();

  //----------------------------------------------------------------
  const handleSearchVehicles = useCallback(
    incomingPage => {
      try {
        // reset();
        // setLoadingStatus(true);

        const state = getValues();
        console.log({ state });

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
    [searchVehicles, getValues]
  );

  //----------------------------------------------------------------

  const setValueToSearch = useCallback(
    inValue => {
      setValue('valueToSearch', inValue);
      //search
      handleSearchVehicles(0);
    },
    [setValue, handleSearchVehicles]
  );

  const setFilters = useCallback(
    filtersData => {
      // console.log('setting filters', filtersData);
      setValue('filters', filtersData);
      //search
      handleSearchVehicles(0);
      //close modal
      closeFiltersModal();
    },
    [setValue, closeFiltersModal, handleSearchVehicles]
  );

  const setHitsPerPage = useCallback(
    inValue => {
      setValue('hitsPerPage', inValue);
      //search
      handleSearchVehicles(0);
    },
    [setValue, handleSearchVehicles]
  );

  //----------------------------------------------------------------
  const gotoPage = useCallback(
    incomingPageIndex => {
      handleSearchVehicles(incomingPageIndex);
    },
    [handleSearchVehicles]
  );
  //----------------------------------------------------------------
  const nextPage = useCallback(
    currentPageIndex => {
      // console.log('fetching next page...', { currentPageIndex });
      handleSearchVehicles(currentPageIndex + 1);
    },
    [handleSearchVehicles]
  );
  const previousPage = useCallback(
    currentPageIndex => {
      // console.log('fetching previous page...', {
      //   currentPageIndex,
      // });
      handleSearchVehicles(currentPageIndex - 1);
    },
    [handleSearchVehicles]
  );

  //----------------------------------------------------------------
  const handleSortByChange = useCallback(
    (field, direction) => {
      console.log({ field, direction });
      //update form fields first
      setValue('sortBy', [field, direction]);
      //fetch new vehicles list
      handleSearchVehicles(0);
    },
    [handleSearchVehicles, setValue]
  );
  //----------------------------------------------------------------

  // useEffect(() => {
  //   console.log('fetching data start stage');
  //   //fetching data
  //   if (isMounted.current) {
  //     console.log('fetching data continue stage');

  //     handleSearchVehicles(0);
  //   }
  // }, [handleSearchVehicles]);

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

  // console.log({ formValues });
  const hitsPerPage = watch('hitsPerPage');
  // console.log({ hitsPerPage });

  // const metaFacets = meta?.facets;
  // const facets = metaFacets
  //   ? {
  //       ...metaFacets,
  //       // makes,
  //     }
  //   : null;
  const pageIndex = meta?.page || 0;
  const fullListLength = meta?.count || 0;
  const page = meta?.page || 0;
  const numberOfPages = Math.ceil(
    Number(fullListLength || 1) / Number(hitsPerPage || 1)
  );
  const pageCount = numberOfPages > 0 ? numberOfPages : 0;
  // console.log({ pageCount, fullListLength, hitsPerPage, numberOfPages });
  // console.log({ fullListLength, page, numberOfPages, hitsPerPage, pageCount });

  //----------------------------------------------------------------

  const refetchQuery = useCallback(() => {
    handleSearchVehicles(pageIndex || 0);
  }, [pageIndex, handleSearchVehicles]);

  //----------------------------------------------------------------

  const currentFilters = watch('filters');

  return (
    <>
      <SearchItemsContext.Provider
        value={{
          //search params
          hitsPerPage,
          pageIndex,
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
          facets,
          //
          closeFiltersModal,
          openFiltersModal,
          toggleFiltersModal,
          handleSearchVehicles,
          refetchQuery,
          //
          handleSortByChange,
        }}
      >
        <Controller
          name="valueToSearch"
          control={control}
          render={() => null}
        />
        <Controller name="hitsPerPage" control={control} render={() => null} />
        <Controller name="pageIndex" control={control} render={() => null} />
        <Controller name="sortBy" control={control} render={() => null} />
        <Controller
          name="filters"
          control={control}
          render={({ field: { value } }) => {
            return value ? (
              <FiltersDisplay
                onChange={setFilters}
                filters={value}
                ratesRangeFacet={facets?.ratesRange}
              />
            ) : null;
          }}
        />

        {children}
      </SearchItemsContext.Provider>

      {facets && isOpen ? (
        <VehiclesFiltersModalForm
          closeOnOverlayClick={false}
          isOpen={isOpen}
          onClose={closeFiltersModal}
          facets={facets}
          onSubmit={setFilters}
          defaultValues={currentFilters || {}}
        />
      ) : null}
    </>
  );
}
