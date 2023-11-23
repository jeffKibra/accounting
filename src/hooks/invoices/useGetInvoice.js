import { useEffect } from 'react';

import { useQuery } from '@apollo/client';
//
import { queries } from 'gql';
import useToasts from '../useToasts';

//

function useGetInvoice(invoiceId) {
  const { loading, error, data, refetch } = useQuery(
    queries.invoices.GET_INVOICE,
    {
      variables: { id: invoiceId },
    }
  );

  const { error: toastError } = useToasts();

  const failed = !loading && Boolean(error);

  useEffect(() => {
    if (failed) {
      toastError(error?.message || 'Unknown error!');
    }
  }, [failed, error, toastError]);

  const rawinvoice = data?.invoice;
  console.log({ rawinvoice });

  let invoice = null;
  if (rawinvoice) {
    const { startDate, endDate } = rawinvoice;

    invoice = {
      ...rawinvoice,
      startDate: new Date(+startDate),
      endDate: new Date(+endDate),
    };
  }

  delete invoice?.__typename;
  delete invoice?.customer?.__typename;
  delete invoice?.paymentTerm?.__typename;

  return { loading, error, invoice, refetch };
}

export default useGetInvoice;
