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

function PaymentInvoicesTable(props) {
  const { payments, invoices } = props;

  return (
    <>
      <TableContainer>
        <Table wordBreak="break-word">
          <Thead textTransform="capitalize">
            <Tr fontSize="14px" color="black" bg="gray.100" py={2}>
              <Th
                w="5%"
                textTransform="inherit"
                color="inherit"
                fontSize="inherit"
                py={2}
              >
                Invoice#
              </Th>
              <Th
                fontSize="inherit"
                textTransform="inherit"
                color="inherit"
                py={2}
              >
                Invoice Date
              </Th>
              <Th
                w="11%"
                textTransform="inherit"
                color="inherit"
                py={2}
                isNumeric
                fontSize="inherit"
              >
                Invoice Amount
              </Th>
              <Th
                w="11%"
                textTransform="inherit"
                color="inherit"
                py={2}
                isNumeric
                fontSize="inherit"
              >
                Payment Amount
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            {invoices.map((invoice, i) => {
              const {
                invoiceId,
                summary: { totalAmount },
                invoiceDate,
                transactionType,
              } = invoice;

              return (
                <Tr key={i}>
                  <Td>
                    {transactionType === "invoice"
                      ? invoiceId
                      : transactionType}
                  </Td>
                  <Td>{new Date(invoiceDate).toDateString()}</Td>
                  <Td isNumeric>{Number(totalAmount).toLocaleString()}</Td>
                  <Td isNumeric>
                    {Number(payments[invoiceId]).toLocaleString()}
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

PaymentInvoicesTable.propTypes = {
  payments: PropTypes.object.isRequired,
  invoices: PropTypes.arrayOf(
    PropTypes.shape({
      invoiceId: PropTypes.string.isRequired,
      invoiceDate: PropTypes.instanceOf(Date).isRequired,
      summary: PropTypes.shape({
        totalAmount: PropTypes.number.isRequired,
      }),
    })
  ),
};

export default PaymentInvoicesTable;
