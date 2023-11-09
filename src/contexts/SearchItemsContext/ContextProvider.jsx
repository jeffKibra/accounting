import { useState, useEffect, useRef, useMemo, useContext } from 'react';

import PropTypes from 'prop-types';

//
import SearchItemsContext from './Context';
import SearchContext, { SearchContextProvider } from '../SearchContext';
//
import { queries } from 'gql';
//
import VehiclesFiltersModalForm from 'components/forms/VehiclesFilters/ModalForm';

//

//----------------------------------------------------------------
//----------------------------------------------------------------

export default function SearchItemsContextProvider(props) {
  const { children, selectedDatesString, defaultValues, bookingId } = props;

  const selectedDates = useMemo(() => {
    let sDates = [];
    if (selectedDatesString) {
      sDates = String(selectedDatesString).split(',');
    }

    return sDates;
  }, [selectedDatesString]);

  return (
    <SearchContextProvider
      defaultValues={defaultValues}
      GQLQuery={queries.vehicles.SEARCH_VEHICLES}
      additionalQueryParams={{ bookingId, selectedDates }}
      selectedDates={selectedDates}
    >
      <ContextProvider {...props}>{children}</ContextProvider>
    </SearchContextProvider>
  );
}

SearchItemsContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  selectedDatesString: PropTypes.string,
  defaultValues: PropTypes.object,
  bookingId: PropTypes.string,
};

//----------------------------------------------------------------
//----------------------------------------------------------------
//----------------------------------------------------------------
//----------------------------------------------------------------
//----------------------------------------------------------------

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  selectedDatesString: PropTypes.string,
  defaultValues: PropTypes.object,
  bookingId: PropTypes.string,
  selectedDates: PropTypes.array,
};

function ContextProvider(props) {
  // console.log({ props });

  const { children, selectedDates } = props;
  // console.log({ defaultValues });
  // console.log({ selectedDatesString });

  const searchContext = useContext(SearchContext);

  // const defaultRatesRange =
  //   defaultValues?.ratesRange || getFacetsRatesRange(facets);
  // console.log({ defaultRatesRange, facets });

  //----------------------------------------------------------------
  const isMounted = useRef(null);
  useEffect(() => {
    isMounted.current = true;
  }, []);
  //----------------------------------------------------------------
  //----------------------------------------------------------------
  //----------------------------------------------------------------

  //----------------------------------------------------------------
  //----------------------------------------------------------------

  //----------------------------------------------------------------
  //----------------------------------------------------------------
  const {
    rawResult,
    hitsPerPage,
    filters,
    isOpen,
    setFilters,
    closeFiltersModal,
  } = searchContext;

  const result = rawResult?.searchVehicles;
  const vehicles = result?.vehicles || [];
  const meta = result?.meta || {};
  // console.log('gql search vehicles result', {
  //   gqlData,
  //   result,
  //   loading,
  //   error,
  //   searchVehicles,
  // });

  //----------------------------------------------------------------
  //----------------------------------------------------------------

  const incomingFacets = meta?.facets;

  const [facets, setFacets] = useState(null);

  useEffect(() => {
    // console.log({ incomingFacets });
    if (incomingFacets) {
      setFacets(incomingFacets);
    }
  }, [incomingFacets]);
  //----------------------------------------------------------------
  //----------------------------------------------------------------
  //----------------------------------------------------------------

  // const metaFacets = meta?.facets;
  // const facets = metaFacets
  //   ? {
  //       ...metaFacets,
  //       // makes,
  //     }
  //   : null;
  const pageIndex = meta?.page || 0;
  const page = pageIndex;
  const fullListLength = meta?.count || 0;
  const numberOfPages = Math.ceil(
    Number(fullListLength || 1) / Number(hitsPerPage || 1)
  );
  const pageCount = numberOfPages > 0 ? numberOfPages : 0;
  // console.log({ pageCount, fullListLength, hitsPerPage, numberOfPages });
  // console.log({ fullListLength, page, numberOfPages, hitsPerPage, pageCount });

  return (
    <>
      <SearchItemsContext.Provider
        value={{
          ...searchContext,
          //search params
          hitsPerPage,
          pageIndex,
          //search result values
          result,
          pageCount,
          page,
          fullListLength,
          items: vehicles,
          selectedDates,
          facets,
          //
        }}
      >
        {children}
      </SearchItemsContext.Provider>

      {facets && isOpen ? (
        <VehiclesFiltersModalForm
          closeOnOverlayClick={false}
          isOpen={isOpen}
          onClose={closeFiltersModal}
          facets={facets}
          onSubmit={setFilters}
          defaultValues={filters || {}}
        />
      ) : null}
    </>
  );
}
