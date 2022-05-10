import {
  Box,
  Flex,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
} from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import PropTypes from "prop-types";

import NumInput from "../../ui/NumInput";

function InvoicePaymentForm(props) {
  console.log({ props });
  const {
    customers,
    handleFormSubmit,
    onClose,
    loading,
    defaultValues,
    taxDeducted,
  } = props;
  const formMethods = useForm({
    mode: "onChange",
    defaultValues: defaultValues || {},
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  function onSubmit(data) {
    console.log({ data });
    const { customerId } = data;
    const customer = customers.find(
      (customer) => customer.customerId === customerId
    );
    const newData = {
      ...data,
      customer,
    };

    console.log({ newData });
    handleFormSubmit(newData);
  }

  return (
    <VStack w="full">
      <FormProvider {...formMethods}>
        <Box w="full" as="form" role="form" onSubmit={handleSubmit(onSubmit)}>
          <FormControl isDisabled={loading} required isInvalid={errors.payment}>
            <FormLabel htmlFor="payment">Payment</FormLabel>
            <NumInput
              min={0}
              rules={{
                required: { value: true, message: "*Required!" },
                min: { value: 1, message: "value should not be less than 1" },
              }}
              name="payment"
            />
            <FormErrorMessage>{errors.payment?.message}</FormErrorMessage>
          </FormControl>

          {taxDeducted === "yes" && (
            <FormControl
              isDisabled={loading}
              required
              isInvalid={errors.withholdingTax}
            >
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

InvoicePaymentForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  taxDeducted: PropTypes.oneOf(["yes", "no"]).isRequired,
};

export default InvoicePaymentForm;
