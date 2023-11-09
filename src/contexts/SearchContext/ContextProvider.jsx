import { useEffect, useCallback, useRef, useMemo } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
//
import { useQuery } from '@apollo/client';

//
import SearchContext from './Context';
//
// import VehiclesFiltersModalForm from 'components/forms/VehiclesFilters/ModalForm';
import FiltersDisplay from 'components/Custom/Vehicles/FiltersDisplay';
//
import { generateQueryVariables } from './utils';

//----------------------------------------------------------------
//----------------------------------------------------------------
//----------------------------------------------------------------
SearchContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultValues: PropTypes.object,
  additionalQueryParams: PropTypes.object,
  GQLQuery: PropTypes.object.isRequired,
};

export default function SearchContextProvider(props) {
  // console.log({ props });
  const { children, GQLQuery, defaultValues, additionalQueryParams } = props;
  console.log({ GQLQuery });

  useEffect(() => {
    console.log('additionalQueryParams have changed', additionalQueryParams);
  }, [additionalQueryParams]);
  // console.log({ defaultValues });
  // console.log({ selectedDatesString });

  // const defaultRatesRange =
  //   defaultValues?.ratesRange || getFacetsRatesRange(facets);
  // console.log({ defaultRatesRange, facets });
  const formMethods = useForm({
    defaultValues: {
      hitsPerPage: defaultValues?.hitsPerPage || 2,
      valueToSearch: defaultValues?.valueToSearch || '',
      filters: defaultValues?.filters || null,
      sortBy: defaultValues?.sortBy || null,
      pageIndex: defaultValues?.pageIndex || 0,
    },
  });

  const { setValue, getValues, control, watch } = formMethods;

  //----------------------------------------------------------------
  const isMounted = useRef(null);
  useEffect(() => {
    isMounted.current = true;
  }, []);
  //----------------------------------------------------------------
  //----------------------------------------------------------------
  //----------------------------------------------------------------
  const originalState = useMemo(
    () => {
      return getValues();
    },
    //eslint-disable-next-line
    [getValues]
  );

  //----------------------------------------------------------------

  const handleCompleted = useCallback(() => {
    console.log('completing api fetch request...');
    setValue('initialFetchCompleted', true);
  }, [setValue]);

  // const initialFetchCompleted = watch('initialFetchCompleted');
  // console.log({ initialFetchCompleted });

  //----------------------------------------------------------------
  const generateQueryVariablesLocally = useCallback(
    stateToParse => {
      return generateQueryVariables(stateToParse, additionalQueryParams);
    },
    [additionalQueryParams]
  );
  //----------------------------------------------------------------

  //GQL
  const {
    loading,
    error,
    data: rawResult,
    refetch,
  } = useQuery(GQLQuery, {
    variables: generateQueryVariablesLocally(originalState),
    fetchPolicy: 'cache-and-network',
    onCompleted: handleCompleted,
  });

  // console.log('gql search vehicles result', {
  //   rawResult,
  //   result,
  //   loading,
  //   error,
  //   // searchVehicles,
  // });

  //----------------------------------------------------------------
  //----------------------------------------------------------------
  const {
    isOpen,
    onClose: closeFiltersModal,
    onOpen: openFiltersModal,
    onToggle: toggleFiltersModal,
  } = useDisclosure();

  //----------------------------------------------------------------
  const handleSearch = useCallback(() => {
    try {
      // reset();
      // setLoadingStatus(true);
      const initialFetchCompleted = getValues('initialFetchCompleted');
      if (initialFetchCompleted) {
        const state = getValues();
        // console.log({ state });

        const queryVariables = generateQueryVariablesLocally(state);

        // console.log({ queryVariables });

        console.log('searching...');

        refetch({
          ...queryVariables,
        });
      }
    } catch (error) {
      console.error(error);
      // setError(error);
    }
  }, [refetch, getValues, generateQueryVariablesLocally]);

  //----------------------------------------------------------------

  const setValueToSearch = useCallback(
    inValue => {
      setValue('valueToSearch', inValue);
      //reset page index
      setValue('pageIndex', 0);
      //search
      handleSearch();
    },
    [setValue, handleSearch]
  );

  const setFilters = useCallback(
    filtersData => {
      // console.log('setting filters', filtersData);
      setValue('filters', filtersData);
      //reset page index
      setValue('pageIndex', 0);
      //search
      handleSearch();
      //close modal
      closeFiltersModal();
    },
    [setValue, closeFiltersModal, handleSearch]
  );

  const setHitsPerPage = useCallback(
    inValue => {
      setValue('hitsPerPage', inValue);
      //reset page index
      setValue('pageIndex', 0);
      //search
      handleSearch();
    },
    [setValue, handleSearch]
  );

  //----------------------------------------------------------------
  //----------------------------------------------------------------

  const { gotoPage, nextPage, previousPage } = useMemo(() => {
    function gotoPage(incomingPageIndex) {
      //update pageIndex value in form
      setValue('pageIndex', incomingPageIndex);
      //trigger fetch
      handleSearch();
    }

    function nextPage(currentPageIndex) {
      gotoPage(currentPageIndex + 1);
    }

    function previousPage(currentPageIndex) {
      gotoPage(currentPageIndex - 1);
    }

    return { gotoPage, nextPage, previousPage };
  }, [handleSearch, setValue]);

  //----------------------------------------------------------------

  const handleSortByChange = useCallback(
    (field, direction) => {
      // console.log('handling sortby change', { field, direction });
      //update form fields first
      let sortByTupple = null;
      if (field) {
        sortByTupple = [field, direction || 'desc'];
      }

      setValue('sortBy', sortByTupple);
      //reset page index
      setValue('pageIndex', 0);
      //fetch new vehicles list
      handleSearch();
    },
    [handleSearch, setValue]
  );
  //----------------------------------------------------------------
  //----------------------------------------------------------------
  //----------------------------------------------------------------
  const getQueryVariables = useCallback(() => {
    const state = getValues();
    // console.log({ state });

    return {
      ...state,
    };
  }, [getValues]);
  //----------------------------------------------------------------
  //----------------------------------------------------------------

  const hitsPerPage = watch('hitsPerPage');
  const currentFilters = watch('filters');
  // console.log({ currentFilters });
  // console.log({ hitsPerPage });

  return (
    <>
      <SearchContext.Provider
        value={{
          //search params
          hitsPerPage,
          currentFilters,
          //search result values
          rawResult,
          loading,
          error,
          //fns
          handleSearch,
          refetchQuery: handleSearch,
          //
          setValueToSearch,
          setFilters,
          setHitsPerPage,
          gotoPage,
          nextPage,
          previousPage,
          //modal
          isOpen,
          closeFiltersModal,
          openFiltersModal,
          toggleFiltersModal,
          //
          handleSortByChange,
          getQueryVariables,
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
                // ratesRangeFacet={facets?.ratesRange}
              />
            ) : null;
          }}
        />

        {children}
      </SearchContext.Provider>

      {/* {facets && isOpen ? (
        <VehiclesFiltersModalForm
          closeOnOverlayClick={false}
          isOpen={isOpen}
          onClose={closeFiltersModal}
          facets={facets}
          onSubmit={setFilters}
          defaultValues={currentFilters || {}}
        />
      ) : null} */}
    </>
  );
}
