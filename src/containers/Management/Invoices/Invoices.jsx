import { useEffect } from "react";
import { connect } from "react-redux";

import {
  GET_INVOICES,
  DELETE_INVOICE,
} from "../../../store/actions/invoicesActions";
import { reset } from "../../../store/slices/invoicesSlice";

import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

import InvoicesTable from "../../../components/tables/Invoices/InvoicesTable";

function Invoices(props) {
  const {
    loading,
    invoices,
    action,
    isModified,
    getInvoices,
    deleteInvoice,
    resetInvoices,
  } = props;

  useEffect(() => {
    getInvoices();
  }, [getInvoices]);

  useEffect(() => {
    if (isModified) {
      resetInvoices();
      getInvoices();
    }
  }, [isModified, resetInvoices, getInvoices]);

  console.log({ invoices });

  return loading && action === GET_INVOICES ? (
    <SkeletonLoader />
  ) : invoices?.length > 0 ? (
    <InvoicesTable
      deleting={loading && action === DELETE_INVOICE}
      isDeleted={isModified}
      handleDelete={deleteInvoice}
      invoices={invoices}
    />
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
    deleteInvoice: (invoiceId) => dispatch({ type: DELETE_INVOICE, invoiceId }),
    resetInvoices: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Invoices);
