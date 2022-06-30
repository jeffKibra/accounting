import { useEffect } from "react";
import { connect } from "react-redux";
import { Box } from "@chakra-ui/react";

import { GET_PAYMENTS } from "../../../store/actions/paymentsActions";
import { reset } from "../../../store/slices/paymentsSlice";

import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

import PaymentsTable from "../../../components/tables/Payments/PaymentsTable";

function Payments(props) {
  const { loading, payments, action, isModified, getPayments, resetPayment } =
    props;

  useEffect(() => {
    getPayments();
  }, [getPayments]);

  useEffect(() => {
    if (isModified) {
      resetPayment();
      getPayments();
    }
  }, [isModified, resetPayment, getPayments]);

  return loading && action === GET_PAYMENTS ? (
    <SkeletonLoader />
  ) : payments?.length > 0 ? (
    <Box
      mt={-2}
      w="full"
      bg="white"
      shadow="md"
      borderRadius="md"
      py={4}
      px={2}
    >
      <PaymentsTable showCustomer payments={payments} />
    </Box>
  ) : (
    <Empty />
  );
}

function mapStateToProps(state) {
  const { loading, payments, action, isModified } = state.paymentsReducer;

  return { loading, payments, action, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    getPayments: () => dispatch({ type: GET_PAYMENTS }),
    resetPayment: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Payments);
