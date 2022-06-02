import { useContext, useCallback, useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

import useToasts from "../../../hooks/useToasts";
import { selectPaidInvoices, getPaymentsTotal } from "../../../utils/payments";

import StepperContext from "../../../contexts/StepperContext";
import ControlledDialog from "../../../components/ui/ControlledDialog";

import UnpaidInvoicesTable from "../../tables/Payments/UnpaidInvoicesTable";
import PaymentsSummaryTable from "../../tables/Payments/PaymentsSummaryTable";

function InvoicesPaymentForm(props) {
  // console.log({ props });
  const {
    invoices,
    updatePayments,
    handleFormSubmit,
    loading,
    formValues,
    payments,
  } = props;
  const { amount } = formValues;
  const { prevStep } = useContext(StepperContext);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [data, setData] = useState(null);
  const toasts = useToasts();

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

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: payments || autoFill(invoices, amount),
  });
  const { handleSubmit, watch, reset } = formMethods;

  useEffect(() => {
    const defaults = payments || autoFill(invoices, amount);
    reset(defaults);
  }, [payments, autoFill, amount, invoices, reset]);

  const newPayments = watch();
  const paymentsTotal = getPaymentsTotal(newPayments);
  /**
   * methods
   */
  function goBack() {
    updatePayments(newPayments);
    prevStep();
  }

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

  function checkOverPayment(formData) {
    if (amount < paymentsTotal) {
      toasts.error(
        "Amounts assigned to paying Invoices should not be greater than the Customer payment!"
      );
    } else if (amount > paymentsTotal) {
      setData(formData);
      onOpen();
    } else {
      submitData(formData);
    }
  }

  function submitData(paymentsData) {
    //remove zero(0) payments
    Object.keys(paymentsData).forEach((key) => {
      if (paymentsData[key] <= 0) {
        delete paymentsData[key];
      }
    });
    const paidInvoices = selectPaidInvoices(paymentsData, invoices);

    handleFormSubmit({ payments: paymentsData, paidInvoices });
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
        <Box as="form" role="form" onSubmit={handleSubmit(checkOverPayment)}>
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
      <ControlledDialog
        isOpen={isOpen}
        onClose={onClose}
        title="OverPayment"
        message={`The Excess amount of ${
          amount - paymentsTotal
        } will be added to the customers Account!`}
        onConfirm={() => {
          submitData(data);
          onClose();
        }}
      />
    </VStack>
  );
}

InvoicesPaymentForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  updatePayments: PropTypes.func.isRequired,
  invoices: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  formValues: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    payments: PropTypes.object,
  }),
};

export default InvoicesPaymentForm;
