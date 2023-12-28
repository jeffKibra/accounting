import { useEffect } from 'react';

import { useQuery } from '@apollo/client';
//
import { queries } from 'gql';
import useToasts from '../useToasts';

//
const { GET_PAYMENT_RECEIVED } = queries.sales.paymentsReceived;
//

function useGetPaymentReceived(paymentReceivedId) {
  const { loading, error, data, refetch } = useQuery(GET_PAYMENT_RECEIVED, {
    variables: { id: paymentReceivedId },
    fetchPolicy: 'cache-and-network',
  });

  const { error: toastError } = useToasts();

  const failed = !loading && Boolean(error);

  useEffect(() => {
    if (failed) {
      toastError(error?.message || 'Unknown error!');
    }
  }, [failed, error, toastError]);

  const rawPaymentReceived = data?.paymentReceived;
  console.log({ rawPaymentReceived });

  let paymentReceived = null;
  if (rawPaymentReceived) {
    const { paymentDate } = rawPaymentReceived;

    paymentReceived = {
      ...rawPaymentReceived,
      paymentDate: new Date(+paymentDate),
    };
  }

  if (paymentReceived) {
    try {
      delete paymentReceived?.__typename;
      delete paymentReceived?.customer?.__typename;
      delete paymentReceived?.paymentMode?.__typename;
      delete paymentReceived?.metaData?.__typename;
    } catch (error) {
      console.error(error);
    }
  }

  return { loading, error, paymentReceived, refetch };
}

export default useGetPaymentReceived;
