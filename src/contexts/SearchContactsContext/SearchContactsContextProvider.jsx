import { useEffect, useRef, useContext } from 'react';

import PropTypes from 'prop-types';

//
import SearchContactsContext from './Context';
import SearchContext, { SearchContextProvider } from '../SearchContext';
//
import { queries } from 'gql';
//
// import VehiclesFiltersModalForm from 'components/forms/VehiclesFilters/ModalForm';

//

//----------------------------------------------------------------
//----------------------------------------------------------------

export default function SearchContactsContextProvider(props) {
  const { children, defaultValues, group } = props;

  return (
    <SearchContextProvider
      defaultValues={defaultValues}
      GQLQuery={queries.contacts.SEARCH_CONTACTS}
      resultField="searchContacts"
      additionalQueryParams={{ group }}
    >
      <ContextProvider {...props}>{children}</ContextProvider>
    </SearchContextProvider>
  );
}

SearchContactsContextProvider.propTypes = {
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
      <SearchContactsContext.Provider
        value={{
          ...searchContext,
          //
        }}
      >
        {children}
      </SearchContactsContext.Provider>

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
