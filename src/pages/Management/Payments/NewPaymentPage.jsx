import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { PAYMENTS } from '../../../nav/routes';
import { CREATE_PAYMENT } from '../../../store/actions/paymentsActions';
import { reset } from '../../../store/slices/paymentsSlice';

import useSavedLocation from '../../../hooks/useSavedLocation';

import PageLayout from '../../../components/layout/PageLayout';
import EditPayment from '../../../containers/Management/Payments/EditPayment';

function NewPaymentPage(props) {
  const { loading, action, isModified, createPayment, resetPayment } = props;
  useSavedLocation().setLocation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isModified) {
      resetPayment();
      navigate(PAYMENTS);
    }
  }, [isModified, resetPayment, navigate]);

  return (
    <PageLayout
      pageTitle="Receive Payment"
      breadcrumbLinks={{
        Dashboard: '/',
        Payments: PAYMENTS,
        'New Payment': location.pathname,
      }}
    >
      <EditPayment
        updating={loading && action === CREATE_PAYMENT}
        saveData={createPayment}
      />
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified } = state.paymentsReducer;

  return { loading, action, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    createPayment: payload => dispatch({ type: CREATE_PAYMENT, payload }),
    resetPayment: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPaymentPage);
