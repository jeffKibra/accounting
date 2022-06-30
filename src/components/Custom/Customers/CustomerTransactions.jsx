import { useState } from "react";
import PropTypes from "prop-types";
import { Box } from "@chakra-ui/react";

import ControlledSelect from "../../ui/ControlledSelect";

import CustomerInvoices from "../../../containers/Management/Invoices/CustomerInvoices";

const transactionTypes = [
  { name: "Invoices", value: "invoices" },
  { name: "Payments", value: "payments" },
  { name: "Sales Receipts", value: "sales_receipts" },
];

function CustomerTransactions(props) {
  const {
    customer: { customerId },
  } = props;
  const [transactionType, setTransactionType] = useState("invoices");

  return (
    <Box w="full">
      <Box w="140px">
        <ControlledSelect
          onChange={setTransactionType}
          value={transactionType}
          options={transactionTypes}
          allowClearSelection={false}
          colorScheme="cyan"
        />
      </Box>
      {/* <Divider  /> */}
      <Box py={2} w="full">
        <CustomerInvoices customerId={customerId} />
      </Box>
    </Box>
  );
}

CustomerTransactions.propTypes = {
  customer: PropTypes.shape({ customerId: PropTypes.string.isRequired }),
};

export default CustomerTransactions;
