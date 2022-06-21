import { useContext, useMemo } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Flex,
  Textarea,
  Grid,
  GridItem,
  FormHelperText,
  Container,
} from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import PropTypes from "prop-types";

import StepperContext from "../../../contexts/StepperContext";

import NumInput from "../../ui/NumInput";
import RadioInput from "../../ui/RadioInput";
import CustomSelect from "../../ui/CustomSelect";

function SalesDetailsForm(props) {
  const {
    handleFormSubmit,
    defaultValues,
    loading,
    taxes,
    accounts,
    updateFormValues,
  } = props;

  const { prevStep } = useContext(StepperContext);

  const defaults = useMemo(() => {
    return {
      sellingPrice: defaultValues?.sellingPrice || 0,
      salesAccountId: defaultValues?.salesAccountId || "sales",
      salesTaxId: defaultValues?.salesTaxId || "",
      salesTaxType: defaultValues?.salesTaxType || "",
      extraDetails: defaultValues?.extraDetails || "",
    };
  }, [defaultValues]);

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: { ...defaults },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
  } = formMethods;

  function prev() {
    const allValues = getValues();
    updateFormValues(allValues);
    prevStep();
  }
  console.log({ taxes });
  const salesTaxId = watch("salesTaxId");

  return (
    <Container
      maxW="container.sm"
      bg="white"
      borderRadius="md"
      shadow="md"
      p={4}
    >
      <FormProvider {...formMethods}>
        <Container
          py={4}
          as="form"
          role="form"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <Grid columnGap={4} rowGap={2} templateColumns="repeat(12, 1fr)">
            <GridItem colSpan={[12, 6]}>
              <FormControl
                isDisabled={loading}
                isRequired
                isInvalid={errors.sellingPrice}
              >
                <FormLabel htmlFor="sellingPrice">
                  Selling Price (ksh)
                </FormLabel>
                <NumInput
                  name="sellingPrice"
                  min={0}
                  rules={{
                    required: { value: true, message: "*Required!" },
                    min: {
                      value: 1,
                      message: "Value should be greater than zero(0)!",
                    },
                  }}
                />

                <FormErrorMessage>
                  {errors?.sellingPrice?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[12, 6]}>
              <FormControl
                isDisabled={loading}
                isRequired
                isInvalid={errors.salesAccountId}
              >
                <FormLabel htmlFor="salesAccountId">Account</FormLabel>
                <CustomSelect
                  name="salesAccountId"
                  placeholder="sales account"
                  isDisabled={loading}
                  rules={{ required: { value: true, message: "Required" } }}
                  options={accounts.map((account, i) => {
                    const { name, accountId } = account;
                    return {
                      name,
                      value: accountId,
                    };
                  })}
                />
                <FormErrorMessage>
                  {errors?.salesAccountId?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[12, 6]}>
              <FormControl isDisabled={loading} isInvalid={errors.salesTaxId}>
                <FormLabel htmlFor="salesTaxId">Tax</FormLabel>
                <CustomSelect
                  name="salesTaxId"
                  placeholder="sales tax"
                  isDisabled={loading}
                  options={taxes.map((tax, i) => {
                    const { name, rate, taxId } = tax;

                    return {
                      name: `${name} - ${rate}%`,
                      value: taxId,
                    };
                  })}
                />
                <FormErrorMessage>
                  {errors?.salesTaxId?.message}
                </FormErrorMessage>
                <FormHelperText>Add tax to your item</FormHelperText>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[12, 6]}>
              <GridItem colSpan={[12, 6]}>
                <FormControl
                  isDisabled={loading}
                  w="full"
                  // isRequired={salesTaxId}
                  isInvalid={errors.salesTaxType}
                >
                  <FormLabel htmlFor="salesTaxType">Amount is</FormLabel>
                  <RadioInput
                    name="salesTaxType"
                    options={["tax inclusive", "tax exclusive"]}
                    rules={{
                      validate: {
                        required: (value) => {
                          return !salesTaxId || !!value || "*Required!";
                        },
                      },
                    }}
                  />
                  <FormErrorMessage>
                    {errors?.salesTaxType?.message}
                  </FormErrorMessage>
                </FormControl>
              </GridItem>
            </GridItem>
            <GridItem colSpan={12}>
              <FormControl isDisabled={loading} isInvalid={errors.extraDetails}>
                <FormLabel htmlFor="extraDetails">Extra Details</FormLabel>
                <Textarea id="extraDetails" {...register("extraDetails")} />
                <FormErrorMessage>
                  {errors?.extraDetails?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>
          </Grid>

          <Flex pt={4} justify="space-evenly">
            <Button
              variant="outline"
              colorScheme="cyan"
              isLoading={loading}
              onClick={prev}
            >
              prev
            </Button>
            <Button colorScheme="cyan" type="submit" isLoading={loading}>
              save
            </Button>
          </Flex>
        </Container>
      </FormProvider>
    </Container>
  );
}

SalesDetailsForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  updateFormValues: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  taxes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      rate: PropTypes.number.isRequired,
      taxId: PropTypes.string.isRequired,
    })
  ),
  defaultValues: PropTypes.object,
  accounts: PropTypes.array.isRequired,
};

export default SalesDetailsForm;
