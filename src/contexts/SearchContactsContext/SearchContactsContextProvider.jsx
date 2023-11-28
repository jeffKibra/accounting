import { useEffect, useRef, useContext } from 'react';

import PropTypes from 'prop-types';

//
import SearchItemsContext from './Context';
import SearchContext, { SearchContextProvider } from '../SearchContext';
//
import { queries } from 'gql';
//
// import VehiclesFiltersModalForm from 'components/forms/VehiclesFilters/ModalForm';

//

//----------------------------------------------------------------
//----------------------------------------------------------------

export default function SearchContactContextProvider(props) {
  const { children, defaultValues, group } = props;

  return (
    <SearchContextProvider
      defaultValues={defaultValues}
      GQLQuery={queries.vehicles.SEARCH_VEHICLES}
      resultField="searchVehicles"
      additionalQueryParams={{ group }}
    >
      <ContextProvider {...props}>{children}</ContextProvider>
    </SearchContextProvider>
  );
}

SearchContactContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultValues: PropTypes.object,
  group: PropTypes.string,
};

//----------------------------------------------------------------
//----------------------------------------------------------------
//----------------------------------------------------------------
//----------------------------------------------------------------
//----------------------------------------------------------------

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function ContextProvider(props) {
  // console.log({ props });

  const { children } = props;

  const searchContext = useContext(SearchContext);

  //----------------------------------------------------------------
  const isMounted = useRef(null);
  useEffect(() => {
    isMounted.current = true;
  }, []);
  //----------------------------------------------------------------
  //----------------------------------------------------------------
  // const { filters, isOpen, setFilters, closeFiltersModal } = searchContext;
  // console.log({ vehicles });

  //----------------------------------------------------------------
  //----------------------------------------------------------------
  //----------------------------------------------------------------
  //----------------------------------------------------------------

  return (
    <>
      <SearchItemsContext.Provider
        value={{
          ...searchContext,
          //
        }}
      >
        {children}
      </SearchItemsContext.Provider>

      {/* {facets && isOpen ? (
        <VehiclesFiltersModalForm
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
