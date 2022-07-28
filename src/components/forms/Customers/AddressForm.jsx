import { useContext } from "react";
import {
  FormControl,
  Input,
  Textarea,
  Grid,
  GridItem,
  Divider,
  Flex,
  Button,
  Heading,
  Container,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";

import StepperContext from "../../../contexts/StepperContext";

function AddressForm(props) {
  const { loading } = props;
  const { nextStep, prevStep } = useContext(StepperContext);

  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    trigger,
  } = useFormContext();
  // console.log({ details });

  function copyBilling() {
    const [street, city, state, postalCode, country] = getValues([
      "billingStreet",
      "billingCity",
      "billingState",
      "billingPostalCode",
      "billingCountry",
    ]);
    setValue("shippingStreet", street, { shouldDirty: true });
    setValue("shippingCity", city, { shouldDirty: true });
    setValue("shippingState", state, { shouldDirty: true });
    setValue("shippingPostalCode", postalCode, { shouldDirty: true });
    setValue("shippingCountry", country, { shouldDirty: true });
  }

  function next() {
    //trigger validation
    trigger([
      "billingStreet",
      "billingCity",
      "billingState",
      "billingPostalCode",
      "billingCountry",
      "shippingStreet",
      "shippingCity",
      "shippingState",
      "shippingPostalCode",
      "shippingCountry",
    ]);
    const fieldsValid = Object.keys(errors).length === 0;

    if (fieldsValid) {
      nextStep();
    }
  }

  return (
    <Container py={6} maxW="container.sm">
      {/* <Heading size="sm" textAlign="center">
        Address
      </Heading> */}
      <Grid
        columnGap={4}
        rowGap={2}
        templateColumns="repeat(12, 1fr)"
        mt={1}
        mb={1}
      >
        <GridItem colSpan={[12, null, 6]}>
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

            <GridItem colSpan={6}>
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
            <GridItem colSpan={6}>
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
            <GridItem colSpan={6}>
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
            <GridItem colSpan={6}>
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

        <GridItem colSpan={[12, null, 6]}>
          <Grid
            columnGap={2}
            rowGap={2}
            templateColumns="repeat(12, 1fr)"
            mt={1}
            mb={1}
          >
            <GridItem colSpan={12}>
              <Flex w="full" justify="space-between">
                <Heading color="#718096" size="sm" mr={1}>
                  Shipping address
                </Heading>
                <Button
                  onClick={copyBilling}
                  size="xs"
                  colorScheme="cyan"
                  variant="outline"
                >
                  Copy billing address
                </Button>
              </Flex>

              <Divider />
            </GridItem>
            <GridItem colSpan={12}>
              <FormControl
                isDisabled={loading}
                isInvalid={!!errors.shippingStreet}
              >
                <Textarea
                  placeholder="Street"
                  id="shippingStreet"
                  {...register("shippingStreet")}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={6}>
              <FormControl
                isDisabled={loading}
                isInvalid={!!errors.shippingCity}
              >
                <Input
                  placeholder="City | Town"
                  id="shippingCity"
                  {...register("shippingCity")}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={6}>
              <FormControl
                isDisabled={loading}
                isInvalid={!!errors.shippingState}
              >
                <Input
                  placeholder="State | Province"
                  id="shippingState"
                  {...register("shippingState")}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={6}>
              <FormControl
                isDisabled={loading}
                isInvalid={!!errors.shippingPostalCode}
              >
                <Input
                  placeholder="Postal code"
                  id="shippingPostalCode"
                  {...register("shippingPostalCode")}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={6}>
              <FormControl
                isDisabled={loading}
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
        <Button
          onClick={next}
          isLoading={loading}
          colorScheme="cyan"
          type="button"
        >
          next
        </Button>
      </Flex>
    </Container>
  );
}

AddressForm.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default AddressForm;
