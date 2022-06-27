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

function ViewExpenseItemsTable(props) {
  const { items } = props;

  return (
    <>
      <TableContainer>
        <Table wordBreak="break-word" size="sm">
          <Thead textTransform="capitalize">
            <Tr bg="gray.100" py={2}>
              <Th fontSize="sm" textTransform="inherit" color="inherit" py={2}>
                Details
              </Th>
              <Th
                fontSize="sm"
                w="11%"
                textTransform="inherit"
                color="inherit"
                py={2}
              >
                Account
              </Th>
              <Th
                fontSize="sm"
                w="11%"
                textTransform="inherit"
                color="inherit"
                py={2}
                isNumeric
              >
                Tax
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
            {items.map((item, i) => {
              const {
                details,
                account: { name },
                tax: { name: taxName },
                amount,
                itemTax,
              } = item;
              console.log({ item });
              return (
                <Tr key={i}>
                  <Td>{details}</Td>
                  <Td>{name}</Td>
                  <Td>
                    {taxName &&
                      `${taxName}(${Number(
                        Number(itemTax).toFixed(2)
                      ).toLocaleString()})`}
                  </Td>

                  <Td isNumeric>{Number(amount).toLocaleString()}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

ViewExpenseItemsTable.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      details: PropTypes.string.isRequired,
      account: PropTypes.object.isRequired,
      amount: PropTypes.number.isRequired,
      tax: PropTypes.shape({
        name: PropTypes.string,
        rate: PropTypes.number,
        taxId: PropTypes.string,
      }),
    })
  ),
};

export default ViewExpenseItemsTable;
