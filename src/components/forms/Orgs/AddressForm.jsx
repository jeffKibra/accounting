import { useEffect, useContext, useMemo } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Grid,
  GridItem,
  Flex,
  Button,
  Box,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

import StepperContext from "../../../contexts/StepperContext";

function AddressForm(props) {
  const { loading, defaultValues, updateFormValues, handleFormSubmit } = props;
  const { prevStep } = useContext(StepperContext);

  const defaults = useMemo(() => {
    return {
      street: defaultValues?.street || "",
      city: defaultValues?.city || "",
      state: defaultValues?.state || "",
      postalCode: defaultValues?.postalCode || "",
      country: defaultValues?.country || "Kenya",
    };
  }, [defaultValues]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      ...defaults,
    },
  });
  useEffect(() => {
    if (defaults) {
      reset(defaults);
    }
  }, [reset, defaults]);

  function onSubmit(data) {
    console.log({ data });
    handleFormSubmit(data);
  }

  function goBack() {
    const all = getValues();
    console.log({ all });
    updateFormValues(all);
    prevStep();
  }

  return (
    <Box as="form" role="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid
        columnGap={2}
        rowGap={2}
        templateColumns="repeat(12, 1fr)"
        mt={1}
        mb={1}
      >
        <GridItem colSpan={6}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={!!errors.country}
          >
            <FormLabel htmlFor="country">Country</FormLabel>
            <Input
              placeholder="country"
              id="country"
              {...register("country", {
                required: { value: true, message: "*Required!" },
              })}
            />
            <FormErrorMessage>{errors.country?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={6}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={!!errors.state}
          >
            <FormLabel htmlFor="state">State | Province</FormLabel>
            <Input
              placeholder="state | Province"
              id="state"
              {...register("state", {
                required: { value: true, message: "*Required!" },
              })}
            />
            <FormErrorMessage>{errors.state?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={6}>
          <FormControl isDisabled={loading} isInvalid={!!errors.city}>
            <FormLabel htmlFor="city">City | Town</FormLabel>
            <Input placeholder="city | Town" id="city" {...register("city")} />
            <FormErrorMessage>{errors.city?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={6}>
          <FormControl isDisabled={loading} isInvalid={!!errors.postalCode}>
            <FormLabel htmlFor="postalCode">Postal code</FormLabel>
            <Input
              placeholder="Postal code"
              id="postalCode"
              {...register("postalCode")}
            />
            <FormErrorMessage>{errors.postalCode?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={12}>
          <FormControl isDisabled={loading} isInvalid={!!errors.street}>
            <FormLabel htmlFor="street">Street</FormLabel>
            <Textarea
              resize="none"
              placeholder="street"
              id="street"
              {...register("street")}
            />
            <FormErrorMessage>{errors.street?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
      </Grid>

      <Flex justifyContent="space-around" mt={4}>
        <Button
          isLoading={loading}
          variant="outline"
          colorScheme="cyan"
          type="button"
          onClick={goBack}
        >
          back
        </Button>
        <Button isLoading={loading} colorScheme="cyan" type="submit">
          save
        </Button>
      </Flex>
    </Box>
  );
}

AddressForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  updateFormValues: PropTypes.func.isRequired,
  defaultValues: PropTypes.shape({
    street: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    postalCode: PropTypes.string,
    country: PropTypes.string,
  }),
};

export default AddressForm;
