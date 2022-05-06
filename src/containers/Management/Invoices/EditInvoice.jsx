import { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { INVOICES } from "../../../nav/routes";

import { GET_ITEMS } from "../../../store/actions/itemsActions";
import { GET_CUSTOMERS } from "../../../store/actions/customersActions";
import { CREATE_INVOICE } from "../../../store/actions/invoicesActions";
import { reset } from "../../../store/slices/invoicesSlice";

import StepperForm from "../../../components/ui/StepperForm";

import Empty from "../../../components/ui/Empty";
import SkeletonLoader from "../../../components/ui/SkeletonLoader";

import InvoiceDetailsForm from "../../../components/forms/Invoice/InvoiceDetailsForm";
import InvoiceItems from "../../../components/Custom/Invoices/InvoiceItems";

function EditInvoice(props) {
  const {
    loading,
    items,
    action,
    loadingCustomers,
    customers,
    customersAction,
    loadingInvoices,
    isModified,
    invoiceAction,
    getItems,
    getCustomers,
    createInvoice,
    resetInvoice,
  } = props;
  const creating = loadingInvoices && invoiceAction === CREATE_INVOICE;

  const navigate = useNavigate();

  useEffect(() => {
    getItems();
    getCustomers();
  }, [getItems, getCustomers]);

  useEffect(() => {
    if (isModified) {
      resetInvoice();
      navigate(INVOICES);
    }
  }, [isModified, resetInvoice, navigate]);

  function handleFormSubmit(data) {
    console.log({ data });
    createInvoice(data);
  }

  return (loading && action === GET_ITEMS) ||
    (loadingCustomers && customersAction === GET_CUSTOMERS) ? (
    <SkeletonLoader />
  ) : customers?.length > 0 && items?.length > 0 ? (
    <Box w="full" h="full">
      <StepperForm
        handleFormSubmit={handleFormSubmit}
        steps={[
          {
            label: "Add Items",
            props: { items, loading: creating },
            form: InvoiceItems,
          },
          {
            label: "Invoice Details",
            props: { customers, loading: creating },
            form: InvoiceDetailsForm,
          },
        ]}
      />
    </Box>
  ) : (
    <Empty message="Please add atleast one CUSTOMER and one ITEM to continue or reload the page" />
  );
}

function mapStateToProps(state) {
  const { loading, items, action } = state.itemsReducer;
  const {
    loading: loadingCustomers,
    customers,
    action: customersAction,
  } = state.customersReducer;
  const {
    loading: loadingInvoices,
    isModified,
    action: invoiceAction,
  } = state.invoicesReducer;

  return {
    loading,
    items,
    action,
    loadingCustomers,
    customers,
    customersAction,
    loadingInvoices,
    isModified,
    invoiceAction,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getItems: () => dispatch({ type: GET_ITEMS }),
    getCustomers: () => dispatch({ type: GET_CUSTOMERS }),
    createInvoice: (data) => dispatch({ type: CREATE_INVOICE, data }),
    resetInvoice: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditInvoice);
