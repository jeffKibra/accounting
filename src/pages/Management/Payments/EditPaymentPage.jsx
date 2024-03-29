import { useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { RiCloseLine } from 'react-icons/ri';
import { IconButton } from '@chakra-ui/react';

import {
  UPDATE_PAYMENT,
  GET_PAYMENT,
} from '../../../store/actions/paymentsActions';
import { reset } from '../../../store/slices/paymentsSlice';

import { PAYMENTS } from '../../../nav/routes';

import useSavedLocation from '../../../hooks/useSavedLocation';
import PageLayout from '../../../components/layout/PageLayout';

import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';

import EditPayment from '../../../containers/Management/Payments/EditPayment';

function trimPayment(payment) {
  const {
    amount,
    account,
    customer,
    paymentDate,
    paymentMode,
    reference,
    payments,
  } = payment;

  return {
    amount,
    account,
    customer,
    paymentDate,
    paymentMode,
    reference,
    payments,
  };
}

function EditPaymentPage(props) {
  const {
    loading,
    action,
    isModified,
    payment,
    updatePayment,
    resetPayment,
    getPayment,
  } = props;
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  useSavedLocation().setLocation();
  const viewRoute = `/sale/payments/${paymentId}/view`;

  useEffect(() => {
    getPayment(paymentId);
  }, [getPayment, paymentId]);

  useEffect(() => {
    if (isModified) {
      resetPayment();
      navigate(viewRoute);
    }
  }, [isModified, resetPayment, navigate, viewRoute]);

  function update(data) {
    // console.log({ data });
    updatePayment({
      ...data,
      paymentId,
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
        Payments: PAYMENTS,
        [paymentId]: location.pathname,
      }}
    >
      {loading && action === GET_PAYMENT ? (
        <SkeletonLoader />
      ) : payment ? (
        <EditPayment
          updating={loading && action === UPDATE_PAYMENT}
          saveData={update}
          payment={trimPayment(payment)}
          paymentId={paymentId}
        />
      ) : (
        <Empty message="payment not found!" />
      )}
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified, payment } = state.paymentsReducer;

  return { loading, action, isModified, payment };
}

function mapDispatchToProps(dispatch) {
  return {
    updatePayment: payload => dispatch({ type: UPDATE_PAYMENT, payload }),
    resetPayment: () => dispatch(reset()),
    getPayment: paymentId =>
      dispatch({ type: GET_PAYMENT, payload: paymentId }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPaymentPage);
