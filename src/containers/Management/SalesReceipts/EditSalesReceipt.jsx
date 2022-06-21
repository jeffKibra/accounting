import { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { SalesContextProvider } from "../../../contexts/SalesContext";

import { GET_PAYMENT_MODES } from "../../../store/actions/paymentModesActions";

import Stepper from "../../../components/ui/Stepper";
import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

import SalesReceiptForm from "../../../components/forms/SalesReceipts/SalesReceiptForm";
import SaleItemsForm from "../../../components/forms/Sales/SaleItemsForm";

function EditSalesReceipt(props) {
  const {
    salesReceipt,
    handleFormSubmit,
    updating,
    getPaymentModes,
    loadingPaymentModes,
    paymentModes,
    accounts,
  } = props;
  // console.log({ props });

  useEffect(() => {
    getPaymentModes();
  }, [getPaymentModes]);

  return loadingPaymentModes ? (
    <SkeletonLoader />
  ) : paymentModes?.length > 0 ? (
    <SalesContextProvider
      defaultValues={salesReceipt}
      updating={updating}
      saveData={handleFormSubmit}
    >
      <Box w="full" h="full">
        <Stepper
          steps={[
            {
              label: "Add Items",
              content: <SaleItemsForm />,
            },
            {
              label: "Payment Details",
              content: (
                <SalesReceiptForm
                  paymentModes={paymentModes}
                  accounts={accounts}
                />
              ),
            },
          ]}
        />
      </Box>
    </SalesContextProvider>
  ) : (
    <Empty message="Payment modes not found! Please try Reloading the page!" />
  );
}

EditSalesReceipt.propTypes = {
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
    invoiceDate: PropTypes.instanceOf(Date),
    dueDate: PropTypes.instanceOf(Date),
    subject: PropTypes.string,
    customerNotes: PropTypes.string,
    invoiceSlug: PropTypes.string,
    invoiceId: PropTypes.string,
  }),
};

function mapStateToProps(state) {
  const { loading: loadingPaymentModes, paymentModes } =
    state.paymentModesReducer;
  const { accounts } = state.accountsReducer;

  return {
    loadingPaymentModes,
    paymentModes,
    accounts,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getPaymentModes: () => dispatch({ type: GET_PAYMENT_MODES }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditSalesReceipt);
