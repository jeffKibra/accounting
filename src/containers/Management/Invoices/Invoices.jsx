import { useEffect } from "react";
import { connect } from "react-redux";
import { Box } from "@chakra-ui/react";

import { GET_INVOICES } from "../../../store/actions/invoicesActions";
import { reset } from "../../../store/slices/invoicesSlice";

import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

import InvoicesTable from "../../../components/tables/Invoices/InvoicesTable";

function Invoices(props) {
  const { loading, invoices, action, isModified, getInvoices, resetInvoices } =
    props;

  useEffect(() => {
    getInvoices();
  }, [getInvoices]);

  useEffect(() => {
    if (isModified) {
      resetInvoices();
      getInvoices();
    }
  }, [isModified, resetInvoices, getInvoices]);

  return loading && action === GET_INVOICES ? (
    <SkeletonLoader />
  ) : invoices?.length > 0 ? (
    <Box
      mt={-2}
      w="full"
      bg="white"
      borderRadius="md"
      shadow="md"
      py={4}
      px={2}
    >
      <InvoicesTable invoices={invoices} showCustomer />
    </Box>
  ) : (
    <Empty />
  );
}

function mapStateToProps(state) {
  const { loading, invoices, action, isModified } = state.invoicesReducer;

  return { loading, invoices, action, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    getInvoices: () => dispatch({ type: GET_INVOICES }),
    resetInvoices: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Invoices);
