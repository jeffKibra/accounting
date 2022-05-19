import {
  TableContainer,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

function InvoicePdfItems(props) {
  const { items } = props;

  const discounts = [].concat(items).some((item) => {
    return item.discount > 0;
  });

  console.log({ discounts });

  return (
    <>
      <TableContainer>
        <Table wordBreak="break-word" size="sm">
          <Thead textTransform="capitalize">
            <Tr color="white" bg="#3C3D3A" py={2}>
              <Th w="5%" textTransform="inherit" color="inherit" py={2}>
                #
              </Th>
              <Th textTransform="inherit" color="inherit" py={2}>
                Item
              </Th>
              <Th
                w="11%"
                textTransform="inherit"
                color="inherit"
                py={2}
                isNumeric
              >
                Qty
              </Th>
              <Th
                w="11%"
                textTransform="inherit"
                color="inherit"
                py={2}
                isNumeric
              >
                Rate
              </Th>
              {discounts && (
                <Th
                  w="11%"
                  textTransform="inherit"
                  color="inherit"
                  py={2}
                  isNumeric
                >
                  Discount
                </Th>
              )}

              <Th
                w="11%"
                textTransform="inherit"
                color="inherit"
                py={2}
                isNumeric
              >
                Amount
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item, i) => {
              const {
                name,
                quantity,
                rate,
                discount,
                discountType,
                totalAmount,
              } = item;
              return (
                <Tr key={i}>
                  <Td>{i + 1}</Td>
                  <Td>{name}</Td>
                  <Td isNumeric>{Number(quantity).toLocaleString()}</Td>
                  <Td isNumeric>{Number(rate).toLocaleString()}</Td>
                  {discounts && (
                    <Td isNumeric>
                      {Number(discount).toLocaleString()}
                      {discountType === "%" && discountType}
                    </Td>
                  )}

                  <Td isNumeric>{Number(totalAmount).toLocaleString()}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

InvoicePdfItems.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      variant: PropTypes.string,
      itemId: PropTypes.string.isRequired,
      rate: PropTypes.number.isRequired,
      tax: PropTypes.oneOfType([
        PropTypes.shape({
          name: PropTypes.string,
          rate: PropTypes.number,
          taxId: PropTypes.string,
        }),
        PropTypes.string,
      ]),
      totalAmount: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ),
};

export default InvoicePdfItems;
