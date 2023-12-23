import { useState, useMemo, useCallback } from 'react';
import { Box, Flex, Button, useDisclosure } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { getPaymentsTotal } from 'utils/payments';
//
import { ListInvoicesContextProvider } from 'contexts/ListInvoicesContext';
//

import { useToasts } from 'hooks';
import ControlledDialog from 'components/ui/ControlledDialog';

import BookingsPayments from 'components/forms/PaymentReceived/InvoicesPayments';
import FormFields from 'components/forms/PaymentReceived/FormFields';
//
// const DEFAULT_ACCOUNT_ID = 'undeposited_funds';
//

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
  // bankCharges: Yup.number()
  //   .typeError('Value must be a number!')
  //   .min(0, 'Amount should be a positive number(>=0)!'),
  // account: Yup.object().required('*Required!').nullable(),
  // taxDeducted: Yup.string().required("*Required!"),
  // tdsTaxAccount: Yup.string().when("taxDeducted", {
  //   is: "yes",
  //   then: Yup.string().required("*Required!"),
  // }),
});

//----------------------------------------------------------------

export default function PaymentReceivedForm(props) {
  // console.log('paymnt form updating', { props });
  const {
    payment,
    paymentId,
    customers,
    accounts,
    onSubmit,
    updating,
    paymentModes,
  } = props;
  // console.log({ accounts });

  const [balance, setBalance] = useState(0);

  const defaultPayments = useMemo(() => {
    const paidInvoices = payment?.paidInvoices || [];

    let paidInvoicesMap = {};

    if (Array.isArray(paidInvoices)) {
      paidInvoices.forEach(invoicePayment => {
        const { invoiceId, amount } = invoicePayment;

        paidInvoicesMap[invoiceId] = amount;
      });
    }

    // console.log('default payments have changed index', payments);
    return paidInvoicesMap;
  }, [payment?.paidInvoices]);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const { error: toastError } = useToasts();

  // console.log({ invoices, loadingInvoices });

  // const paymentAccount = useMemo(() => {
  //   const accountId = payment?.account?.accountId || DEFAULT_ACCOUNT_ID;
  //   let account = null;

  //   if (Array.isArray(accounts)) {
  //     account = accounts.find(account => account.accountId === accountId);
  //     if (!account) {
  //       const errorMsg = 'Payment Account not found!';
  //       console.error(errorMsg);
  //       toastError(errorMsg);
  //     }
  //   }

  //   console.log(account);

  //   return account;
  // }, [accounts, payment?.account, toasts]);

  // console.log({ paymentAccount, accounts });

  const formMethods = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      customer: payment?.customer || null,
      paymentDate: payment?.paymentDate || new Date(),
      amount: payment?.amount || 0,
      // account: paymentAccount,
      paymentMode: payment?.paymentMode || null,
      reference: payment?.reference || '',
      payments: defaultPayments || {},
      // || autoFill(invoices, amount),
    },
  });
  const {
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = formMethods;

  console.log({ errors });

  // const [payments, setPayments] = useState(
  //   payment?.payments ? { ...payment.payments } : null
  // );

  // const form = watch();
  // console.log({ form });

  const watchedFields = watch(['customer', 'amount']);
  console.log({ watchedFields });
  const customer = watchedFields[0];
  const customerId = customer?._id || '';
  console.log({ customerId });

  const amountReceived = watchedFields[1];

  const handleFormSubmit = useCallback(
    data => {
      const {
        payments,
        paymentMode: { name: paymentModeName, _id: paymentModeId },
        ...formData
      } = data;

      //update form values so that incase saving fails, data is not lost
      console.log({ data });

      const paymentMode = {
        name: paymentModeName,
        _id: paymentModeId,
      };

      const paidInvoices = [];

      Object.keys(payments).forEach(invoiceId => {
        const invoicePayment = Number(payments[invoiceId]);

        if (isNaN(invoicePayment) || invoicePayment <= 0) {
          // delete payments[invoiceId];

          return;
        }

        paidInvoices.push({ invoiceId, amount: invoicePayment });
      });

      const paymentData = {
        ...formData,
        paymentMode,
        paidInvoices,
      };

      // console.log({ paymentData });

      // console.log({ allData });
      return onSubmit(paymentData);
    },
    [onSubmit]
  );

  const checkOverPayment = useCallback(formData => {
    const { amount, payments } = formData;
    const paymentsTotal = getPaymentsTotal(payments);

    console.log('checking overpayment', {
      amount,
      payments,
      paymentsTotal,
      formData,
    });

    if (amount < paymentsTotal) {
      throw new Error(
        'Amounts assigned to paying Invoices should not be greater than the Customer payment!'
      );
    }
  }, []);

  const checkUnderPayment = useCallback(
    formData => {
      const { amount, payments } = formData;
      const paymentsTotal = getPaymentsTotal(payments);

      if (amount > paymentsTotal) {
        setBalance(amount - paymentsTotal);
        onOpen();
      } else {
        return handleFormSubmit(formData);
      }
    },
    [handleFormSubmit, setBalance, onOpen]
  );

  const validatePayments = useCallback(
    formData => {
      console.log('validating payments', formData);
      try {
        checkOverPayment(formData);
        return checkUnderPayment(formData);
      } catch (error) {
        console.error(error);
        toastError(error?.message);
      }
    },
    [checkOverPayment, checkUnderPayment, toastError]
  );

  const confirmUnderPayment = useCallback(() => {
    try {
      const formData = getValues();

      checkOverPayment(formData);

      return handleFormSubmit(formData);
    } catch (error) {
      console.error(error);
      toastError(error?.message);
    }
  }, [getValues, checkOverPayment, handleFormSubmit, toastError]);

  // console.log({ UnpaidInvoices, FormFields });

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
            <FormFields
              customers={customers}
              loading={updating}
              accounts={accounts}
              paymentId={paymentId}
              paymentModes={paymentModes}
              formIsDisabled={formIsDisabled}
              customerId={customerId}
              amountReceived={amountReceived}
            />

            <ListInvoicesContextProvider customerId={customerId}>
              <BookingsPayments
                paymentId={paymentId}
                formIsDisabled={formIsDisabled}
                customerId={customerId}
                amountReceived={amountReceived}
                defaultPayments={defaultPayments}
              />
            </ListInvoicesContextProvider>
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

PaymentReceivedForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
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
