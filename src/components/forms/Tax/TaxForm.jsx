import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

function TaxForm(props) {
  const { handleFormSubmit, loading, tax } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    ...(tax ? { defaultValues: { ...tax } } : {}),
  });

  return (
    <Box bg="white" borderRadius="md" w="350px" maxW="90%" shadow="md" p={4}>
      <Box as="form" role="form" onSubmit={handleSubmit(handleFormSubmit)}>
        <FormControl isDisabled={loading} isRequired isInvalid={errors.name}>
          <FormLabel htmlFor="taxName">Tax Name</FormLabel>
          <Input
            id="taxName"
            {...register("name", {
              required: { value: true, message: "*Required!" },
            })}
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isDisabled={loading} isRequired isInvalid={errors.rate}>
          <FormLabel htmlFor="rate">Rate (%)</FormLabel>
          <NumberInput>
            <NumberInputField
              id="rate"
              {...register("rate", {
                required: { value: true, message: "Required" },
                valueAsNumber: true,
              })}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <FormErrorMessage>{errors?.rate?.message}</FormErrorMessage>
        </FormControl>
        <Flex mt={4}>
          <Button type="submit" isLoading={loading} colorScheme="cyan">
            save
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

TaxForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  tax: PropTypes.shape({
    name: PropTypes.string,
    rate: PropTypes.number,
  }),
};
export default TaxForm;
