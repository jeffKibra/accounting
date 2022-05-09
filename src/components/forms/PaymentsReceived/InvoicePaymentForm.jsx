import {
  Box,
  Flex,
  VStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Button,
} from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import PropTypes from "prop-types";

import NumInput from "../../ui/NumInput";

function InvoicePaymentForm(props) {
  console.log({ props });
  const { customers, handleFormSubmit, loading, defaultValues } = props;
  const formMethods = useForm({
    mode: "onChange",
    defaultValues: defaultValues || {},
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
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
        <Box
          bg="white"
          borderRadius="md"
          shadow="md"
          p={4}
          w={["full", "80%"]}
          as="form"
          role="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormControl isDisabled={loading} required isInvalid={errors.payment}>
            <FormLabel htmlFor="payment">Payment</FormLabel>
            <NumInput min={0} name="payment" />
            <FormErrorMessage>{errors.payment?.message}</FormErrorMessage>
          </FormControl>

          <FormControl
            isDisabled={loading}
            required
            isInvalid={errors.withholdingTax}
          >
            <FormLabel htmlFor="withholdingTax">Withholding Tax</FormLabel>
            <NumInput min={0} name="withholdingTax" />
            <FormErrorMessage>
              {errors.withholdingTax?.message}
            </FormErrorMessage>
          </FormControl>

          <Flex>
            <Button colorScheme="cyan" mt={4} type="submit">
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
};

export default InvoicePaymentForm;
