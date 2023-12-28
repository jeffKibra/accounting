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
import BigNumber from 'bignumber.js';

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

  const allocations = watch('allocations');

  const amount = watch('amount');
  //
  const allocationsTotal = getPaymentsTotal(allocations);

  console.log('usePaymentsTotal', { allocations, allocationsTotal, amount });

  return allocationsTotal;
}
//----------------------------------------------------------------
function areAllocationsEqual(newAllocations = {}, prevAllocations = {}) {
  const payments1 = { ...newAllocations };
  const payments2 = { ...prevAllocations };

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

function PaymentAllocations(props) {
  // console.log({ props });
  const { paymentId, formIsDisabled, customerId, defaultAllocations } = props;

  const { watch, setValue, getValues } = useFormContext();
  //
  const { list: invoices, loading } = useContext(ListInvoicesContext);
  // console.log({ invoices });
  //
  const allocationsTotal = usePaymentsTotal();
  console.log('payment allocations', { allocationsTotal });

  const updateAllocations = useCallback(
    values => {
      setValue('allocations', values);
    },
    [setValue]
  );

  useEffect(() => {
    function getAllocationsResetValues() {
      const allocationsFromForm = getValues('allocations') || {};
      // console.log({ allocationsFromForm });

      const currentAllocations = {
        ...defaultAllocations,
        ...allocationsFromForm,
      };

      // console.log({ currentAllocations, invoices });

      const allocatedIdsArray = Object.keys(currentAllocations);
      // console.log({ allocatedIdsArray });

      if (Array.isArray(invoices) && invoices?.length > 0) {
        if (allocatedIdsArray?.length > 0) {
          allocatedIdsArray.forEach(allocatedBookingId => {
            //check if this booking is in the list of invoices
            const found = invoices.find(
              booking => booking._id === allocatedBookingId
            );

            // console.log({ found, allocatedBookingId });

            if (!found) {
              //delete the booking payment if it has not been found
              delete currentAllocations[allocatedBookingId];
            }
          });

          return { ...currentAllocations };
        } else {
          return {};
        }
      } else {
        return { ...currentAllocations };
      }
    }

    // console.log('generating payments rest values');
    const newAllocations = getAllocationsResetValues();
    // console.log({ newAllocations });
    const prevAllocations = getValues('allocations');
    const allocationsAreEqual = areAllocationsEqual(
      newAllocations,
      prevAllocations
    );
    // console.log({ newAllocations, prevAllocations, allocationsAreEqual });

    if (!allocationsAreEqual) {
      updateAllocations(newAllocations);
    }
  }, [invoices, defaultAllocations, updateAllocations, getValues]);

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
          const { _id: invoiceId } = invoice;
          const invoiceBalance = invoice?.balance || 0;
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

        // console.log({ balances, excess, amount });

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
        const { _id: invoiceId } = invoice;

        values[invoiceId] = 0;
      });

      updateAllocations(values);
    }
  }

  function autoPay() {
    const values = generateAutoFillValues(invoices, amount);

    updateAllocations(values);
    // reset(values);
  }

  return (
    <VStack mt={5} pt={4} w="full">
      <Flex w="full" justify="space-between">
        <Heading as="h3" size="md">
          Bookings
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
              defaultAllocations={defaultAllocations || {}}
              isPayment
              columnsToExclude={['actions', 'imprest', 'allocatedAmount']}
              // taxDeducted={taxDeducted}
            />
          </GridItem>

          <GridItem colSpan={[1, 6]} />
          <GridItem colSpan={[11, 6]} borderRadius="md" p={4}>
            <PaymentsSummaryTable
              amount={amount}
              allocationsTotal={allocationsTotal}
            />
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

PaymentAllocations.propTypes = {
  formIsDisabled: PropTypes.bool,
  paymentId: PropTypes.string,
  customerId: PropTypes.string,
  defaultAllocations: PropTypes.object,
};

export default PaymentAllocations;
