import { useEffect } from 'react';

import { useQuery } from '@apollo/client';
//
import { queries } from 'gql';
import useToasts from '../useToasts';

//

function useGetInvoice(invoiceId) {
  const { loading, error, data, refetch } = useQuery(
    queries.sales.invoices.GET_INVOICE,
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
    const { saleDate, dueDate } = rawinvoice;

    invoice = JSON.parse(
      JSON.stringify({
        ...rawinvoice,
        saleDate: new Date(+saleDate),
        dueDate: new Date(+dueDate),
      })
    );
  }

  try {
    if (invoice) {
      delete invoice?.__typename;
      delete invoice?.customer?.__typename;
      delete invoice?.paymentTerm?.__typename;
    }
  } catch (error) {
    console.error(error);
  }

  return { loading, error, invoice, refetch };
}

export default useGetInvoice;
