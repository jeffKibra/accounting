import {
  TableContainer,
  Table,
  Tbody,
  Th,
  Td,
  Tr,
  IconButton,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { RiAddLine } from "react-icons/ri";

import CustomModal from "../../ui/CustomModal";

import AdjustmentForm from "../../forms/Invoice/AdjustmentForm";
import ShippingForm from "../../forms/Invoice/ShippingForm";

function SummaryTable(props) {
  const { summary, shipping, setShipping, adjustment, setAdjustment } = props;

  const { subTotal, taxes, totalAmount } = summary;
  console.log({ summary });

  return (
    <TableContainer>
      <Table size="sm">
        <Tbody>
          <Tr>
            <Td>Sub Total</Td>
            <Td isNumeric>{subTotal}</Td>
          </Tr>

          <Tr>
            <Td>
              Shipping Charges{" "}
              <CustomModal
                closeOnOverlayClick={false}
                title="Shipping Charges"
                renderTrigger={(onOpen) => {
                  return (
                    <IconButton
                      fontSize="16px"
                      colorScheme="cyan"
                      size="xs"
                      icon={<RiAddLine />}
                      onClick={onOpen}
                    />
                  );
                }}
                renderContent={(onClose) => {
                  function handleFormSubmit(data) {
                    setShipping(data.shipping);
                  }

                  return (
                    <ShippingForm
                      shipping={shipping}
                      handleFormSubmit={handleFormSubmit}
                      onClose={onClose}
                    />
                  );
                }}
              />
            </Td>

            <Td isNumeric>{shipping}</Td>
          </Tr>

          {taxes.map((tax, i) => {
            const { name, rate, taxedAmount } = tax;
            return (
              <Tr key={i}>
                <Td>
                  {" "}
                  {name} ({rate}%)
                </Td>
                <Td isNumeric>{taxedAmount}</Td>
              </Tr>
            );
          })}

          <Tr>
            <Td>
              Adjustments{" "}
              <CustomModal
                closeOnOverlayClick={false}
                title="Adjustment"
                renderTrigger={(onOpen) => {
                  return (
                    <IconButton
                      fontSize="16px"
                      colorScheme="cyan"
                      size="xs"
                      icon={<RiAddLine />}
                      onClick={onOpen}
                    />
                  );
                }}
                renderContent={(onClose) => {
                  function handleFormSubmit(data) {
                    setAdjustment(data.adjustment);
                  }

                  return (
                    <AdjustmentForm
                      adjustment={adjustment}
                      handleFormSubmit={handleFormSubmit}
                      onClose={onClose}
                    />
                  );
                }}
              />
            </Td>
            <Td isNumeric>{adjustment}</Td>
          </Tr>

          <Tr>
            <Th>Total (KES)</Th>
            <Th isNumeric>{totalAmount}</Th>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
}

SummaryTable.propTypes = {
  summary: PropTypes.shape({
    subTotal: PropTypes.number,
    taxes: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        rate: PropTypes.number,
        taxId: PropTypes.string,
        taxedAmount: PropTypes.number,
      })
    ),
    totalTax: PropTypes.number,
    totalAmount: PropTypes.number,
  }),
  shipping: PropTypes.number.isRequired,
  setShipping: PropTypes.func.isRequired,
  adjustment: PropTypes.number.isRequired,
  setAdjustment: PropTypes.func.isRequired,
};

export default SummaryTable;
