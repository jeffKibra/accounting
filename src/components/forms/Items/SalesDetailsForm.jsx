import { useContext } from "react";
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
import { useFormContext } from "react-hook-form";
import PropTypes from "prop-types";

import StepperContext from "../../../contexts/StepperContext";

import NumInput from "../../ui/NumInput";
import RadioInput from "../../ui/RadioInput";
import CustomSelect from "../../ui/CustomSelect";

function SalesDetailsForm(props) {
  const { loading, taxes, accounts } = props;

  const { prevStep } = useContext(StepperContext);

  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  const salesTax = watch("salesTax");

  return (
    <Container py={4}>
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
                  value: 1,
                  message: "Value should be greater than zero(0)!",
                },
              }}
            />

            <FormErrorMessage>{errors?.sellingPrice?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={errors.salesAccount}
          >
            <FormLabel htmlFor="salesAccount">Account</FormLabel>
            <CustomSelect
              name="salesAccount"
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
            <FormErrorMessage>{errors?.salesAccount?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 6]}>
          <FormControl isDisabled={loading} isInvalid={errors.salesTax}>
            <FormLabel htmlFor="salesTax">Tax</FormLabel>
            <CustomSelect
              name="salesTax"
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
            <FormErrorMessage>{errors?.salesTax?.message}</FormErrorMessage>
            <FormHelperText>Add tax to your item</FormHelperText>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 6]}>
          <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              w="full"
              // isRequired={salesTax}
              isInvalid={errors.salesTaxType}
            >
              <FormLabel htmlFor="salesTaxType">Amount is</FormLabel>
              <RadioInput
                name="salesTaxType"
                options={["tax inclusive", "tax exclusive"]}
                rules={{
                  validate: {
                    required: (value) => {
                      return !salesTax || !!value || "*Required!";
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
            <FormErrorMessage>{errors?.extraDetails?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
      </Grid>

      <Flex pt={4} justify="space-evenly">
        <Button
          variant="outline"
          colorScheme="cyan"
          isLoading={loading}
          onClick={prevStep}
        >
          prev
        </Button>
        <Button colorScheme="cyan" type="submit" isLoading={loading}>
          save
        </Button>
      </Flex>
    </Container>
  );
}

SalesDetailsForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  taxes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      rate: PropTypes.number.isRequired,
      taxId: PropTypes.string.isRequired,
    })
  ),
  accounts: PropTypes.array.isRequired,
};

export default SalesDetailsForm;
