import { useCallback, useEffect, useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Button,
  Flex,
  Grid,
  GridItem,
  VStack,
  // Spinner,
  // Alert,
  // AlertIcon,
  // AlertTitle,
  // AlertDescription,
  Text,
  Heading,
  // Box,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

//
import ListInvoicesContext from 'contexts/ListInvoicesContext';
//
// import { useCustomerBookings } from 'hooks';

import { getPaymentsTotal } from 'utils/payments';
import { getInvoiceBalance } from 'utils/invoices';

// import Empty from 'components/ui/Empty';

// import UnpaidBookingsTable from './UnpaidBookingsTable';
import BookingsTable from 'components/tables/Bookings/BookingsTable';
import PaymentsSummaryTable from 'components/tables/PaymentsReceived/PaymentsSummaryTable';

//custom hooks
function usePaymentsTotal() {
  const { watch } = useFormContext();
  const payments = watch('payments');
  const paymentsTotal = getPaymentsTotal(payments);
  return paymentsTotal;
}
//----------------------------------------------------------------
function arePaymentsEqual(newPayments = {}, oldPayments = {}) {
  const payments1 = { ...newPayments };
  const payments2 = { ...oldPayments };

  const similarValues = [];
  const uniqueValues = [];
  Object.keys(payments1).forEach(key => {
    const newValue = payments1[key];
    const oldValue = payments2[key];

    if (newValue === oldValue) {
      similarValues.push(key);
    } else {
      uniqueValues.push(key);
    }

    delete payments2[key];
  });

  Object.keys(payments2).forEach(key => {
    uniqueValues.push(key);
  });

  // console.log({ uniqueValues, similarValues });

  return uniqueValues.length === 0;
}

//----------------------------------------------------------------

function InvoicesPayments(props) {
  // console.log({ props });
  const { paymentId, formIsDisabled, customerId, defaultPayments } = props;

  const { watch, setValue, getValues } = useFormContext();
  //
  const { list: invoices, loading } = useContext(ListInvoicesContext);
  console.log({ invoices });
  //
  const paymentsTotal = usePaymentsTotal();

  const updatePayments = useCallback(
    values => {
      setValue('payments', values);
    },
    [setValue]
  );

  useEffect(() => {
    function getPaymentsResetValues() {
      if (Array.isArray(invoices) && invoices?.length > 0) {
        const paymentsFromForm = getValues('payments') || {};
        // console.log({ paymentsFromForm });
        const currentPayments = {
          ...defaultPayments,
          ...paymentsFromForm,
        };
        const paymentsArray = Object.keys(currentPayments);
        // console.log({ paymentsArray });
        if (paymentsArray?.length > 0) {
          paymentsArray.forEach(bookingId => {
            //check if this booking is in the list of invoices
            const found = invoices.find(booking => booking.id === bookingId);

            if (!found) {
              //delete the booking payment if it has not been found
              delete currentPayments[bookingId];
            }
          });

          return { ...currentPayments };
        } else {
          return {};
        }
      } else {
        return {};
      }
    }

    // console.log('generating payments rest values');
    const newPayments = getPaymentsResetValues();
    // console.log({ newPayments });
    const oldPayments = getValues('payments');
    const paymentsAreEqual = arePaymentsEqual(newPayments, oldPayments);
    // console.log({ paymentsAreEqual });

    if (!paymentsAreEqual) {
      updatePayments(newPayments);
    }
  }, [invoices, defaultPayments, updatePayments, getValues]);

  const amount = watch('amount');

  // const payments = watch('payments');

  // const paymentsTotal = getPaymentsTotal(payments);

  // useEffect(() => {
  //   console.log('payments have changed', payments);
  // }, [payments]);
  // console.log({ payments });
  // console.log({ payments, paymentsTotal });

  const generateAutoFillValues = useCallback(
    (invoices, amount) => {
      if (invoices?.length > 0) {
        let excess = amount;
        const balances = {};

        invoices.forEach(invoice => {
          const { _id: invoiceId, balance: invoiceBalance } = invoice;
          let autoFill = 0;
          // const invoiceBalance = getInvoiceBalance(invoice, paymentId);
          // console.log({ invoiceBalance });

          if (invoiceBalance <= excess) {
            autoFill = invoiceBalance;
            excess = excess - invoiceBalance;
          } else {
            autoFill = excess;
            excess = 0;
          }

          balances[invoiceId] = autoFill;
        });

        return balances;
      }
      return {};
    },
    [
      // paymentId
    ]
  );

  /**
   * methods
   */

  function clear() {
    if (invoices?.length > 0) {
      const values = {};

      invoices.forEach(invoice => {
        const { id: invoiceId } = invoice;

        values[invoiceId] = 0;
      });

      updatePayments(values);
    }
  }

  function autoPay() {
    const values = generateAutoFillValues(invoices, amount);
    updatePayments(values);
    // reset(values);
  }

  return (
    <VStack mt={5} pt={4} w="full">
      <Flex w="full" justify="space-between">
        <Heading as="h3" size="md">
          invoices
        </Heading>

        <Flex justify="flex-end" w="full">
          <Button
            onClick={clear}
            colorScheme="cyan"
            variant="outline"
            size="xs"
            mr={2}
            isDisabled={formIsDisabled || loading}
          >
            clear
          </Button>
          <Button
            onClick={autoPay}
            colorScheme="cyan"
            variant="outline"
            size="xs"
            isDisabled={formIsDisabled || loading}
          >
            auto pay
          </Button>
        </Flex>
      </Flex>

      {customerId ? (
        <Grid w="full" gap={2} templateColumns="repeat(12, 1fr)">
          <GridItem colSpan={12}>
            <BookingsTable
              // showCustomer
              paymentTotal={amount}
              paymentId={paymentId || ''}
              loading={loading}
              formIsDisabled={formIsDisabled}
              isPayment
              columnsToExclude={['actions', 'imprest', 'paymentAmount']}
              // taxDeducted={taxDeducted}
            />
          </GridItem>
          <GridItem colSpan={[1, 6]} />
          <GridItem colSpan={[11, 6]} borderRadius="md" p={4}>
            <PaymentsSummaryTable amount={amount} payments={paymentsTotal} />
          </GridItem>
        </Grid>
      ) : (
        <Flex w="full" justify="center" py={5}>
          <Text>Please select a CUSTOMER to display a list of invoices.</Text>
        </Flex>
      )}
    </VStack>
  );
}

InvoicesPayments.propTypes = {
  invoices: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  paymentId: PropTypes.string,
};

export default InvoicesPayments;
