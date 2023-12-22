// import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { PAYMENTS_RECEIVED } from '../../../nav/routes';

// import useSavedLocation from '../../../hooks/useSavedLocation';
import { useCreatePaymentReceived } from 'hooks';

import PageLayout from '../../../components/layout/PageLayout';
import EditPaymentReceived from '../../../containers/Management/PaymentsReceived/EditPaymentReceived';

function NewPaymentReceivedPage(props) {
  // useSavedLocation().setLocation();
  const location = useLocation();

  const { createPaymentReceived, loading } = useCreatePaymentReceived();

  return (
    <PageLayout
      pageTitle="Receive Payment"
      breadcrumbLinks={{
        Dashboard: '/',
        'Payments Received': PAYMENTS_RECEIVED,
        'New Payment': location.pathname,
      }}
    >
      <EditPaymentReceived
        updating={loading}
        saveData={createPaymentReceived}
      />
    </PageLayout>
  );
}

export default NewPaymentReceivedPage;
