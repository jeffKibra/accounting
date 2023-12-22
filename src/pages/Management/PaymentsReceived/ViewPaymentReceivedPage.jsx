// import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

import { GET_PAYMENT } from 'store/actions/paymentsActions';
import { GET_PAYMENT_BOOKINGS } from 'store/actions/bookingsActions';
import { reset } from 'store/slices/paymentsSlice';

import { PAYMENTS_RECEIVED } from 'nav/routes';
//
import { useGetPaymentReceived } from 'hooks';

import PaymentReceivedOptions from 'containers/Management/PaymentsReceived/PaymentReceivedOptions';

// import useSavedLocation from 'hooks/useSavedLocation';
import PageLayout from 'components/layout/PageLayout';

import SkeletonLoader from 'components/ui/SkeletonLoader';
import Empty from 'components/ui/Empty';

import ViewPaymentReceived from 'containers/Management/PaymentsReceived/ViewPaymentReceived';

function ViewPaymentReceivedPage(props) {
  const { bookings } = props;

  const { paymentId } = useParams();
  const location = useLocation();
  // useSavedLocation().setLocation();

  const { loading, paymentReceived } = useGetPaymentReceived(paymentId);

  return (
    <PageLayout
      pageTitle="Payment Details"
      actions={
        paymentReceived && (
          <PaymentReceivedOptions payment={paymentReceived} edit deletion />
        )
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
        <ViewPaymentReceived payment={paymentReceived} bookings={bookings} />
      ) : (
        <Empty message="payment received data not found!" />
      )}
    </PageLayout>
  );
}

function mapStateToProps(state) {
  let { loading, action, isModified, payment } = state.paymentsReducer;
  let { bookings, loading: bookingsLoading } = state.bookingsReducer;
  loading = (loading && action === GET_PAYMENT) || bookingsLoading;

  // console.log({ bookings, payment });

  return { loading, isModified, payment, bookings };
}

function mapDispatchToProps(dispatch) {
  return {
    resetPayment: () => dispatch(reset()),
    getPayment: paymentId => {
      dispatch({ type: GET_PAYMENT, payload: paymentId });
      dispatch({ type: GET_PAYMENT_BOOKINGS, payload: paymentId });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewPaymentReceivedPage);
