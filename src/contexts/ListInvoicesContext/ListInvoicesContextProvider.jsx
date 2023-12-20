import { useContext } from 'react';

import PropTypes from 'prop-types';

//
import SearchBookingsContext from './Context';
import ListContext, { ListContextProvider } from '../ListContext';
//
import { queries } from 'gql';
// console.log({ queries });
//
// import bookingsFiltersModalForm from 'components/forms/bookingsFilters/ModalForm';

//----------------------------------------------------------------
//----------------------------------------------------------------

export default function ListInvoicesContextProvider(props) {
  const { children, defaultValues, customerId } = props;
  console.log({ defaultValues });

  return (
    <ListContextProvider
      defaultValues={defaultValues}
      GQLQuery={queries.sales.invoices.LIST_INVOICES}
      additionalQueryParams={{ customerId }}
      resultField="invoices"
    >
      <ContextProvider>{children}</ContextProvider>
    </ListContextProvider>
  );
}

ListInvoicesContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultValues: PropTypes.object,
  customerId: PropTypes.string,
};

//----------------------------------------------------------------
//----------------------------------------------------------------

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function ContextProvider(props) {
  // console.log({ props });
  const { children } = props;

  const listContextValues = useContext(ListContext);

  //----------------------------------------------------------------
  //----------------------------------------------------------------

  return (
    <>
      <SearchBookingsContext.Provider
        value={{
          ...listContextValues,
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
