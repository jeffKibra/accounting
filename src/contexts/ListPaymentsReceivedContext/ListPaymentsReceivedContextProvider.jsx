import { useContext } from 'react';

import PropTypes from 'prop-types';

//
import ListPaymentsReceivedContext from './Context';
import ListContext, { ListContextProvider } from '../ListContext';
//
import { queries } from 'gql';
// console.log({ queries });
//
// import bookingsFiltersModalForm from 'components/forms/bookingsFilters/ModalForm';

//----------------------------------------------------------------

const { LIST_PAYMENTS_RECEIVED } = queries.sales.paymentsReceived;
//----------------------------------------------------------------

export default function ListPaymentsReceivedContextProvider(props) {
  const { children, defaultValues, customerId } = props;
  console.log({ defaultValues });

  return (
    <ListContextProvider
      defaultValues={defaultValues}
      GQLQuery={LIST_PAYMENTS_RECEIVED}
      additionalQueryParams={{ customerId }}
      resultField="paymentsReceived"
    >
      <ContextProvider>{children}</ContextProvider>
    </ListContextProvider>
  );
}

ListPaymentsReceivedContextProvider.propTypes = {
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
      <ListPaymentsReceivedContext.Provider
        value={{
          ...listContextValues,
          //
        }}
      >
        {children}
      </ListPaymentsReceivedContext.Provider>

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
