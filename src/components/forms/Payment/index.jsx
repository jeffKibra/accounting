import { useEffect, useState } from 'react';
import { Box, useDisclosure, Flex, Button } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { getPaymentsTotal } from 'utils/payments';

import { useToasts, useCustomerInvoices } from 'hooks';
import ControlledDialog from 'components/ui/ControlledDialog';

import InvoicesPayments from 'components/forms/Payment/InvoicesPayments';
import ReceivePaymentForm from 'components/forms/Payment/FormFields';

const schema = Yup.object().shape({
  customer: Yup.object().required('*Required!').nullable(),
  paymentDate: Yup.date()
    .typeError('Value must be a valid date!')
    .required('*Required!'),
  amount: Yup.number()
    .typeError('Value must be a number!')
    .min(1, 'Amount should be greater than zero(0)!')
    .required('*Required!'),
  reference: Yup.string(),
  paymentMode: Yup.object().required('*Required!').nullable(),
  bankCharges: Yup.number()
    .typeError('Value must be a number!')
    .min(0, 'Amount should be a positive number(>=0)!'),
  account: Yup.object().required('*Required!').nullable(),
  // taxDeducted: Yup.string().required("*Required!"),
  // tdsTaxAccount: Yup.string().when("taxDeducted", {
  //   is: "yes",
  //   then: Yup.string().required("*Required!"),
  // }),
});

//----------------------------------------------------------------

export default function PaymentForm(props) {
  // console.log({ props });
  const {
    payment,
    paymentId,
    customers,
    accounts,
    handleFormSubmit,
    updating,
    paymentModes,
  } = props;

  const [balance, setBalance] = useState(0);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const toasts = useToasts();
  const {
    getInvoices,
    getInvoicesToEdit,
    invoices,
    loading: loadingInvoices,
  } = useCustomerInvoices();
  // console.log({ invoices, loadingInvoices });

  const formMethods = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      customer: payment?.customer || null,
      paymentDate: payment?.paymentDate || new Date(),
      amount: payment?.amount || 0,
      account: payment?.account || null,
      paymentMode: payment?.paymentMode || null,
      reference: payment?.reference || '',
      payments: payment?.payments || {},
      // || autoFill(invoices, amount),
    },
  });
  const { handleSubmit, watch, getValues } = formMethods;

  // const [payments, setPayments] = useState(
  //   payment?.payments ? { ...payment.payments } : null
  // );

  // const form = watch();
  // console.log({ form });

  const watchedFields = watch(['customer', 'amount']);
  // console.log({ watchedFields });
  const customer = watchedFields[0];
  const customerId = customer?.id || '';
  // console.log({ customerId });

  const amountReceived = watchedFields[1];

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

  // useEffect(() => {
  //   if (invoices?.length > 0) {
  //     setPayments(current => {
  //       const currentPayments = { ...current };
  //       const paymentsArray = Object.keys(currentPayments);
  //       console.log({ current, paymentsArray });
  //       if (paymentsArray?.length > 0) {
  //         paymentsArray.forEach(invoiceId => {
  //           //check if this invoice is in the list of invoices
  //           const found = invoices.find(
  //             invoice => invoice.invoiceId === invoiceId
  //           );

  //           if (!found) {
  //             //delete the invoice payment if it has not been found
  //             delete currentPayments[invoiceId];
  //           }
  //         });

  //         return { ...currentPayments };
  //       } else {
  //         return current;
  //       }
  //     });
  //   }
  // }, [invoices, setPayments]);

  function onSubmit(data) {
    const { payments } = data;
    //update form values so that incase saving fails, data is not lost
    // console.log({ data });

    Object.keys(payments).forEach(key => {
      if (payments[key] <= 0) {
        delete payments[key];
      }
    });

    // console.log({ allData });
    handleFormSubmit({
      ...data,
      payments,
    });
  }

  function checkOverPayment(formData) {
    const { amount, payments } = formData;
    const paymentsTotal = getPaymentsTotal(payments);

    if (amount < paymentsTotal) {
      throw new Error(
        'Amounts assigned to paying Invoices should not be greater than the Customer payment!'
      );
    }
  }

  function checkUnderPayment(formData) {
    const { amount, payments } = formData;
    const paymentsTotal = getPaymentsTotal(payments);

    if (amount > paymentsTotal) {
      setBalance(amount - paymentsTotal);
      onOpen();
    } else {
      onSubmit(formData);
    }
  }

  function validatePayments(formData) {
    console.log('validating payments', formData);
    try {
      checkOverPayment(formData);
      checkUnderPayment(formData);
    } catch (error) {
      console.error(error);
      toasts.error(error?.message);
    }
  }

  function confirmUnderPayment() {
    try {
      const formData = getValues();

      checkOverPayment(formData);

      onSubmit(formData);
    } catch (error) {
      console.error(error);
      toasts.error(error?.message);
    }
  }

  // console.log({ UnpaidInvoices, ReceivePaymentForm });

  const formIsDisabled = updating || false;

  return (
    <>
      <FormProvider {...formMethods}>
        <Box
          as="form"
          role="form"
          onSubmit={handleSubmit(validatePayments)}
          w="full"
        >
          <Box
            w="full"
            mt={2}
            p={4}
            pb={6}
            bg="white"
            borderRadius="lg"
            shadow="lg"
            border="1px solid"
            borderColor="gray.200"
          >
            <ReceivePaymentForm
              customers={customers}
              loading={updating}
              accounts={accounts}
              paymentId={paymentId}
              paymentModes={paymentModes}
              formIsDisabled={formIsDisabled}
              customerId={customerId}
              amountReceived={amountReceived}
            />
            <InvoicesPayments
              paymentId={paymentId}
              // updatePayments={setPayments}
              // payments={payments}
              invoices={invoices || []}
              loading={updating}
              formIsDisabled={formIsDisabled}
              customerId={customerId}
              amountReceived={amountReceived}
              loadingInvoices={loadingInvoices}
            />
          </Box>
          <Flex w="full" py={4} justify="flex-end">
            <Button
              size="lg"
              type="submit"
              isLoading={updating}
              colorScheme="cyan"
            >
              save
            </Button>
          </Flex>
          '
        </Box>
      </FormProvider>

      <ControlledDialog
        isOpen={isOpen}
        onClose={onClose}
        title="OverPayment"
        message={`The Excess amount of ${balance} will be added to the customers Account!`}
        onConfirm={() => {
          onClose();
          confirmUnderPayment();
        }}
      />
    </>
  );
}

PaymentForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  paymentId: PropTypes.string,
  payment: PropTypes.shape({
    reference: PropTypes.string,
    paymentMode: PropTypes.object,
    account: PropTypes.object,
    bankCharges: PropTypes.number,
    amount: PropTypes.number,
    customer: PropTypes.object,
    paymentId: PropTypes.string,
    paymentDate: PropTypes.instanceOf(Date),
    taxDeducted: PropTypes.string,
    tdsTaxAccount: PropTypes.string,
    notes: PropTypes.string,
  }),
};
