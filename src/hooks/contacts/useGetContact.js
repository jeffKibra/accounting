import { useEffect } from 'react';

import { useQuery } from '@apollo/client';
//
import { queries } from 'gql';
import useToasts from '../useToasts';

function useGetContact(contactId) {
  const { loading, error, data, refetch } = useQuery(
    queries.contacts.GET_CONTACT,
    {
      variables: { id: contactId },
    }
  );

  const { error: toastError } = useToasts();

  const failed = !loading && Boolean(error);

  useEffect(() => {
    if (failed) {
      toastError(error?.message || 'Unknown error!');
    }
  }, [failed, error, toastError]);

  const contact =  JSON.parse(JSON.stringify(data?.contact||{})) 

  try {
    if (contact) {
      console.log({ contact });
      delete contact.__typename;
      //
      if (contact.billingAddress) {
        delete contact.billingAddress?.__typename;
      }
      if (contact.shippingAddress) {
        delete contact.shippingAddress?.__typename;
      }
      if (contact.paymentTerm) {
        delete contact.paymentTerm?.__typename;
      }
      if (contact.metaData) {
        delete contact.metaData?.__typename;
      }
    }
  } catch (error) {
    console.warn(error);
  }

  return { loading, error, contact, refetch };
}

export default useGetContact;
