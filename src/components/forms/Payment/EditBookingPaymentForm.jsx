import {
  Box,
  Flex,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Heading,
} from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import PropTypes from 'prop-types';

import NumInput from '../../ui/NumInput';

function EditBookingPaymentForm(props) {
  const {
    booking,
    summary,
    handleFormSubmit,
    onClose,
    taxDeducted,
    paymentId,
  } = props;
  const {
    payments,
    summary: { balance: bookingBalance },
  } = booking;

  let payment = payments[paymentId];
  const prevPayment = payment?.amount || 0;

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: payment || {},
  });
  const {
    handleSubmit,
    formState: { errors },
    watch,
  } = formMethods;

  const { bookingId } = booking;

  function onSubmit(data) {
    handleFormSubmit({
      ...data,
      bookingId,
    });
    onClose && onClose();
  }

  const { excess } = summary;
  const newExcess = excess + prevPayment;

  let balance = bookingBalance + prevPayment;
  const max = Math.min(balance, newExcess);
  // console.log({ newExcess, balance, max });

  const amount = watch('amount') || 0;

  return (
    <VStack w="full">
      <VStack>
        <Heading size="xs">Payment Balance: {newExcess - amount}</Heading>
        <Heading size="xs">booking Balance: {balance - amount}</Heading>
      </VStack>
      <FormProvider {...formMethods}>
        <Box w="full" as="form" role="form" onSubmit={handleSubmit(onSubmit)}>
          <FormControl required isInvalid={errors.amount}>
            <FormLabel htmlFor="amount">Payment</FormLabel>
            <NumInput
              min={0}
              max={max}
              rules={{
                required: { value: true, message: '*Required!' },
                min: { value: 0, message: 'value should not be less than 1' },
                max: {
                  value: max,
                  message: `Value should not be more than ${max}`,
                },
              }}
              name="amount"
            />
            <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
          </FormControl>

          {taxDeducted === 'yes' && (
            <FormControl required isInvalid={errors.withholdingTax}>
              <FormLabel htmlFor="withholdingTax">Withholding Tax</FormLabel>
              <NumInput
                min={0}
                rules={{
                  required: { value: true, message: '*Required!' },
                  min: {
                    value: 0,
                    message: 'minimum value allowed is zero(0)',
                  },
                }}
                name="withholdingTax"
              />
              <FormErrorMessage>
                {errors.withholdingTax?.message}
              </FormErrorMessage>
            </FormControl>
          )}

          <Flex mt={4} justify="space-evenly">
            {onClose && <Button onClick={onClose}>close</Button>}
            <Button colorScheme="cyan" type="submit">
              add
            </Button>
          </Flex>
        </Box>
      </FormProvider>
    </VStack>
  );
}

EditBookingPaymentForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  taxDeducted: PropTypes.oneOf(['yes', 'no']),
  paymentId: PropTypes.string.isRequired,
  booking: PropTypes.shape({
    customer: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      companyName: PropTypes.string,
    }),
    payments: PropTypes.object.isRequired,
    saleDate: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }),
  summary: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    payments: PropTypes.number.isRequired,
    excess: PropTypes.number.isRequired,
  }),
};

export default EditBookingPaymentForm;
