import { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { GET_ITEMS } from "../../../store/actions/itemsActions";
import { GET_CUSTOMERS } from "../../../store/actions/customersActions";

import StepperForm from "../../../components/ui/StepperForm";

import Empty from "../../../components/ui/Empty";
import SkeletonLoader from "../../../components/ui/SkeletonLoader";

import UnpaidInvoices from "../../../components/Custom/PaymentsReceived/UnpaidInvoices";
import ReceivePaymentForm from "../../../components/forms/PaymentsReceived/ReceivePaymentForm";

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
    paymentId,
  } = props;
  console.log({ invoice });
  console.log({ props });

  useEffect(() => {
    getItems();
    getCustomers();
  }, [getItems, getCustomers]);

  console.log({ UnpaidInvoices, ReceivePaymentForm });

  return (loading && action === GET_ITEMS) ||
    (loadingCustomers && customersAction === GET_CUSTOMERS) ? (
    <SkeletonLoader />
  ) : customers?.length > 0 && items?.length > 0 ? (
    <Box w="full" h="full">
      <StepperForm
        defaultValues={{ paymentId }}
        handleFormSubmit={handleFormSubmit}
        steps={[
          {
            label: "Payment Details",
            content: <ReceivePaymentForm customers={customers} />,
          },
          {
            label: "Choose Invoices",
            content: <UnpaidInvoices />,
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
  paymentId: PropTypes.string.isRequired,
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
