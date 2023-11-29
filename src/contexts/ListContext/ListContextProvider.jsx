import { useEffect, useCallback, useRef, useMemo } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
//
import { useQuery } from '@apollo/client';

//
import ListContext from './Context';
//
// import VehiclesFiltersModalForm from 'components/forms/VehiclesFilters/ModalForm';
import FiltersDisplay from 'components/Custom/Vehicles/FiltersDisplay';
//
import { generateQueryVariables } from './utils';

//----------------------------------------------------------------
//----------------------------------------------------------------
//----------------------------------------------------------------
ListContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultValues: PropTypes.object,
  additionalQueryParams: PropTypes.object,
  GQLQuery: PropTypes.object.isRequired,
  resultField: PropTypes.string.isRequired,
  generateQueryVariables: PropTypes.func,
};

export default function ListContextProvider(props) {
  // console.log({ props });
  const {
    children,
    GQLQuery,
    defaultValues,
    additionalQueryParams,
    generateQueryVariables: generateQueryVariablesCB,
    resultField,
  } = props;
  // console.log({ GQLQuery, resultField });

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
      ...defaultValues,
      hitsPerPage: defaultValues?.hitsPerPage || 2,
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
      const cb =
        typeof generateQueryVariablesCB === 'function'
          ? generateQueryVariablesCB
          : generateQueryVariables;

      console.log({ stateToParse });

      return cb(stateToParse, additionalQueryParams);
    },
    [additionalQueryParams, generateQueryVariablesCB]
  );
  //----------------------------------------------------------------

  const initialQueryVariables = useMemo(() => {
    const originalState = getValues();

    const variables = generateQueryVariablesLocally(originalState);
    console.log('generating initial query variables', variables);

    return variables;
  }, [getValues, generateQueryVariablesLocally]);

  //----------------------------------------------------------------

  //GQL
  const {
    loading,
    error,
    data: rawResult,
    refetch,
  } = useQuery(GQLQuery, {
    variables: initialQueryVariables,
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
  const refetchQuery = useCallback(() => {
    try {
      // reset();
      // setLoadingStatus(true);
      const initialFetchCompleted = getValues('initialFetchCompleted');
      if (initialFetchCompleted) {
        const state = getValues();
        // console.log({ state });

        const queryVariables = generateQueryVariablesLocally(state);
        console.log({ queryVariables });

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

  const setFilters = useCallback(
    filtersData => {
      // console.log('setting filters', filtersData);
      setValue('filters', filtersData);
      //reset page index
      setValue('pageIndex', 0);
      //search
      refetchQuery();
      //close modal
      closeFiltersModal();
    },
    [setValue, closeFiltersModal, refetchQuery]
  );

  const setHitsPerPage = useCallback(
    inValue => {
      setValue('hitsPerPage', inValue);
      //reset page index
      setValue('pageIndex', 0);
      //search
      refetchQuery();
    },
    [setValue, refetchQuery]
  );

  //----------------------------------------------------------------
  //----------------------------------------------------------------

  const { gotoPage, nextPage, previousPage } = useMemo(() => {
    function gotoPage(incomingPageIndex) {
      //update pageIndex value in form
      setValue('pageIndex', incomingPageIndex);
      //trigger fetch
      refetchQuery();
    }

    function nextPage(currentPageIndex) {
      gotoPage(currentPageIndex + 1);
    }

    function previousPage(currentPageIndex) {
      gotoPage(currentPageIndex - 1);
    }

    return { gotoPage, nextPage, previousPage };
  }, [refetchQuery, setValue]);

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
      refetchQuery();
    },
    [refetchQuery, setValue]
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

  const result = useMemo(() => {
    let data = null;
    if (rawResult && typeof rawResult === 'object') {
      data = rawResult[resultField];
    }

    return data;
  }, [rawResult, resultField]);
  // console.log({ result, rawResult });

  const list = result?.list || [];
  const meta = result?.meta || {};
  // console.log({ list, meta });

  const hitsPerPage = watch('hitsPerPage');
  const currentFilters = watch('filters');
  // console.log({ currentFilters });
  // console.log({ hitsPerPage });

  const page = meta?.page || 0;
  const count = meta?.count || 0;
  const numberOfPages = Math.ceil(
    Number(count || 1) / Number(hitsPerPage || 1)
  );
  const pageCount = numberOfPages > 0 ? numberOfPages : 0;
  //

  return (
    <>
      <ListContext.Provider
        value={{
          //search params
          hitsPerPage,
          currentFilters,
          //search result values
          rawResult,
          loading,
          error,
          //
          page,
          pageCount,
          count,
          list,
          meta,
          //fns
          refetchQuery,
          //
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
          //form methods
          getValues,
          setValue,
          control,
          watch,
        }}
      >
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
      </ListContext.Provider>

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
