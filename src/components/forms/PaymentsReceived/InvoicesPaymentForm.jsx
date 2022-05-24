import { useContext, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Box, Button, Flex, Grid, GridItem, VStack } from "@chakra-ui/react";
import PropTypes from "prop-types";

import StepperContext from "../../../contexts/StepperContext";

import UnpaidInvoicesTable from "../../tables/PaymentsReceived/UnpaidInvoicesTable";
import PaymentsSummaryTable from "../../tables/PaymentsReceived/PaymentsSummaryTable";

function InvoicesPaymentForm(props) {
  // console.log({ props });
  const { invoices, updateFormValues, handleFormSubmit, loading, formValues } =
    props;
  const { amount } = formValues;
  const { prevStep } = useContext(StepperContext);

  const autoFill = useCallback((invoices, amount) => {
    if (invoices?.length > 0) {
      let balance = amount;
      const balances = {};

      invoices.forEach((invoice) => {
        const {
          summary: { balance: invoiceBalance },
          invoiceId,
        } = invoice;
        let autoFill = 0;

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
  }, []);

  const defaultPayments = autoFill(invoices, amount);

  // console.log({ defaultPayments });

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: formValues.payments || defaultPayments,
  });
  const { handleSubmit, watch, reset } = formMethods;

  const payments = watch();
  function goBack() {
    updateFormValues(payments);
    prevStep();
  }

  const paymentsTotal = Object.keys(payments).reduce((sum, key) => {
    return sum + +payments[key];
  }, 0);

  function clear() {
    if (invoices?.length > 0) {
      const values = {};
      invoices.forEach((invoice) => {
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
    <VStack w="full">
      <Flex justify="flex-end" w="full">
        <Button
          onClick={clear}
          colorScheme="cyan"
          variant="outline"
          size="xs"
          mr={2}
          isLoading={loading}
        >
          clear
        </Button>
        <Button
          onClick={autoPay}
          colorScheme="cyan"
          variant="outline"
          size="xs"
          isLoading={loading}
        >
          auto pay
        </Button>
      </Flex>

      <FormProvider {...formMethods}>
        <Box as="form" role="form" onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid w="full" gap={2} templateColumns="repeat(12, 1fr)">
            <GridItem colSpan={12}>
              <UnpaidInvoicesTable
                invoices={invoices}
                amount={amount}
                paymentId=""
                loading={loading}
                // taxDeducted={taxDeducted}
              />
            </GridItem>
            <GridItem colSpan={[1, 6]} />
            <GridItem
              colSpan={[11, 6]}
              bg="white"
              borderRadius="md"
              shadow="md"
              p={4}
            >
              <PaymentsSummaryTable amount={amount} payments={paymentsTotal} />
            </GridItem>
          </Grid>

          <Flex w="full" py={4} justify="space-evenly">
            <Button
              isLoading={loading}
              onClick={goBack}
              colorScheme="cyan"
              variant="outline"
              type="reset"
            >
              prev
            </Button>

            <Button type="submit" isLoading={loading} colorScheme="cyan">
              save
            </Button>
          </Flex>
        </Box>
      </FormProvider>
    </VStack>
  );
}

InvoicesPaymentForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  updateFormValues: PropTypes.func.isRequired,
  invoices: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  formValues: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    payments: PropTypes.object,
  }),
};

export default InvoicesPaymentForm;
