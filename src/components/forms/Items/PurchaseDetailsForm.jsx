import { useContext } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Box,
  Textarea,
  Select,
  Grid,
  GridItem,
  Flex,
} from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import PropTypes from "prop-types";

import StepperContext from "../../../contexts/StepperContext";

import NumInput from "../../ui/NumInput";

function PurchaseDetailsForm(props) {
  const { handleFormSubmit, defaultValues, loading } = props;

  const { prevStep, nextStep } = useContext(StepperContext);

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
    handleFormSubmit(allValues);
    prevStep();
  }

  function next(data) {
    handleFormSubmit(data);
    nextStep();
  }

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
        onSubmit={handleSubmit(next)}
      >
        <Grid gap={4} templateColumns="repeat(12, 1fr)">
          <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              isRequired
              isInvalid={errors.costPrice}
            >
              <FormLabel htmlFor="costPrice">Cost Price (ksh)</FormLabel>
              <NumInput
                name="costPrice"
                min={0}
                rules={{
                  required: { value: true, message: "*Required!" },
                  min: {
                    value: 0,
                    message: "Value should not be less than zero(0)!",
                  },
                }}
              />

              <FormErrorMessage>{errors?.costPrice?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              isRequired
              isInvalid={errors.costAccount}
            >
              <FormLabel htmlFor="costAccount">Account</FormLabel>
              <Select
                placeholder="select account"
                id="costAccount"
                {...register("costAccount", {
                  required: { value: true, message: "Required" },
                })}
              >
                <option value="cost_of_goods_sold">Cost of Goods Sold</option>
              </Select>

              <FormErrorMessage>
                {errors?.costAccount?.message}
              </FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem colSpan={12}>
            <FormControl isDisabled={loading} isInvalid={errors.costDetails}>
              <FormLabel htmlFor="description">Extra Details</FormLabel>
              <Textarea
                id="costDetails"
                {...register("costDetails")}
                defaultValue=""
              />
            </FormControl>
          </GridItem>
        </Grid>

        <Flex pt={4} justify="space-evenly">
          <Button
            onClick={prev}
            colorScheme="cyan"
            variant="outline"
            isLoading={loading}
          >
            prev
          </Button>
          <Button colorScheme="cyan" type="submit" isLoading={loading}>
            next
          </Button>
        </Flex>
      </Box>
    </FormProvider>
  );
}

// PurchaseDetailsForm.defaultProps = {
//   item: { sku: "" },
// };

PurchaseDetailsForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
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

export default PurchaseDetailsForm;
