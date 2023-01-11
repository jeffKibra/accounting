import { useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button, Flex, Grid, GridItem, VStack } from '@chakra-ui/react';
import PropTypes from 'prop-types';

import { getPaymentsTotal } from 'utils/payments';
import { getInvoiceBalance } from 'utils/invoices';

import UnpaidInvoicesTable from './UnpaidInvoicesTable';
import PaymentsSummaryTable from '../../tables/Payments/PaymentsSummaryTable';

function InvoicesPayments(props) {
  // console.log({ props });
  const { invoices, loading, paymentId, defaultPayments, formIsDisabled } =
    props;

  const { watch, setValue } = useFormContext();
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

  useEffect(() => {
    const defaults = defaultPayments || autoFill(invoices, amount);
    updatePayments(defaults);
  }, [defaultPayments, autoFill, amount, invoices, updatePayments]);

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
    <VStack mt={5} w="full">
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
    </VStack>
  );
}

InvoicesPayments.propTypes = {
  invoices: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  paymentId: PropTypes.string,
};

export default InvoicesPayments;
