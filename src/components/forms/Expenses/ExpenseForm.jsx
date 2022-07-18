import { useContext } from "react";
import {
  Container,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Heading,
  Grid,
  GridItem,
  Flex,
  FormHelperText,
} from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import PropTypes from "prop-types";

import StepperContext from "../../../contexts/StepperContext";

import CustomSelect from "../../ui/CustomSelect";
import CustomDatePicker from "../../ui/CustomDatePicker";

function ExpenseForm(props) {
  const {
    updateFormValues,
    handleFormSubmit,
    loading,
    paymentModes,
    summary,
    vendors,
    paymentAccounts,
    defaultValues,
  } = props;
  const { prevStep } = useContext(StepperContext);

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: {
      paymentAccountId:
        defaultValues?.paymentAccount?.accountId || "undeposited_funds",
      expenseDate: defaultValues?.expenseDate || new Date(),
      vendorId: defaultValues?.vendor?.vendorId || "",
      paymentModeId: defaultValues?.paymentMode?.value || "cash",
      reference: defaultValues?.reference || "",
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = formMethods;

  function formulateData(formData) {
    const { vendorId, paymentAccountId, paymentModeId, ...rest } = formData;
    const vendor =
      vendors.find((vendor) => vendor.vendorId === vendorId) || null;
    const paymentAccount = paymentAccounts.find(
      (account) => account.accountId === paymentAccountId
    );
    const paymentMode = paymentModes.find(
      (mode) => mode.value === paymentModeId
    );

    const newData = {
      ...rest,
      paymentAccount,
      paymentMode,
    };

    if (vendor) {
      newData.vendor = vendor;
    }

    return { ...newData };
  }

  function goBack() {
    let allValues = getValues();
    allValues = formulateData(allValues);

    updateFormValues(allValues);
    prevStep();
  }

  function saveData(data) {
    const formData = formulateData(data);

    handleFormSubmit(formData);
  }

  return (
    <Container
      p={4}
      mt={1}
      borderRadius="md"
      shadow="md"
      bg="white"
      maxW="container.sm"
    >
      <FormProvider {...formMethods}>
        <Container
          py={4}
          as="form"
          role="form"
          onSubmit={handleSubmit(saveData)}
        >
          <Grid rowGap={2} columnGap={3} templateColumns="repeat(12, 1fr)">
            <GridItem colSpan={12}>
              <Heading size="sm">Total: {summary.totalAmount}</Heading>
            </GridItem>

            <GridItem colSpan={[12, 6]}>
              <FormControl
                isReadOnly={loading}
                isRequired
                isInvalid={errors.paymentAccountId}
              >
                <FormLabel htmlFor="paymentAccountId">Payed Through </FormLabel>
                <CustomSelect
                  name="paymentAccountId"
                  placeholder="---select account---"
                  isDisabled={loading}
                  rules={{ required: { value: true, message: "*Required" } }}
                  groupedOptions={paymentAccounts.map((account) => {
                    const { name, accountId, accountType } = account;
                    return {
                      name,
                      value: accountId,
                      groupName: accountType.name,
                    };
                  })}
                />
                <FormErrorMessage>
                  {errors?.paymentAccountId?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[12, 6]}>
              <FormControl
                isDisabled={loading}
                isRequired
                isInvalid={errors.expenseDate}
              >
                <FormLabel htmlFor="expenseDate">Date</FormLabel>
                <CustomDatePicker name="expenseDate" required />
                <FormErrorMessage>
                  {errors.expenseDate?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[12, 6]}>
              <FormControl isReadOnly={loading} isInvalid={errors.vendorId}>
                <FormLabel htmlFor="vendorId">Payee</FormLabel>
                <CustomSelect
                  name="vendorId"
                  placeholder="who are you paying?"
                  isDisabled={loading}
                  options={vendors.map((vendor) => {
                    const { vendorId, displayName } = vendor;
                    return {
                      name: displayName,
                      value: vendorId,
                    };
                  })}
                />
                <FormErrorMessage>{errors?.vendorId?.message}</FormErrorMessage>
                <FormHelperText>Optional</FormHelperText>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[12, 6]}>
              <FormControl
                isReadOnly={loading}
                isRequired
                isInvalid={errors.paymentModeId}
              >
                <FormLabel htmlFor="paymentModeId">Payment Method </FormLabel>
                <CustomSelect
                  name="paymentModeId"
                  placeholder="payment method"
                  isDisabled={loading}
                  rules={{ required: { value: true, message: "*Required" } }}
                  options={paymentModes}
                />
                <FormErrorMessage>
                  {errors?.paymentModeId?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[12, 6]}>
              <FormControl isReadOnly={loading} isInvalid={errors.reference}>
                <FormLabel htmlFor="reference">Reference#</FormLabel>
                <Input id="reference" {...register("reference")} />
                <FormErrorMessage>{errors.reference?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={12}>
              <Flex mt={2} w="full" justify="space-evenly">
                <Button
                  colorScheme="cyan"
                  variant="outline"
                  onClick={goBack}
                  isDisabled={loading}
                >
                  back
                </Button>

                <Button colorScheme="cyan" type="submit" isLoading={loading}>
                  save
                </Button>
              </Flex>
            </GridItem>
          </Grid>
        </Container>
      </FormProvider>
    </Container>
  );
}

ExpenseForm.defaultProps = {
  summary: {},
};

ExpenseForm.propTypes = {
  updateFormValues: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  summary: PropTypes.object.isRequired,
  paymentModes: PropTypes.array.isRequired,
  vendors: PropTypes.array,
  paymentAccounts: PropTypes.array.isRequired,
  defaultValues: PropTypes.object,
};

export default ExpenseForm;
