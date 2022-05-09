import { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { GET_ITEMS } from "../../../store/actions/itemsActions";
import { GET_CUSTOMERS } from "../../../store/actions/customersActions";

import StepperForm from "../../../components/ui/StepperForm";

import Empty from "../../../components/ui/Empty";
import SkeletonLoader from "../../../components/ui/SkeletonLoader";

import InvoiceDetailsForm from "../../../components/forms/Invoice/InvoiceDetailsForm";
import InvoiceItems from "../../../components/Custom/Invoices/InvoiceItems";

function EditPayment(props) {
  const {
    invoice,
    loading,
    items,
    action,
    loadingCustomers,
    customers,
    customersAction,
    getItems,
    getCustomers,
    handleFormSubmit,
    updating,
  } = props;
  console.log({ invoice });
  console.log({ props });

  useEffect(() => {
    getItems();
    getCustomers();
  }, [getItems, getCustomers]);

  return (loading && action === GET_ITEMS) ||
    (loadingCustomers && customersAction === GET_CUSTOMERS) ? (
    <SkeletonLoader />
  ) : customers?.length > 0 && items?.length > 0 ? (
    <Box w="full" h="full">
      <StepperForm
        defaultValues={invoice}
        handleFormSubmit={handleFormSubmit}
        steps={[
          {
            label: "Add Items",
            props: { items, loading: updating },
            form: InvoiceItems,
          },
          {
            label: "Invoice Details",
            props: { customers, loading: updating },
            form: InvoiceDetailsForm,
          },
        ]}
      />
    </Box>
  ) : (
    <Empty message="Please add atleast one CUSTOMER and one ITEM to continue or reload the page" />
  );
}

EditPayment.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  invoice: PropTypes.shape({
    summary: PropTypes.shape({
      shipping: PropTypes.number,
      adjustment: PropTypes.number,
      totalTax: PropTypes.number,
      totalAmount: PropTypes.number,
      subTotal: PropTypes.number,
      taxes: PropTypes.array,
    }),
    selectedItems: PropTypes.array,
    customerId: PropTypes.string,
    invoiceDate: PropTypes.string,
    dueDate: PropTypes.string,
    subject: PropTypes.string,
    customerNotes: PropTypes.string,
    invoiceSlug: PropTypes.string,
    invoiceId: PropTypes.string,
  }),
};

function mapStateToProps(state) {
  const { loading, items, action } = state.itemsReducer;
  const {
    loading: loadingCustomers,
    customers,
    action: customersAction,
  } = state.customersReducer;

  return {
    loading,
    items,
    action,
    loadingCustomers,
    customers,
    customersAction,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getItems: () => dispatch({ type: GET_ITEMS }),
    getCustomers: () => dispatch({ type: GET_CUSTOMERS }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPayment);
