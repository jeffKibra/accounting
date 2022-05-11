import {
  Box,
  Flex,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Heading,
} from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import PropTypes from "prop-types";

import NumInput from "../../ui/NumInput";

function EditInvoicePaymentForm(props) {
  console.log({ props });
  const {
    invoice,
    summary,
    handleFormSubmit,
    onClose,
    taxDeducted,
    paymentId,
  } = props;
  const {
    payments,
    summary: { balance: invoiceBalance },
  } = invoice;

  let payment = payments.find((payment) => payment.paymentId === paymentId);
  const prevPayment = payment?.amount || 0;

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: payment || {},
  });
  const {
    handleSubmit,
    formState: { errors },
    watch,
  } = formMethods;

  const { invoiceId } = invoice;

  function onSubmit(data) {
    handleFormSubmit({
      ...data,
      invoiceId,
    });
    onClose && onClose();
  }

  const { excess } = summary;
  const newExcess = excess + prevPayment;

  let balance = invoiceBalance + prevPayment;
  const max = Math.min(balance, newExcess);
  console.log({ newExcess, balance, max });

  const amount = watch("amount") || 0;
  console.log({ amount });

  return (
    <VStack w="full">
      <VStack>
        <Heading size="xs">Payment Balance: {newExcess - amount}</Heading>
        <Heading size="xs">Invoice Balance: {balance - amount}</Heading>
      </VStack>
      <FormProvider {...formMethods}>
        <Box w="full" as="form" role="form" onSubmit={handleSubmit(onSubmit)}>
          <FormControl required isInvalid={errors.amount}>
            <FormLabel htmlFor="amount">Payment</FormLabel>
            <NumInput
              min={0}
              max={max}
              rules={{
                required: { value: true, message: "*Required!" },
                min: { value: 0, message: "value should not be less than 1" },
                max: {
                  value: max,
                  message: `Value should not be more than ${max}`,
                },
              }}
              name="amount"
            />
            <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
          </FormControl>

          {taxDeducted === "yes" && (
            <FormControl required isInvalid={errors.withholdingTax}>
              <FormLabel htmlFor="withholdingTax">Withholding Tax</FormLabel>
              <NumInput
                min={0}
                rules={{
                  required: { value: true, message: "*Required!" },
                  min: {
                    value: 0,
                    message: "minimum value allowed is zero(0)",
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

EditInvoicePaymentForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  taxDeducted: PropTypes.oneOf(["yes", "no"]).isRequired,
  paymentId: PropTypes.string.isRequired,
  invoice: PropTypes.shape({
    customer: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      companyName: PropTypes.string,
    }),
    summary: PropTypes.shape({
      totalAmount: PropTypes.number.isRequired,
    }),
    payments: PropTypes.array.isRequired,
    invoiceDate: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    invoiceId: PropTypes.string.isRequired,
  }),
  summary: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    paidAmount: PropTypes.number.isRequired,
    excess: PropTypes.number.isRequired,
  }),
};

export default EditInvoicePaymentForm;
