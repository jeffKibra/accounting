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

function ViewSaleItemsTable(props) {
  const { items, taxType } = props;

  const discounts = [].concat(items).some((item) => {
    return item.discount > 0;
  });

  // console.log({ discounts });

  return (
    <>
      <TableContainer>
        <Table wordBreak="break-word" size="sm">
          <Thead textTransform="capitalize">
            <Tr bg="cyan.100" py={2}>
              <Th
                fontSize="sm"
                w="5%"
                textTransform="inherit"
                color="inherit"
                py={2}
              >
                #
              </Th>
              <Th fontSize="sm" textTransform="inherit" color="inherit" py={2}>
                Item
              </Th>
              <Th
                fontSize="sm"
                w="11%"
                textTransform="inherit"
                color="inherit"
                py={2}
                isNumeric
              >
                Qty
              </Th>
              <Th
                fontSize="sm"
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
                  fontSize="sm"
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
                fontSize="sm"
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
                itemRate,
                itemTax,
                discount,
                discountType,
                totalAmount,
                totalTax,
              } = item;
              return (
                <Tr key={i}>
                  <Td>{i + 1}</Td>
                  <Td>{name}</Td>
                  <Td isNumeric>{Number(quantity).toLocaleString()}</Td>
                  <Td isNumeric>
                    {Number(
                      taxType === "taxInclusive" ? itemRate + itemTax : itemRate
                    ).toLocaleString()}
                  </Td>
                  {discounts && (
                    <Td isNumeric>
                      {Number(discount).toLocaleString()}
                      {discountType === "%" && discountType}
                    </Td>
                  )}

                  <Td isNumeric>
                    {Number(
                      taxType === "taxInclusive"
                        ? totalAmount + totalTax
                        : totalAmount
                    ).toLocaleString()}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

ViewSaleItemsTable.propTypes = {
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
      itemRate: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ),
  taxType: PropTypes.string.isRequired,
};

export default ViewSaleItemsTable;
