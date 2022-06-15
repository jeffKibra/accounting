import { Box } from "@chakra-ui/react";
import PropTypes from "prop-types";

import { InvoicesContextProvider } from "../../../contexts/InvoicesContext";

import Stepper from "../../../components/ui/Stepper";

import InvoiceDetailsForm from "../../../components/forms/Invoice/InvoiceDetailsForm";
import InvoiceItemsForm from "../../../components/forms/Invoice/InvoiceItemsForm";

function EditSalesReceipt(props) {
  const { invoice, handleFormSubmit, updating } = props;
  // console.log({ props });

  return (
    <InvoicesContextProvider
      invoice={invoice}
      updating={updating}
      saveData={handleFormSubmit}
    >
      <Box w="full" h="full">
        <Stepper
          steps={[
            {
              label: "Add Items",
              content: <InvoiceItemsForm />,
            },
            {
              label: "Payment Details",
              content: <InvoiceDetailsForm />,
            },
          ]}
        />
      </Box>
    </InvoicesContextProvider>
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

export default EditSalesReceipt;
