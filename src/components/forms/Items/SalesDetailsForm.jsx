import { useContext } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Box,
  Flex,
  Textarea,
  Select,
  Grid,
  GridItem,
  FormHelperText,
} from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import PropTypes from "prop-types";

import StepperContext from "../../../contexts/StepperContext";

import NumInput from "../../ui/NumInput";
import RadioInput from "../../ui/RadioInput";

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

  const allValues = watch();
  function prev() {
    updateFormValues(allValues);
    prevStep();
  }

  const salesTaxId = watch("salesTaxId");

  return (
    <FormProvider {...formMethods}>
      <Box
        bg="white"
        w={["full", "80%"]}
        borderRadius="md"
        shadow="md"
        p={4}
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
              <FormLabel htmlFor="sellingPrice">Selling Price (ksh)</FormLabel>
              <NumInput
                name="sellingPrice"
                min={0}
                rules={{
                  required: { value: true, message: "*Required!" },
                  min: {
                    value: 0,
                    message: "Value should not be less than zero(0)!",
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
              <Select
                placeholder="sales account"
                id="salesAccountId"
                {...register("salesAccountId", {
                  required: { value: true, message: "Required" },
                })}
              >
                {accounts.map((account, i) => {
                  const { name, accountId } = account;
                  return (
                    <option value={accountId} key={i}>
                      {name}
                    </option>
                  );
                })}
              </Select>
              <FormErrorMessage>
                {errors?.salesAccountId?.message}
              </FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            <FormControl isDisabled={loading} isInvalid={errors.salesTaxId}>
              <FormLabel htmlFor="salesTaxId">Tax</FormLabel>
              <Select
                placeholder="sales tax"
                id="salesTaxId"
                {...register("salesTaxId")}
              >
                {taxes.map((tax, i) => {
                  const { name, rate, taxId } = tax;

                  return (
                    <option
                      value={taxId}
                      key={i}
                    >{`${name} -  ${rate}%`}</option>
                  );
                })}
              </Select>
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
            <FormControl isDisabled={loading} isInvalid={errors.sellingDetails}>
              <FormLabel htmlFor="sellingDetails">Extra Details</FormLabel>
              <Textarea id="sellingDetails" {...register("sellingDetails")} />
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
      </Box>
    </FormProvider>
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
