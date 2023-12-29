// import { useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { RiCloseLine } from 'react-icons/ri';
import { IconButton } from '@chakra-ui/react';

//
import { useUpdatePaymentReceived } from 'hooks';

import { PAYMENTS_RECEIVED } from '../../../nav/routes';

// import useSavedLocation from '../../../hooks/useSavedLocation';
import PageLayout from '../../../components/layout/PageLayout';

import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';

import EditPaymentReceived from '../../../containers/Management/PaymentsReceived/EditPaymentReceived';

function EditPaymentReceivedPage(props) {
  const { paymentId } = useParams();
  const location = useLocation();
  // useSavedLocation().setLocation();

  const viewRoute = `/sale/payments-received/${paymentId}/view`;

  const { loading, paymentReceived, updating, updatePaymentReceived } =
    useUpdatePaymentReceived(paymentId);

  function update(data) {
    // console.log({ data });
    return updatePaymentReceived({
      ...data,
    });
  }

  return (
    <PageLayout
      pageTitle="Edit Payment"
      actions={
        <Link to={viewRoute}>
          <IconButton
            colorScheme="red"
            variant="outline"
            size="sm"
            title="cancel"
            icon={<RiCloseLine />}
          />
        </Link>
      }
      breadcrumbLinks={{
        Dashboard: '/',
        'Payments Received': PAYMENTS_RECEIVED,
        [paymentId]: location.pathname,
      }}
    >
      {loading ? (
        <SkeletonLoader />
      ) : paymentReceived ? (
        <EditPaymentReceived
          updating={updating}
          saveData={update}
          payment={paymentReceived}
          paymentId={paymentId}
        />
      ) : (
        <Empty message="payments not found!" />
      )}
    </PageLayout>
  );
}

export default EditPaymentReceivedPage;
