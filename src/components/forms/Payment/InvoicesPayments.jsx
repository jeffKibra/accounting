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

function InvoicesPayments(props) {
  // console.log({ props });
  const { paymentId, formIsDisabled, customerId } = props;

  const { watch, setValue } = useFormContext();

  const { getInvoices, getInvoicesToEdit, invoices, loading, error } =
    useCustomerInvoices();

  useEffect(() => {
    console.log('invoices changed', invoices);

    setValue('payments', {});
  }, [invoices, setValue]);

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

  const payments = watch('payments');
  // console.log({ payments });
  const paymentsTotal = getPaymentsTotal(payments);
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

  const updatePayments = useCallback(
    values => {
      setValue('payments', values);
    },
    [setValue]
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
