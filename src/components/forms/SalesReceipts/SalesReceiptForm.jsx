import { useContext, useMemo } from "react";
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormHelperText,
  FormErrorMessage,
  Button,
  Grid,
  GridItem,
  Container,
  Heading,
} from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";

import SalesContext from "../../../contexts/SalesContext";
import StepperContext from "../../../contexts/StepperContext";

import CustomSelect from "../../ui/CustomSelect";
import CustomDatePicker from "../../ui/CustomDatePicker";
import { useEffect } from "react";

function SalesReceiptForm(props) {
  const { accounts, paymentModes } = props;
  const { formValues, updateFormValues, customers, loading, finish } =
    useContext(SalesContext);
  const { prevStep } = useContext(StepperContext);
  console.log({ formValues });
  const defaults = useMemo(() => {
    const today = new Date();

    return {
      customerId: formValues?.customer?.customerId || "",
      receiptDate: formValues?.receiptDate || today,
      accountId: formValues?.account?.accountId || "undeposited_funds",
      paymentModeId: formValues?.paymentMode?.value || "cash",
      reference: formValues?.reference || "",
      customerNotes: formValues?.customerNotes || "",
    };
  }, [formValues]);

  const paymentAccounts = accounts.filter((account) => {
    const {
      accountType: { id },
      tags,
    } = account;
    const index = tags.findIndex((tag) => tag === "receivable");

    return id === "cash" && index > -1;
  });

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: { ...defaults },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = formMethods;
  /**
   * if defaults change, update form field
   */
  useEffect(() => {
    if (defaults) {
      reset(defaults);
    }
  }, [defaults, reset]);

  function goBack() {
    const allValues = getValues();
    console.log({ allValues });
    updateFormValues({ ...allValues });

    prevStep();
  }

  function onSubmit(data) {
    let { customerId, paymentModeId, accountId, ...rest } = data;
    let customer = {
      displayName: "Walk-in customer",
      email: "",
      type: "individual",
      companyName: "",
      customerId,
    };
    if (customerId) {
      customer = customers.find(
        (customer) => customer.customerId === customerId
      );
    }

    const paymentMode = paymentModes.find(
      (mode) => mode.value === paymentModeId
    );
    const account = paymentAccounts.find(
      (account) => account.accountId === accountId
    );
    const { name, accountType } = account;
    const newData = {
      ...rest,
      customer,
      paymentMode,
      account: { name, accountId, accountType },
    };
    console.log({ newData });

    finish(newData);
  }

  return (
    <FormProvider {...formMethods}>
      <Container
        mt={2}
        p={4}
        bg="white"
        borderRadius="md"
        shadow="md"
        maxW="container.sm"
      >
        <Container
          py={4}
          as="form"
          role="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid rowGap={2} columnGap={4} templateColumns="repeat(12, 1fr)">
            <GridItem colSpan={12}>
              <Heading size="sm">
                Total: {formValues?.summary.totalAmount}
              </Heading>
            </GridItem>
            <GridItem colSpan={[12, 6]}>
              <FormControl isDisabled={loading} isInvalid={errors.customerId}>
                <FormLabel htmlFor="customerId">Customer</FormLabel>
                <CustomSelect
                  name="customerId"
                  placeholder="--select customer--"
                  isDisabled={loading}
                  options={customers.map((customer) => {
                    const { customerId, displayName } = customer;

                    return { name: displayName, value: customerId };
                  })}
                />
                <FormErrorMessage>{errors.customer?.message}</FormErrorMessage>
                <FormHelperText>
                  Leave blank for a walk-in customer
                </FormHelperText>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[12, 6]}>
              <FormControl
                isDisabled={loading}
                isRequired
                isInvalid={errors.receiptDate}
              >
                <FormLabel htmlFor="receiptDate">Receipt Date</FormLabel>
                <CustomDatePicker name="receiptDate" required />
                <FormErrorMessage>
                  {errors.receiptDate?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[12, 6]}>
              <FormControl
                isDisabled={loading}
                required
                isInvalid={errors.accountId}
              >
                <FormLabel htmlFor="accountId">Deposit To</FormLabel>
                <CustomSelect
                  name="accountId"
                  placeholder="---select account---"
                  isDisabled={loading}
                  rules={{ required: { value: true, message: "*Required!" } }}
                  groupedOptions={paymentAccounts.map((account) => {
                    const { name, accountId, accountType } = account;
                    return {
                      name,
                      value: accountId,
                      groupName: accountType.name,
                    };
                  })}
                />
                <FormErrorMessage>{errors.accountId?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[12, 6]}>
              <FormControl
                isDisabled={loading}
                required
                isInvalid={errors.paymentModeId}
              >
                <FormLabel htmlFor="paymentModeId">Payment Mode</FormLabel>
                <CustomSelect
                  name="paymentModeId"
                  options={paymentModes}
                  isDisabled={loading}
                  placeholder="select payment mode"
                  rules={{
                    required: { value: true, message: "*Required!" },
                  }}
                />
                <FormErrorMessage>
                  {errors.paymentModeId?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[12, 6]}>
              <FormControl isDisabled={loading} isInvalid={errors.reference}>
                <FormLabel htmlFor="reference">Reference#</FormLabel>
                <Input id="reference" {...register("reference")} />
                <FormErrorMessage>{errors.reference?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={[12, 6]}>
              <FormControl
                isDisabled={loading}
                isInvalid={errors.customerNotes}
              >
                <FormLabel htmlFor="customerNotes">Customer Notes</FormLabel>
                <Textarea id="customerNotes" {...register("customerNotes")} />
                <FormErrorMessage>
                  {errors.customerNotes?.message}
                </FormErrorMessage>
                <FormHelperText>
                  Include a note for the customer.
                </FormHelperText>
              </FormControl>
            </GridItem>
          </Grid>

          <Flex justify="space-evenly" mt={4}>
            <Button
              onClick={goBack}
              isLoading={loading}
              variant="outline"
              colorScheme="cyan"
            >
              back
            </Button>
            <Button isLoading={loading} colorScheme="cyan" type="submit">
              save
            </Button>
          </Flex>
        </Container>
      </Container>
    </FormProvider>
  );
}

export default SalesReceiptForm;
