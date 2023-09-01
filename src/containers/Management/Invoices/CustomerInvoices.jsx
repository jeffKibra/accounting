import { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { GET_CUSTOMER_INVOICES } from "../../../store/actions/invoicesActions";
import { reset } from "../../../store/slices/invoicesSlice";

import CustomSpinner from "../../../components/ui/CustomSpinner";
import Empty from "../../../components/ui/Empty";

import InvoicesTable from "../../../components/tables/Invoices/InvoicesTable";

function CustomerInvoices(props) {
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

  return loading && action === GET_CUSTOMER_INVOICES ? (
    <CustomSpinner />
  ) : invoices?.length > 0 ? (
    <InvoicesTable invoices={invoices} />
  ) : (
    <Empty />
  );
}

CustomerInvoices.propTypes = {
  customerId: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  const { loading, invoices, action, isModified } = state.invoicesReducer;

  return { loading, invoices, action, isModified };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { customerId } = ownProps;
  return {
    getInvoices: () =>
      dispatch({ type: GET_CUSTOMER_INVOICES, payload: customerId }),
    resetInvoices: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerInvoices);
