//
import { CUSTOMERS } from 'nav/routes';
//
import { mutations } from 'gql';
import useCreateContact from './useCreateContact';

//

function useCreateCustomer() {
  const options = useCreateContact(
    mutations.customers.CREATE_CUSTOMER,
    CUSTOMERS
  );

  return {
    ...options,
  };
}

export default useCreateCustomer;
