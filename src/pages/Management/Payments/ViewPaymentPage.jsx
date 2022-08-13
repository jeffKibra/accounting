import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

import { GET_PAYMENT } from '../../../store/actions/paymentsActions';
import { GET_PAYMENT_INVOICES } from '../../../store/actions/invoicesActions';
import { reset } from '../../../store/slices/paymentsSlice';

import { PAYMENTS } from '../../../nav/routes';

import PaymentOptions from '../../../containers/Management/Payments/PaymentOptions';

import useSavedLocation from '../../../hooks/useSavedLocation';
import PageLayout from '../../../components/layout/PageLayout';

import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';

import ViewPayment from '../../../containers/Management/Payments/ViewPayment';

function ViewPaymentPage(props) {
  const { loading, isModified, payment, invoices, resetPayment, getPayment } =
    props;
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  useSavedLocation().setLocation();

  useEffect(() => {
    getPayment(paymentId);
  }, [getPayment, paymentId]);

  useEffect(() => {
    if (isModified) {
      resetPayment();
      navigate(PAYMENTS);
    }
  }, [isModified, resetPayment, navigate]);

  return (
    <PageLayout
      pageTitle={payment?.paymentId || 'View Payment'}
      actions={payment && <PaymentOptions payment={payment} edit deletion />}
      breadcrumbLinks={{
        Dashboard: '/',
        Payments: PAYMENTS,
        [paymentId]: location.pathname,
      }}
    >
      {loading ? (
        <SkeletonLoader />
      ) : payment ? (
        <ViewPayment payment={payment} invoices={invoices} />
      ) : (
        <Empty message="payment not found!" />
      )}
    </PageLayout>
  );
}

function mapStateToProps(state) {
  let { loading, action, isModified, payment } = state.paymentsReducer;
  let {
    invoices,
    loading: invoicesLoading,
    action: invoicesAction,
  } = state.invoicesReducer;
  loading =
    (loading && action === GET_PAYMENT) ||
    (invoicesLoading && invoicesAction === GET_PAYMENT_INVOICES);

  console.log({ invoices, payment });

  return { loading, isModified, payment, invoices };
}

function mapDispatchToProps(dispatch) {
  return {
    resetPayment: () => dispatch(reset()),
    getPayment: paymentId => {
      dispatch({ type: GET_PAYMENT, payload: paymentId });
      dispatch({ type: GET_PAYMENT_INVOICES, payload: paymentId });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewPaymentPage);
