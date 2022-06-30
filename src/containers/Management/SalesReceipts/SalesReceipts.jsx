import { useEffect } from "react";
import { connect } from "react-redux";
import { Box } from "@chakra-ui/react";

import { GET_SALES_RECEIPTS } from "../../../store/actions/salesReceiptsActions";
import { reset } from "../../../store/slices/salesReceiptsSlice";

import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

import SalesReceiptsTable from "../../../components/tables/SalesReceipts/SalesReceiptsTable";

function SalesReceipts(props) {
  const {
    loading,
    salesReceipts,
    action,
    isModified,
    getSalesReceipts,
    resetSalesReceipt,
  } = props;

  useEffect(() => {
    getSalesReceipts();
  }, [getSalesReceipts]);

  useEffect(() => {
    if (isModified) {
      resetSalesReceipt();
      getSalesReceipts();
    }
  }, [isModified, resetSalesReceipt, getSalesReceipts]);

  return loading && action === GET_SALES_RECEIPTS ? (
    <SkeletonLoader />
  ) : salesReceipts?.length > 0 ? (
    <Box
      mt={-2}
      w="full"
      bg="white"
      borderRadius="md"
      shadow="md"
      py={4}
      px={2}
    >
      <SalesReceiptsTable showCustomer salesReceipts={salesReceipts} />
    </Box>
  ) : (
    <Empty />
  );
}

function mapStateToProps(state) {
  const { loading, salesReceipts, action, isModified } =
    state.salesReceiptsReducer;

  return { loading, salesReceipts, action, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    getSalesReceipts: () => dispatch({ type: GET_SALES_RECEIPTS }),
    resetSalesReceipt: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SalesReceipts);
