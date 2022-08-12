import {
  TableContainer,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

function ViewSaleItemsTable(props) {
  const { items, taxType } = props;

  return (
    <>
      <TableContainer>
        <Table wordBreak="break-word" size="sm">
          <Thead textTransform="capitalize">
            <Tr bg="gray.100" py={2}>
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
            {items.map((itemDetails, i) => {
              const {
                item: { name },
                quantity,
                itemRate,
                itemTax,
                itemRateTotal,
                itemTaxTotal,
              } = itemDetails;
              return (
                <Tr key={i}>
                  <Td>{i + 1}</Td>
                  <Td>{name}</Td>
                  <Td isNumeric>{Number(quantity).toLocaleString()}</Td>
                  <Td isNumeric>
                    {Number(
                      taxType === 'taxInclusive' ? itemRate + itemTax : itemRate
                    ).toLocaleString()}
                  </Td>

                  <Td isNumeric>
                    {Number(
                      taxType === 'taxInclusive'
                        ? itemRateTotal + itemTaxTotal
                        : itemRateTotal
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
      item: PropTypes.shape({
        name: PropTypes.string.isRequired,
        variant: PropTypes.string,
        itemId: PropTypes.string.isRequired,
      }),
      rate: PropTypes.number.isRequired,
      salesTax: PropTypes.oneOfType([
        PropTypes.shape({
          name: PropTypes.string,
          rate: PropTypes.number,
          taxId: PropTypes.string,
        }),
        PropTypes.string,
      ]),
      itemRateTotal: PropTypes.number.isRequired,
      itemRate: PropTypes.number.isRequired,
      itemTaxTotal: PropTypes.number.isRequired,
      itemTax: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ),
  taxType: PropTypes.string.isRequired,
};

export default ViewSaleItemsTable;
