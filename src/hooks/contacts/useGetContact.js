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

  const contact = data?.contact;
  delete contact?.__typename;
  delete contact?.billingAddress?.__typename;
  delete contact?.shippingAddress?.__typename;
  delete contact?.paymentTerm?.__typename;
  delete contact?.metaData?.__typename;

  return { loading, error, contact, refetch };
}

export default useGetContact;
