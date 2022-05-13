import { useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { PaymentsContextProvider } from "../../../contexts/PaymentsContext";

import Stepper from "../../../components/ui/Stepper";

import { GET_ITEMS } from "../../../store/actions/itemsActions";
import { GET_CUSTOMERS } from "../../../store/actions/customersActions";

import Empty from "../../../components/ui/Empty";
import SkeletonLoader from "../../../components/ui/SkeletonLoader";

import UnpaidInvoices from "../../../components/Custom/PaymentsReceived/UnpaidInvoices";
import ReceivePaymentForm from "../../../components/forms/PaymentsReceived/ReceivePaymentForm";

function EditPayment(props) {
  const {
    payment,
    paymentId,
    loading,
    action,
    customers,
    getCustomers,
    handleFormSubmit,
    updating,
  } = props;
  // console.log({ props });

  useEffect(() => {
    getCustomers();
  }, [getCustomers]);

  // console.log({ UnpaidInvoices, ReceivePaymentForm });

  return loading && action === GET_CUSTOMERS ? (
    <SkeletonLoader />
  ) : customers?.length > 0 ? (
    <PaymentsContextProvider
      saveData={handleFormSubmit}
      defaultValues={payment}
      paymentId={paymentId}
    >
      <Box w="full">
        <Stepper
          steps={[
            {
              label: "Receive Payment",
              content: (
                <Flex mt={1} w="full" justify="center">
                  <ReceivePaymentForm
                    // handleFormSubmit={handleFormSubmit}
                    customers={customers}
                    loading={updating}
                    // defaultValues={payment}
                  />
                </Flex>
              ),
            },
            {
              label: "Payment For",
              content: <UnpaidInvoices />,
            },
          ]}
        />
      </Box>
    </PaymentsContextProvider>
  ) : (
    <Empty message="Please add atleast one CUSTOMER to continue or reload the page" />
  );
}

EditPayment.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  payment: PropTypes.shape({
    reference: PropTypes.string,
    paymentMode: PropTypes.string,
    account: PropTypes.string,
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

  return {
    loading,
    action,
    customers,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getItems: () => dispatch({ type: GET_ITEMS }),
    getCustomers: () => dispatch({ type: GET_CUSTOMERS }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPayment);
