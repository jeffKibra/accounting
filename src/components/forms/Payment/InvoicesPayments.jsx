import { useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Button,
  Flex,
  Grid,
  GridItem,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Text,
  Heading,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

import { useCustomerInvoices } from 'hooks';

import { getPaymentsTotal } from 'utils/payments';
import { getInvoiceBalance } from 'utils/invoices';

import Empty from 'components/ui/Empty';

import UnpaidInvoicesTable from './UnpaidInvoicesTable';
import PaymentsSummaryTable from '../../tables/Payments/PaymentsSummaryTable';

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
  const paymentsTotal = usePaymentsTotal();

  const { getInvoices, getInvoicesToEdit, invoices, loading, error } =
    useCustomerInvoices();

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
          paymentsArray.forEach(invoiceId => {
            //check if this invoice is in the list of invoices
            const found = invoices.find(
              invoice => invoice.invoiceId === invoiceId
            );

            if (!found) {
              //delete the invoice payment if it has not been found
              delete currentPayments[invoiceId];
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

  useEffect(() => {
    if (customerId) {
      if (paymentId) {
        // console.log('fetching invoices to edit', { customerId, paymentId });
        getInvoicesToEdit(customerId, paymentId);
      } else {
        // console.log('fetching customer unpaid invoices', { customerId });
        getInvoices(customerId);
      }
    }
  }, [customerId, paymentId, getInvoices, getInvoicesToEdit]);

  const amount = watch('amount');

  // const payments = watch('payments');

  // const paymentsTotal = getPaymentsTotal(payments);

  // useEffect(() => {
  //   console.log('payments have changed', payments);
  // }, [payments]);
  // console.log({ payments });
  // console.log({ payments, paymentsTotal });

  const autoFill = useCallback(
    (invoices, amount) => {
      if (invoices?.length > 0) {
        let balance = amount;
        const balances = {};

        invoices.forEach(invoice => {
          const { invoiceId } = invoice;
          let autoFill = 0;
          const invoiceBalance = getInvoiceBalance(invoice, paymentId);
          // console.log({ invoiceBalance });

          if (invoiceBalance <= balance) {
            autoFill = invoiceBalance;
            balance = balance - invoiceBalance;
          } else {
            autoFill = balance;
            balance = balance - balance;
          }
          balances[invoiceId] = autoFill;
        });

        return balances;
      }
      return {};
    },
    [paymentId]
  );

  /**
   * methods
   */

  function clear() {
    if (invoices?.length > 0) {
      const values = {};
      invoices.forEach(invoice => {
        const { invoiceId } = invoice;
        values[invoiceId] = 0;
      });

      updatePayments(values);
    }
  }

  function autoPay() {
    const values = autoFill(invoices, amount);
    updatePayments(values);
    // reset(values);
  }

  return (
    <VStack mt={5} pt={4} w="full">
      <Flex w="full" justify="space-between">
        <Heading as="h3" size="md">
          Invoices
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
        loading ? (
          <Flex
            w="full"
            direction="column"
            justify="center"
            align="center"
            py={5}
          >
            <Spinner size="lg" />
            <Text mt={3}>Loading Invoices...</Text>
          </Flex>
        ) : error ? (
          <Alert status="error" flexDirection="column">
            <AlertIcon />
            <AlertTitle>Error fetching Customer Invoices!</AlertTitle>
            <AlertDescription>
              {error?.message || 'Unknown error!'}
            </AlertDescription>
          </Alert>
        ) : Array.isArray(invoices) && invoices?.length > 0 ? (
          <Grid w="full" gap={2} templateColumns="repeat(12, 1fr)">
            <GridItem colSpan={12}>
              <UnpaidInvoicesTable
                invoices={invoices}
                amount={amount}
                paymentId={paymentId || ''}
                loading={loading}
                formIsDisabled={formIsDisabled}
                // taxDeducted={taxDeducted}
              />
            </GridItem>
            <GridItem colSpan={[1, 6]} />
            <GridItem colSpan={[11, 6]} borderRadius="md" p={4}>
              <PaymentsSummaryTable amount={amount} payments={paymentsTotal} />
            </GridItem>
          </Grid>
        ) : (
          <Empty message="No unpaid invoices found for the customer!" />
        )
      ) : (
        <Flex w="full" justify="center" py={5}>
          <Text>Please select a CUSTOMER to display a list of Invoices.</Text>
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
