import { useState, useEffect, useRef, useContext } from 'react';

import PropTypes from 'prop-types';

//
import SearchBookingsContext from './Context';
import SearchContext, { SearchContextProvider } from '../SearchContext';
//
import { queries } from 'gql';
//
// import bookingsFiltersModalForm from 'components/forms/bookingsFilters/ModalForm';

//

//----------------------------------------------------------------
//----------------------------------------------------------------

export default function SearchBookingsContextProvider(props) {
  const { children, defaultValues, customerId } = props;

  return (
    <SearchContextProvider
      defaultValues={defaultValues}
      GQLQuery={queries.bookings.SEARCH_BOOKINGS}
      additionalQueryParams={{ customerId }}
    >
      <ContextProvider {...props}>{children}</ContextProvider>
    </SearchContextProvider>
  );
}

SearchBookingsContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultValues: PropTypes.object,
  customerId: PropTypes.string,
};

//----------------------------------------------------------------
//----------------------------------------------------------------
//----------------------------------------------------------------
//----------------------------------------------------------------
//----------------------------------------------------------------

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultValues: PropTypes.object,
  customerId: PropTypes.string,
};

function ContextProvider(props) {
  // console.log({ props });
  const { children, selectedDates } = props;
  // console.log({ defaultValues });

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
  const {
    rawResult,
    hitsPerPage,
    // filters,
    // isOpen,
    // setFilters,
    // closeFiltersModal,
  } = searchContext;

  const result = rawResult?.searchBookings;
  const bookings = result?.bookings || [];
  const meta = result?.meta || {};
  // console.log('gql search bookings result', {
  //   gqlData,
  //   result,
  //   loading,
  //   error,
  //   searchbookings,
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
      <SearchBookingsContext.Provider
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
          bookings,
          selectedDates,
          facets,
          //
        }}
      >
        {children}
      </SearchBookingsContext.Provider>

      {/* {facets && isOpen ? (
        <bookingsFiltersModalForm
          closeOnOverlayClick={false}
          isOpen={isOpen}
          onClose={closeFiltersModal}
          facets={facets}
          onSubmit={setFilters}
          defaultValues={filters || {}}
        />
      ) : null} */}
    </>
  );
}
