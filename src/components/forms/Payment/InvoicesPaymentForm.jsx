import { useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button, Flex, Grid, GridItem, VStack } from '@chakra-ui/react';
import PropTypes from 'prop-types';

import { getPaymentsTotal } from '../../../utils/payments';
import { getInvoiceBalance } from '../../../utils/invoices';

import UnpaidInvoicesTable from '../../tables/Payments/UnpaidInvoicesTable';
import PaymentsSummaryTable from '../../tables/Payments/PaymentsSummaryTable';

function InvoicesPaymentForm(props) {
  // console.log({ props });
  const { invoices, loading, payments, paymentId } = props;

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

  const { watch, reset } = useFormContext();
  const amount = watch('amount');

  useEffect(() => {
    const defaults = payments || autoFill(invoices, amount);
    reset(defaults);
  }, [payments, autoFill, amount, invoices, reset]);

  const newPayments = watch();
  const paymentsTotal = getPaymentsTotal(newPayments);
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

      reset(values);
    }
  }

  function autoPay() {
    const values = autoFill(invoices, amount);
    reset(values);
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
          isDisabled={loading}
        >
          clear
        </Button>
        <Button
          onClick={autoPay}
          colorScheme="cyan"
          variant="outline"
          size="xs"
          isDisabled={loading}
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

InvoicesPaymentForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  updatePayments: PropTypes.func.isRequired,
  invoices: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  paymentId: PropTypes.string,
  formValues: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    payments: PropTypes.object,
  }),
};

export default InvoicesPaymentForm;
