import { useEffect } from "react";
import { connect } from "react-redux";

import { GET_INVOICES } from "../../../store/actions/invoicesActions";

import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

import InvoicesTable from "../../../components/tables/Invoices/InvoicesTable";

function Invoices(props) {
  const { loading, invoices, action, getInvoices } = props;

  useEffect(() => {
    getInvoices();
  }, [getInvoices]);

  return loading && action === GET_INVOICES ? (
    <SkeletonLoader />
  ) : invoices?.length > 0 ? (
    <InvoicesTable invoices={invoices} />
  ) : (
    <Empty />
  );
}

function mapStateToProps(state) {
  const { loading, invoices, action } = state.invoicesReducer;

  return { loading, invoices, action };
}

function mapDispatchToProps(dispatch) {
  return {
    getInvoices: () => dispatch({ type: GET_INVOICES }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Invoices);
