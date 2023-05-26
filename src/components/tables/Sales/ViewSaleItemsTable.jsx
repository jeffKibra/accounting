import {
  TableContainer,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  Text,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { isItemABooking } from 'utils/sales';

function checkIfDateIsValid(date) {
  const dateIsValid = date && new Date(date).toDateString() !== 'Invalid Date';
  console.log({ dateIsValid });

  return dateIsValid;
}

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
                item: { name, type, unit },
                quantity,
                itemRate,
                itemTax,
                itemRateTotal,
                itemTaxTotal,
                dateRange,
              } = itemDetails;

              let startDate = new Date();
              let endDate = new Date();
              if (Array.isArray(dateRange)) {
                const incomingStartDate = dateRange[0];
                const incomingEndDate = dateRange[1] || incomingStartDate;

                const startDateIsValid = checkIfDateIsValid(incomingStartDate);
                const endDateIsValid = checkIfDateIsValid(incomingEndDate);
                console.log({ startDateIsValid, endDateIsValid });

                if (startDateIsValid && endDateIsValid) {
                  startDate = new Date(incomingStartDate);
                  endDate = new Date(incomingEndDate);
                }
              }

              const itemIsABooking = isItemABooking(type);

              return (
                <Tr key={i}>
                  <Td>{i + 1}</Td>
                  <Td>
                    {name} <br />{' '}
                    {itemIsABooking ? (
                      <Text fontSize="xs" color="#1A202C">
                        {/* Booked:{' '} */}
                        <Text color="green" as="span">
                          {`${startDate.toDateString()}-${endDate.toDateString()}`}
                        </Text>
                      </Text>
                    ) : (
                      ''
                    )}{' '}
                  </Td>
                  <Td isNumeric>{`${Number(quantity).toLocaleString()} ${
                    unit || ''
                  }`}</Td>
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
        vehicleId: PropTypes.string.isRequired,
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
