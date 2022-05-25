import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { Box, Text } from "@chakra-ui/react";

import {
  DELETE_PAYMENT,
  GET_PAYMENT,
} from "../../../store/actions/paymentsActions";
import { reset } from "../../../store/slices/paymentsSlice";

import { PAYMENTS_RECEIVED } from "../../../nav/routes";

import useSavedLocation from "../../../hooks/useSavedLocation";
import PageLayout from "../../../components/layout/PageLayout";

import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

import TableActions from "../../../components/tables/TableActions";

import ViewPayment from "../../../containers/Management/Payments/ViewPayment";

function ViewPaymentPage(props) {
  const {
    loading,
    action,
    isModified,
    payment,
    deletePayment,
    resetPayment,
    getPayment,
  } = props;
  const { paymentId } = useParams();
  const navigate = useNavigate();
  useSavedLocation().setLocation();

  useEffect(() => {
    getPayment(paymentId);
  }, [getPayment, paymentId]);

  useEffect(() => {
    if (isModified) {
      resetPayment();
      navigate(PAYMENTS_RECEIVED);
    }
  }, [isModified, resetPayment, navigate]);

  return (
    <PageLayout
      pageTitle={payment?.paymentSlug || "View Payment"}
      actions={
        payment && (
          <>
            <TableActions
              editRoute={`/payments/${paymentId}/edit`}
              deleteDialog={{
                isDeleted: isModified,
                loading: loading && action === DELETE_PAYMENT,
                title: "Delete Payment",
                onConfirm: () => deletePayment(paymentId),
                message: (
                  <Box>
                    <Text>Are you sure you want to delete this Payment</Text>
                    <Box p={1} pl={5}>
                      <Text>
                        Payment#: <b>{payment?.paymentSlug}</b>
                      </Text>
                      <Text>
                        Customer Name: <b>{payment?.customer?.displayName}</b>
                      </Text>
                      <Text>
                        Payment Date :{" "}
                        <b>{new Date(payment?.paymentDate).toDateString()}</b>
                      </Text>
                    </Box>
                    <Text>NOTE:::THIS ACTION CANNOT BE UNDONE!</Text>
                  </Box>
                ),
              }}
            />
          </>
        )
      }
    >
      {loading ? (
        <SkeletonLoader />
      ) : payment ? (
        <ViewPayment payment={payment} />
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
    deletePayment: (paymentId) => dispatch({ type: DELETE_PAYMENT, paymentId }),
    resetPayment: () => dispatch(reset()),
    getPayment: (paymentId) => dispatch({ type: GET_PAYMENT, paymentId }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewPaymentPage);
