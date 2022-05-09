import { useEffect } from "react";
import { connect } from "react-redux";

import { GET_CUSTOMER_INVOICES } from "../../../store/actions/invoicesActions";

import SkeletonLoader from "../../ui/SkeletonLoader";
import Empty from "../../ui/Empty";

import UnpaidInvoicesTable from "../../tables/Invoices/UnpaidInvoicesTable";

function UnpaidInvoices(props) {
  console.log({ props });
  const { loading, action, invoices, getInvoices, defaultValues } = props;
  const { customerId } = defaultValues;

  useEffect(() => {
    console.log("fetching");
    getInvoices(customerId, ["sent"]);
  }, [getInvoices, customerId]);

  return loading && action === GET_CUSTOMER_INVOICES ? (
    <SkeletonLoader />
  ) : invoices && invoices.length > 0 ? (
    <UnpaidInvoicesTable invoices={invoices || []} />
  ) : (
    <Empty message="There are no invoices pending payment" />
  );
}

function mapStateToProps(state) {
  const { loading, action, invoices } = state.invoicesReducer;

  return { loading, action, invoices };
}

function mapDispatchToProps(dispatch) {
  return {
    getInvoices: (customerId, statuses) =>
      dispatch({ type: GET_CUSTOMER_INVOICES, customerId, statuses }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UnpaidInvoices);
