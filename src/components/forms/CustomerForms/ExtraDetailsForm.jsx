import { useEffect } from "react";
import {
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Grid,
  GridItem,
  Flex,
  Button,
  Box,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

function ExtraDetailsForm(props) {
  const { loading, prev, defaultValues, handleFormSubmit } = props;
  console.log({ props });
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: defaultValues || {},
  });

  useEffect(() => {
    if (defaultValues) {
      reset({ ...defaultValues });
    }
  }, [defaultValues, reset]);

  const formValues = watch();

  function goBack() {
    prev(formValues);
  }

  return (
    <Box
      as="form"
      role="form"
      p={4}
      bg="white"
      borderRadius="md"
      shadow="md"
      w={["full", "90%", "80%"]}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Grid
        columnGap={4}
        rowGap={2}
        templateColumns="repeat(12, 1fr)"
        mt="4px"
        mb="4px"
      >
        <GridItem colSpan={[12, 6]}>
          <FormControl isDisabled={loading} isInvalid={!!errors.openingBalance}>
            <FormLabel htmlFor="openingBalance">Opening Balance</FormLabel>
            <NumberInput defaultValue={0}>
              <NumberInputField
                id="openingBalance"
                {...register("openingBalance", { valueAsNumber: true })}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>
              {errors.openingBalance?.message}
            </FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={!!errors.city}
          >
            <FormLabel>city</FormLabel>
            <Input
              {...register("city", {
                required: { value: true, message: "Required!" },
              })}
            />
            <FormErrorMessage>{errors.city?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 6]}>
          <FormControl isDisabled={loading} isInvalid={!!errors.zipcode}>
            <FormLabel>Zip Code</FormLabel>
            <Input {...register("zipcode")} />
            <FormErrorMessage>{errors.zipcode?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 6]}>
          <FormControl isDisabled={loading} isInvalid={!!errors.website}>
            <FormLabel htmlFor="website">website</FormLabel>
            <Input id="website" {...register("website")} />
            <FormErrorMessage>{errors.website?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={!!errors.address}
          >
            <FormLabel htmlFor="address">Address</FormLabel>
            <Textarea
              id="address"
              {...register("address", {
                required: { value: true, message: "Required!" },
              })}
            />
            <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 6]}>
          <FormControl isDisabled={loading} isInvalid={!!errors.remarks}>
            <FormLabel htmlFor="remarks">Remarks</FormLabel>
            <Textarea id="remarks" {...register("remarks")} />
            <FormErrorMessage>{errors.remarks?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
      </Grid>

      <Flex justifyContent="space-around" mt={4}>
        <Button
          isLoading={loading}
          variant="outline"
          colorScheme="cyan"
          onClick={goBack}
        >
          prev
        </Button>

        <Button
          isLoading={loading}
          variant="outline"
          colorScheme="cyan"
          type="submit"
        >
          save
        </Button>
      </Flex>
    </Box>
  );
}

ExtraDetailsForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  prev: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.shape({
    address: PropTypes.string,
    city: PropTypes.string,
    zipcode: PropTypes.string,
    website: PropTypes.string,
    remarks: PropTypes.string,
    openingBalance: PropTypes.number,
  }),
};

export default ExtraDetailsForm;
