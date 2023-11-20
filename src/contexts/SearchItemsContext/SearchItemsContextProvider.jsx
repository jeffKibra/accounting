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
      resultField="searchVehicles"
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
  selectedDates: PropTypes.array,
};

function ContextProvider(props) {
  // console.log({ props });

  const { children, selectedDates } = props;

  const searchContext = useContext(SearchContext);

  //----------------------------------------------------------------
  const isMounted = useRef(null);
  useEffect(() => {
    isMounted.current = true;
  }, []);
  //----------------------------------------------------------------
  //----------------------------------------------------------------
  const {
    rawResult,
    filters,
    isOpen,
    setFilters,
    closeFiltersModal,
    meta,
    list: vehicles,
  } = searchContext;
  // console.log({ vehicles });

  const result = rawResult?.searchVehicles;

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

  return (
    <>
      <SearchItemsContext.Provider
        value={{
          ...searchContext,
          result,
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
