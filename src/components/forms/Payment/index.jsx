import { useEffect, useState } from 'react';
import { Box, useDisclosure, Flex, Button } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useToasts } from 'hooks';
import ControlledDialog from 'components/ui/ControlledDialog';

import InvoicesPaymentForm from 'components/forms/Payment/InvoicesPaymentForm';
import ReceivePaymentForm from 'components/forms/Payment/FormFields';

const schema = Yup.object().shape({
  customerId: Yup.string().required('*Required!'),
  paymentDate: Yup.date()
    .typeError('Value must be a valid date!')
    .required('*Required!'),
  amount: Yup.number()
    .typeError('Value must be a number!')
    .min(1, 'Amount cannot be less than one(1)!')
    .required('*Required!'),
  reference: Yup.string(),
  paymentModeId: Yup.string().required('*Required!'),
  bankCharges: Yup.number()
    .typeError('Value must be a number!')
    .min(0, 'Minimum value accepted is zero(0)!'),
  accountId: Yup.string().required('*Required!'),
  // taxDeducted: Yup.string().required("*Required!"),
  // tdsTaxAccount: Yup.string().when("taxDeducted", {
  //   is: "yes",
  //   then: Yup.string().required("*Required!"),
  // }),
});

//----------------------------------------------------------------

export default function PaymentForm(props) {
  console.log({ props });
  const {
    payment,
    paymentId,
    customers,
    accounts,
    handleFormSubmit,
    loading,
    getInvoices,
    getInvoicesToEdit,
    invoices,
    paymentModes,
  } = props;

  const { isOpen, onClose, onOpen } = useDisclosure();
  const toasts = useToasts();

  const formMethods = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      customer: payment?.customer || null,
      paymentDate: payment?.paymentDate || new Date(),
      amount: payment?.amount || 0,
      accountId: payment?.account?.accountId || 'undeposited_funds',
      paymentModeId: payment?.paymentMode?.value || 'cash',
      reference: payment?.reference || '',
      payments: payment?.payments,
      // || autoFill(invoices, amount),
    },
  });
  const { handleSubmit, watch, getValues } = formMethods;

  const [payments, setPayments] = useState(
    payment?.payments ? { ...payment.payments } : null
  );
  console.log({ invoices });

  // const form = watch();
  // console.log({ form });

  const watchedFields = watch(['customer', 'amount']);
  const watchedCustomer = watch('customer');
  console.log({ watchedFields, watchedCustomer });
  const customer = watchedFields[0];
  const customerId = customer?.id;

  const amountReceived = watchedFields[1];

  // useEffect(() => {
  //   if (customerId && paymentId) {
  //     // console.log({ customerId, paymentId });
  //     getInvoicesToEdit(customerId, paymentId);
  //   } else if (customerId) {
  //     // console.log({ customerId });
  //     getInvoices(customerId);
  //   }
  // }, [customerId, paymentId, getInvoices, getInvoicesToEdit]);

  useEffect(() => {
    if (invoices?.length > 0) {
      setPayments(current => {
        const currentPayments = { ...current };
        const paymentsArray = Object.keys(currentPayments);
        console.log({ current, paymentsArray });
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
          return current;
        }
      });
    }
  }, [invoices, setPayments]);

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
    const { amount, paymentsTotal } = formData;

    if (amount < paymentsTotal) {
      throw new Error(
        'Amounts assigned to paying Invoices should not be greater than the Customer payment!'
      );
    }
  }

  function checkUnderPayment(formData) {
    const { amount, paymentsTotal } = formData;

    if (amount > paymentsTotal) {
      onOpen();
    } else {
      onSubmit(formData);
    }
  }

  function validatePayments(formData) {
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

  console.log({ amountReceived });

  // console.log({ UnpaidInvoices, ReceivePaymentForm });

  const formIsDisabled = false;

  return (
    <>
      <FormProvider {...formMethods}>
        <Box
          as="form"
          role="form"
          onSubmit={handleSubmit(validatePayments)}
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
            loading={loading}
            accounts={accounts}
            paymentId={paymentId}
            paymentModes={paymentModes}
            formIsDisabled={formIsDisabled}
            customerId={customerId}
            amountReceived={amountReceived}
          />
          {/* <InvoicesPaymentForm
            paymentId={paymentId}
            updatePayments={setPayments}
            payments={payments}
            invoices={invoices || []}
            loading={loading}
            formIsDisabled={formIsDisabled}
            customerId={customerId}
            amountReceived={amountReceived}
          /> */}
        </Box>

        <Flex w="full" py={4} justify="flex-end">
          <Button
            size="lg"
            type="submit"
            isLoading={loading}
            colorScheme="cyan"
            onClick={() => console.log(getValues(['customer']))}
          >
            save
          </Button>
        </Flex>
      </FormProvider>

      <ControlledDialog
        isOpen={isOpen}
        onClose={onClose}
        title="OverPayment"
        message={`The Excess amount of ${
          0 // amount - paymentsTotal
        } will be added to the customers Account!`}
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
  loading: PropTypes.bool.isRequired,
  paymentId: PropTypes.string,
  payment: PropTypes.shape({
    reference: PropTypes.string,
    paymentModeId: PropTypes.string,
    accountId: PropTypes.string,
    bankCharges: PropTypes.number,
    amount: PropTypes.number,
    customerId: PropTypes.string,
    paymentId: PropTypes.string,
    paymentDate: PropTypes.instanceOf(Date),
    taxDeducted: PropTypes.string,
    tdsTaxAccount: PropTypes.string,
    notes: PropTypes.string,
  }),
};
