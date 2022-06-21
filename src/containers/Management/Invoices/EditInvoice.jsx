import { Box } from "@chakra-ui/react";
import PropTypes from "prop-types";

import { SalesContextProvider } from "../../../contexts/SalesContext";
import Stepper from "../../../components/ui/Stepper";

import InvoiceForm from "../../../components/forms/Invoice/InvoiceForm";
import SaleItemsForm from "../../../components/forms/Sales/SaleItemsForm";

function EditInvoice(props) {
  const { invoice, handleFormSubmit, updating } = props;
  // console.log({ props });

  return (
    <SalesContextProvider
      defaultValues={invoice}
      updating={updating}
      saveData={handleFormSubmit}
    >
      <Box w="full" h="full">
        <Stepper
          steps={[
            {
              label: "Invoice Details",
              content: <InvoiceForm />,
            },
            {
              label: "Add Items",
              content: <SaleItemsForm />,
            },
          ]}
        />
      </Box>
    </SalesContextProvider>
  );
}

EditInvoice.propTypes = {
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
    invoiceId: PropTypes.string,
  }),
};

export default EditInvoice;
