import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { GET_ITEMS } from "../../../store/actions/itemsActions";
import { GET_CUSTOMERS } from "../../../store/actions/customersActions";
import { GET_PAYMENT_MODES } from "../../../store/actions/paymentModesActions";
import {
  GET_UNPAID_CUSTOMER_INVOICES,
  GET_PAYMENT_INVOICES_TO_EDIT,
} from "../../../store/actions/invoicesActions";

import Stepper from "../../../components/ui/Stepper";
import Empty from "../../../components/ui/Empty";
import SkeletonLoader from "../../../components/ui/SkeletonLoader";

import InvoicesPaymentForm from "../../../components/forms/Payments/InvoicesPaymentForm";
import ReceivePaymentForm from "../../../components/forms/Payments/ReceivePaymentForm";

function EditPayment(props) {
  const {
    payment,
    paymentId,
    loading,
    action,
    customers,
    accounts,
    getCustomers,
    saveData,
    updating,
    loadingInvoices,
    getInvoices,
    getInvoicesToEdit,
    invoices,
    getPaymentModes,
    loadingPaymentModes,
    paymentModes,
  } = props;
  const [formValues, setFormValues] = useState(payment ? { ...payment } : null);
  const [payments, setPayments] = useState(
    payment?.payments ? { ...payment.payments } : null
  );
  // console.log({ payments, formValues });
  const customerId = formValues?.customerId;

  useEffect(() => {
    getCustomers();
    getPaymentModes();
  }, [getCustomers, getPaymentModes]);

  useEffect(() => {
    if (customerId && paymentId) {
      // console.log({ customerId, paymentId });
      getInvoicesToEdit(customerId, paymentId);
    } else if (customerId) {
      // console.log({ customerId });
      getInvoices(customerId);
    }
  }, [customerId, paymentId, getInvoices, getInvoicesToEdit]);

  useEffect(() => {
    setPayments((current) => {
      const currentPayments = { ...current };
      const paymentsArray = Object.keys(currentPayments);
      if (paymentsArray?.length > 0) {
        paymentsArray.forEach((invoiceId) => {
          //check if this invoice is in the list of invoices
          const found = invoices.find(
            (invoice) => invoice.invoiceId === invoiceId
          );

          if (!found) {
            //delete the invoice payment if it has not been found
            delete currentPayments[invoiceId];
          }
        });

        return { ...currentPayments };
      } else {
        return current;
      }
    });
  }, [invoices, setPayments]);

  function updateFormValues(data) {
    setFormValues((current) => ({ ...(current ? current : {}), ...data }));
  }

  function saveAll(data) {
    const { payments, ...rest } = data;
    //update form values so that incase saving fails, data is not lost
    // console.log({ data });
    /**
     * update states. helpful incase saving fails, all the data is preserved
     */
    updateFormValues(rest);
    setPayments(payments);
    //create new all inclusive data
    const allData = {
      ...formValues,
      ...data,
    };
    // console.log({ allData });
    saveData(allData);
  }

  // console.log({ UnpaidInvoices, ReceivePaymentForm });

  return (loading && action === GET_CUSTOMERS) || loadingPaymentModes ? (
    <SkeletonLoader />
  ) : customers?.length > 0 || paymentModes?.length > 0 ? (
    <Box w="full" h="full">
      <Stepper
        steps={[
          {
            label: "Receive Payment",
            content: (
              <ReceivePaymentForm
                handleFormSubmit={updateFormValues}
                customers={customers}
                loading={updating}
                defaultValues={formValues}
                accounts={accounts}
                paymentId={paymentId}
                paymentModes={paymentModes}
              />
            ),
          },
          {
            label: "Payment For",
            content: loadingInvoices ? (
              <SkeletonLoader />
            ) : (
              formValues?.amount > 0 && (
                <InvoicesPaymentForm
                  paymentId={paymentId}
                  handleFormSubmit={saveAll}
                  updatePayments={setPayments}
                  formValues={formValues}
                  payments={payments}
                  invoices={invoices || []}
                  loading={updating}
                />
              )
            ),
          },
        ]}
      />
    </Box>
  ) : customers?.length === 0 ? (
    <Empty message="Please add atleast one CUSTOMER to continue or reload the page" />
  ) : paymentModes?.length === 0 ? (
    <Empty message="Failed to load Payment Modes. This could be because of a network issue. Try reloading the page!" />
  ) : null;
}

EditPayment.propTypes = {
  saveData: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  paymentId: PropTypes.string,
  payment: PropTypes.shape({
    reference: PropTypes.string,
    paymentModeId: PropTypes.string,
    accountId: PropTypes.string,
    bankCharges: PropTypes.number,
    amount: PropTypes.number,
    customerId: PropTypes.string,
    paymentId: PropTypes.string,
    paymentDate: PropTypes.instanceOf(Date),
    taxDeducted: PropTypes.string,
    tdsTaxAccount: PropTypes.string,
    notes: PropTypes.string,
  }),
};

function mapStateToProps(state) {
  const { loading, customers, action } = state.customersReducer;
  const { accounts } = state.accountsReducer;
  const { loading: l, action: a, invoices } = state.invoicesReducer;
  const { loading: lpm, action: pma, paymentModes } = state.paymentModesReducer;

  const loadingInvoices =
    l &&
    (a === GET_UNPAID_CUSTOMER_INVOICES || a === GET_PAYMENT_INVOICES_TO_EDIT);
  const loadingPaymentModes = lpm && pma === GET_PAYMENT_MODES;

  return {
    loading,
    action,
    customers,
    accounts,
    loadingInvoices,
    invoices,
    loadingPaymentModes,
    paymentModes,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getItems: () => dispatch({ type: GET_ITEMS }),
    getCustomers: () => dispatch({ type: GET_CUSTOMERS }),
    getPaymentModes: () => dispatch({ type: GET_PAYMENT_MODES }),
    getInvoices: (customerId) =>
      dispatch({ type: GET_UNPAID_CUSTOMER_INVOICES, customerId }),
    getInvoicesToEdit: (customerId, paymentId) =>
      dispatch({ type: GET_PAYMENT_INVOICES_TO_EDIT, customerId, paymentId }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPayment);
