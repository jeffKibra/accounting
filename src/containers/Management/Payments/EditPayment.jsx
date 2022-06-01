import { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { GET_ITEMS } from "../../../store/actions/itemsActions";
import { GET_CUSTOMERS } from "../../../store/actions/customersActions";
import { GET_CUSTOMER_INVOICES } from "../../../store/actions/invoicesActions";

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
    invoices,
  } = props;
  // console.log({ props });
  const [formValues, setFormValues] = useState(payment || {});

  const { customerId } = formValues;

  useEffect(() => {
    getCustomers();
  }, [getCustomers]);

  useEffect(() => {
    if (customerId) {
      getInvoices(customerId, ["active", "sent", "partially paid"]);
    }
  }, [customerId, getInvoices]);

  function updateFormValues(data) {
    setFormValues((current) => ({ ...current, ...data }));
  }

  function saveAll(data) {
    //update form values so that incase saving fails, data is not lost
    updateFormValues(data);
    //create new all inclusive data
    const allData = {
      ...formValues,
      ...data,
    };
    // console.log({ allData });
    saveData(allData);
  }

  // console.log({ UnpaidInvoices, ReceivePaymentForm });

  return loading && action === GET_CUSTOMERS ? (
    <SkeletonLoader />
  ) : customers?.length > 0 ? (
    <Box w="full" h="full">
      <Stepper
        steps={[
          {
            label: "Receive Payment",
            content: (
              <Flex
                mt={1}
                w="full"
                justify="center"
                h="full"
                overflowY="auto"
                pb="100px"
              >
                <ReceivePaymentForm
                  handleFormSubmit={updateFormValues}
                  customers={customers}
                  loading={updating}
                  defaultValues={formValues}
                  accounts={accounts}
                />
              </Flex>
            ),
          },
          {
            label: "Payment For",
            content: loadingInvoices ? (
              <SkeletonLoader />
            ) : (
              formValues.amount > 0 && (
                <InvoicesPaymentForm
                  paymentId={paymentId}
                  handleFormSubmit={saveAll}
                  updateFormValues={(payments) =>
                    updateFormValues({ payments })
                  }
                  formValues={formValues}
                  invoices={invoices || []}
                  loading={updating}
                />
              )
            ),
          },
        ]}
      />
    </Box>
  ) : (
    <Empty message="Please add atleast one CUSTOMER to continue or reload the page" />
  );
}

EditPayment.propTypes = {
  saveData: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  payment: PropTypes.shape({
    reference: PropTypes.string,
    paymentModeId: PropTypes.string,
    accountId: PropTypes.string,
    bankCharges: PropTypes.number,
    amount: PropTypes.number,
    customerId: PropTypes.string,
    paymentId: PropTypes.string,
    paymentDate: PropTypes.string,
    paymentSlug: PropTypes.string,
    taxDeducted: PropTypes.string,
    tdsTaxAccount: PropTypes.string,
    notes: PropTypes.string,
  }),
};

function mapStateToProps(state) {
  const { loading, customers, action } = state.customersReducer;
  const { accounts } = state.accountsReducer;
  const { loading: l, action: a, invoices } = state.invoicesReducer;

  const loadingInvoices = l && a === GET_CUSTOMER_INVOICES;

  return {
    loading,
    action,
    customers,
    accounts,
    loadingInvoices,
    invoices,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getItems: () => dispatch({ type: GET_ITEMS }),
    getCustomers: () => dispatch({ type: GET_CUSTOMERS }),
    getInvoices: (customerId, statuses) =>
      dispatch({ type: GET_CUSTOMER_INVOICES, customerId, statuses }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPayment);
