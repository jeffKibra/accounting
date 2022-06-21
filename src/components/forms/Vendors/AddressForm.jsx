import { useEffect, useContext, useMemo } from "react";
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
import { useForm } from "react-hook-form";

import StepperContext from "../../../contexts/StepperContext";

function AddressForm(props) {
  const { loading, defaultValues, handleFormSubmit } = props;
  const { nextStep, prevStep } = useContext(StepperContext);

  const defaults = useMemo(() => {
    return {
      billingStreet: defaultValues?.billingStreet || "",
      billingCity: defaultValues?.billingCity || "",
      billingState: defaultValues?.billingState || "",
      billingPostalCode: defaultValues?.billingPostalCode || "",
      billingCountry: defaultValues?.billingCountry || "",
      shippingStreet: defaultValues?.shippingStreet || "",
      shippingCity: defaultValues?.shippingCity || "",
      shippingState: defaultValues?.shippingState || "",
      shippingPostalCode: defaultValues?.shippingPostalCode || "",
      shippingCountry: defaultValues?.shippingCountry || "",
    };
  }, [defaultValues]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      ...defaults,
    },
  });
  // console.log({ details });
  useEffect(() => {
    if (defaults) {
      reset(defaults);
    }
  }, [reset, defaults]);

  function copyBilling() {
    const [street, city, state, postalCode, country] = getValues([
      "billingStreet",
      "billingCity",
      "billingState",
      "billingPostalCode",
      "billingCountry",
    ]);
    setValue("shippingStreet", street);
    setValue("shippingCity", city);
    setValue("shippingState", state);
    setValue("shippingPostalCode", postalCode);
    setValue("shippingCountry", country);
  }

  function onSubmit(data) {
    handleFormSubmit(data);
    nextStep();
  }

  function goBack() {
    const all = getValues();
    handleFormSubmit(all);
    prevStep();
  }

  return (
    <Container
      maxW="container.sm"
      p={4}
      bg="white"
      borderRadius="md"
      shadow="md"
      w={["full", "90%", "80%"]}
    >
      <Heading size="sm" textAlign="center">
        Address
      </Heading>
      <Container
        py={6}
        maxW="container.sm"
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
            onClick={goBack}
          >
            back
          </Button>
          <Button isLoading={loading} colorScheme="cyan" type="submit">
            next
          </Button>
        </Flex>
      </Container>
    </Container>
  );
}

AddressForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.shape({
    billingStreet: PropTypes.string,
    billingCity: PropTypes.string,
    billingState: PropTypes.string,
    billingPostalCode: PropTypes.string,
    billingCountry: PropTypes.string,
    shippingStreet: PropTypes.string,
    shippingCity: PropTypes.string,
    shippingState: PropTypes.string,
    shippingPostalCode: PropTypes.string,
    shippingCountry: PropTypes.string,
  }),
};

export default AddressForm;
