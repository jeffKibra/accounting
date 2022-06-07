import { useEffect, useContext } from "react";
import {
  FormControl,
  Input,
  Textarea,
  Checkbox,
  Grid,
  GridItem,
  Divider,
  Flex,
  Button,
  Box,
  Heading,
  Text,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

import StepperContext from "../../../contexts/StepperContext";

function AddressForm(props) {
  const { loading, defaultValues, handleFormSubmit } = props;
  const { nextStep, prevStep } = useContext(StepperContext);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      ...defaultValues,
      similarAddress: defaultValues?.similarAddress || true,
    },
  });
  // console.log({ details });

  const street = watch("billingStreet");
  const city = watch("billingCity");
  const state = watch("billingState");
  const postalCode = watch("billingPostalCode");
  const country = watch("billingCountry");
  const similarAddress = watch("similarAddress");
  console.log({ similarAddress });
  console.log({ street, city, state, postalCode, country });

  useEffect(() => {
    setValue("shippingStreet", street);
    setValue("shippingCity", city);
    setValue("shippingState", state);
    setValue("shippingPostalCode", postalCode);
    setValue("shippingCountry", country);
  }, [street, city, state, postalCode, country, setValue]);

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [reset, defaultValues]);

  function onSubmit(data) {
    handleFormSubmit(data);
    nextStep();
  }

  return (
    <Box
      p={4}
      bg="white"
      borderRadius="md"
      shadow="md"
      w={["full", "90%", "80%"]}
      as="form"
      role="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Grid
        columnGap={4}
        rowGap={2}
        templateColumns="repeat(12, 1fr)"
        mt={1}
        mb={1}
      >
        <GridItem colSpan={[12, 6]}>
          <Grid
            columnGap={2}
            rowGap={2}
            templateColumns="repeat(12, 1fr)"
            mt={1}
            mb={1}
          >
            <GridItem colSpan={12}>
              <Heading color="#718096" size="sm">
                Billing address
              </Heading>

              <Divider />
            </GridItem>
            <GridItem colSpan={12}>
              <FormControl
                isDisabled={loading}
                isInvalid={!!errors.billingStreet}
              >
                <Textarea
                  placeholder="Street"
                  id="billingStreet"
                  {...register("billingStreet")}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={[12, 6]}>
              <FormControl
                isDisabled={loading}
                isInvalid={!!errors.billingCity}
              >
                <Input
                  placeholder="City | Town"
                  id="billingCity"
                  {...register("billingCity")}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={[12, 6]}>
              <FormControl
                isDisabled={loading}
                isInvalid={!!errors.billingState}
              >
                <Input
                  placeholder="State | Province"
                  id="billingState"
                  {...register("billingState")}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={[12, 6]}>
              <FormControl
                isDisabled={loading}
                isInvalid={!!errors.billingPostalCode}
              >
                <Input
                  placeholder="Postal code"
                  id="billingPostalCode"
                  {...register("billingPostalCode")}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={[12, 6]}>
              <FormControl
                isDisabled={loading}
                isInvalid={!!errors.billingCountry}
              >
                <Input
                  placeholder="Country"
                  id="billingCountry"
                  {...register("billingCountry")}
                />
              </FormControl>
            </GridItem>
          </Grid>
        </GridItem>

        <GridItem colSpan={[12, 6]}>
          <Grid
            columnGap={2}
            rowGap={2}
            templateColumns="repeat(12, 1fr)"
            mt={1}
            mb={1}
          >
            <GridItem colSpan={12}>
              <Flex>
                <Heading color="#718096" size="sm" mr={1}>
                  Shipping address
                </Heading>
                <Checkbox
                  justifySelf="flex-end"
                  fontSize="xs"
                  {...register("similarAddress")}
                >
                  <Text fontSize="sm">Copy billing address</Text>
                </Checkbox>
              </Flex>

              <Divider />
            </GridItem>
            <GridItem colSpan={12}>
              <FormControl
                isDisabled={loading}
                isReadOnly={similarAddress}
                isInvalid={!!errors.shippingStreet}
              >
                <Textarea
                  placeholder="Street"
                  id="shippingStreet"
                  {...register("shippingStreet")}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={[12, 6]}>
              <FormControl
                isDisabled={loading}
                isReadOnly={similarAddress}
                isInvalid={!!errors.shippingCity}
              >
                <Input
                  placeholder="City | Town"
                  id="shippingCity"
                  {...register("shippingCity")}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={[12, 6]}>
              <FormControl
                isDisabled={loading}
                isReadOnly={similarAddress}
                isInvalid={!!errors.shippingState}
              >
                <Input
                  placeholder="State | Province"
                  id="shippingState"
                  {...register("shippingState")}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={[12, 6]}>
              <FormControl
                isDisabled={loading}
                isReadOnly={similarAddress}
                isInvalid={!!errors.shippingPostalCode}
              >
                <Input
                  placeholder="Postal code"
                  id="shippingPostalCode"
                  {...register("shippingPostalCode")}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={[12, 6]}>
              <FormControl
                isDisabled={loading}
                isReadOnly={similarAddress}
                isInvalid={!!errors.shippingCountry}
              >
                <Input
                  placeholder="Country"
                  id="shippingCountry"
                  {...register("shippingCountry")}
                />
              </FormControl>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
      <Flex justifyContent="space-around" mt={4}>
        <Button
          isLoading={loading}
          variant="outline"
          colorScheme="cyan"
          type="button"
          onClick={prevStep}
        >
          back
        </Button>
        <Button isLoading={loading} colorScheme="cyan" type="submit">
          next
        </Button>
      </Flex>
    </Box>
  );
}

AddressForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.shape({
    type: PropTypes.string,
    companyName: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    displayName: PropTypes.string,
    email: PropTypes.string,
    workPhone: PropTypes.string,
    mobile: PropTypes.string,
  }),
};

export default AddressForm;
