import { useState, useMemo, useCallback } from 'react';
import { Box, Flex, Button, useDisclosure } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { getAllocationsTotal } from 'utils/payments';
//
import { ListInvoicesContextProvider } from 'contexts/ListInvoicesContext';
//

import { useToasts } from 'hooks';
import ControlledDialog from 'components/ui/ControlledDialog';

import PaymentAllocations from 'components/forms/PaymentReceived/PaymentAllocations';
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
    onSubmit,
    updating,
    paymentModes,
    // accounts,
  } = props;
  // console.log({ accounts });

  const [balance, setBalance] = useState(0);

  const defaultAllocations = useMemo(() => {
    const currentAllocations = payment?.allocations || [];

    let allocationsMap = {};

    if (Array.isArray(currentAllocations)) {
      currentAllocations.forEach(allocation => {
        const { invoiceId, amount } = allocation;

        allocationsMap[invoiceId] = amount;
      });
    }

    // console.log('default payments have changed index', payments);
    return allocationsMap;
  }, [payment?.allocations]);

  // console.log({ defaultAllocations });

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
  const paymentDate = payment?.paymentDate;

  // console.log({ paymentDate });

  const formMethods = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      customer: payment?.customer || null,
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      amount: payment?.amount || 0,
      // account: paymentAccount,
      paymentMode: payment?.paymentMode || null,
      reference: payment?.reference || '',
      allocations: defaultAllocations || {},
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
  // console.log({ watchedFields });
  const customer = watchedFields[0];
  const customerId = customer?._id || '';
  // console.log({ customerId });

  const amountReceived = watchedFields[1];

  const handleFormSubmit = useCallback(
    data => {
      const {
        allocations: allocationsMap,
        paymentMode: { name: paymentModeName, _id: paymentModeId },
        ...formData
      } = data;

      //update form values so that incase saving fails, data is not lost
      // console.log({ data });

      const paymentMode = {
        name: paymentModeName,
        _id: paymentModeId,
      };

      const allocations = [];

      Object.keys(allocationsMap).forEach(invoiceId => {
        const invoiceAllocation = Number(allocationsMap[invoiceId]);

        if (isNaN(invoiceAllocation) || invoiceAllocation <= 0) {
          // delete allocations[invoiceId];

          return;
        }

        allocations.push({ invoiceId, amount: invoiceAllocation });
      });

      const paymentData = {
        ...formData,
        paymentMode,
        allocations,
      };

      console.log({ paymentData });

      // console.log({ allData });
      return onSubmit(paymentData);
    },
    [onSubmit]
  );

  const checkOverAllocation = useCallback(formData => {
    const { amount, allocations } = formData;
    const allocationsTotal = getAllocationsTotal(allocations);

    // console.log('checking overpayment', {
    //   amount,
    //   allocations,
    //   allocationsTotal,
    //   formData,
    // });

    if (amount < allocationsTotal) {
      throw new Error(
        'Amounts assigned to paying Invoices should not be greater than the Customer payment!'
      );
    }
  }, []);

  const checkUnderAllocation = useCallback(
    formData => {
      const { amount, allocations } = formData;
      const allocationsTotal = getAllocationsTotal(allocations);

      // console.log({ amount, allocations, allocationsTotal });

      if (amount > allocationsTotal) {
        setBalance(amount - allocationsTotal);
        onOpen();
      } else {
        return handleFormSubmit(formData);
      }
    },
    [handleFormSubmit, setBalance, onOpen]
  );

  const validateAllocations = useCallback(
    formData => {
      // console.log('validating allocations', formData);
      try {
        checkOverAllocation(formData);
        return checkUnderAllocation(formData);
      } catch (error) {
        console.error(error);
        toastError(error?.message);
      }
    },
    [checkOverAllocation, checkUnderAllocation, toastError]
  );

  const confirmUnderAllocation = useCallback(() => {
    try {
      const formData = getValues();

      checkOverAllocation(formData);

      return handleFormSubmit(formData);
    } catch (error) {
      console.error(error);
      toastError(error?.message);
    }
  }, [getValues, checkOverAllocation, handleFormSubmit, toastError]);

  // console.log({ UnpaidInvoices, FormFields });

  const formIsDisabled = updating || false;

  return (
    <>
      <FormProvider {...formMethods}>
        <Box
          as="form"
          role="form"
          onSubmit={handleSubmit(validateAllocations)}
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
              // customers={customers}
              // loading={updating}
              // accounts={accounts}
              // paymentId={paymentId}
              paymentModes={paymentModes}
              formIsDisabled={formIsDisabled}
              customerId={customerId}
              // amountReceived={amountReceived}
            />

            <ListInvoicesContextProvider
              paymentId={paymentId}
              customerId={customerId}
              defaultValues={{ hitsPerPage: 50 }}
            >
              <PaymentAllocations
                paymentId={paymentId}
                formIsDisabled={formIsDisabled}
                customerId={customerId}
                amountReceived={amountReceived}
                defaultAllocations={defaultAllocations}
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
          confirmUnderAllocation();
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
    paymentDate: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.string,
    ]),
    taxDeducted: PropTypes.string,
    tdsTaxAccount: PropTypes.string,
    notes: PropTypes.string,
  }),
};
