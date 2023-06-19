import { useState, useMemo } from 'react';
import { Box, useDisclosure, Flex, Button } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { getPaymentsTotal } from 'utils/payments';

import { useToasts } from 'hooks';
import ControlledDialog from 'components/ui/ControlledDialog';

import BookingsPayments from 'components/forms/Payment/BookingsPayments';
import FormFields from 'components/forms/Payment/FormFields';
//
const DEFAULT_ACCOUNT_ID = 'undeposited_funds';
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
  // console.log('paymnt form updating', { props });
  const {
    payment,
    paymentId,
    customers,
    accounts,
    handleFormSubmit,
    updating,
    paymentModes,
  } = props;
  // console.log({ accounts });

  const [balance, setBalance] = useState(0);

  const defaultPayments = useMemo(() => {
    const payments = payment?.payments || {};
    // console.log('default payments have changed index', payments);
    return payments;
  }, [payment?.payments]);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const toasts = useToasts();

  // console.log({ invoices, loadingInvoices });

  const paymentAccount = useMemo(() => {
    const accountId = payment?.account?.accountId || DEFAULT_ACCOUNT_ID;
    let account = null;

    if (Array.isArray(accounts)) {
      account = accounts.find(account => account.accountId === accountId);
      if (!account) {
        const errorMsg = 'Payment Account not found!';
        console.error(errorMsg);
        toasts.error(errorMsg);
      }
    }

    console.log(account);

    return account;
  }, [accounts, payment?.account, toasts]);

  // console.log({ paymentAccount, accounts });

  const formMethods = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      customer: payment?.customer || null,
      paymentDate: payment?.paymentDate || new Date(),
      amount: payment?.amount || 0,
      account: paymentAccount,
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

  const watchedFields = watch(['customer', 'amount', 'account']);
  console.log({ watchedFields });
  const customer = watchedFields[0];
  const customerId = customer?.id || '';

  const amountReceived = watchedFields[1];

  function onSubmit(data) {
    const { payments } = data;
    //update form values so that incase saving fails, data is not lost
    console.log({ data });

    Object.keys(payments).forEach(key => {
      const amount = Number(payments[key]);
      if (isNaN(amount) || amount <= 0) {
        delete payments[key];
      }
    });

    const formData = {
      ...data,
      payments,
    };

    // console.log({ formData });

    // console.log({ allData });
    handleFormSubmit(formData);
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
            <BookingsPayments
              paymentId={paymentId}
              formIsDisabled={formIsDisabled}
              customerId={customerId}
              amountReceived={amountReceived}
              defaultPayments={defaultPayments}
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
