import { useContext } from "react";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import StepperContext from "../../../contexts/StepperContext";

import NumInput from "../../ui/NumInput";
// import RadioInput from "../../ui/RadioInput";
import CustomSelect from "../../ui/CustomSelect";

import { paymentModes } from "../../../constants";

const schema = Yup.object().shape({
  customerId: Yup.string().required("*Required!"),
  paymentDate: Yup.string().required("*Required!"),
  amount: Yup.number()
    .typeError("Value must be a number!")
    .min(1, "Amount cannot be less than one(1)!")
    .required("*Required!"),
  reference: Yup.string(),
  paymentModeId: Yup.string().required("*Required!"),
  bankCharges: Yup.number()
    .typeError("Value must be a number!")
    .min(0, "Minimum value accepted is zero(0)!"),
  accountId: Yup.string().required("*Required!"),
  // taxDeducted: Yup.string().required("*Required!"),
  // tdsTaxAccount: Yup.string().when("taxDeducted", {
  //   is: "yes",
  //   then: Yup.string().required("*Required!"),
  // }),
});

function ReceivePaymentForm(props) {
  const { customers, loading, accounts, handleFormSubmit, defaultValues } =
    props;

  const { nextStep } = useContext(StepperContext);

  const paymentAccounts = accounts.filter((account) => {
    const {
      accountType: { id },
      tags,
    } = account;
    const index = tags.findIndex((tag) => tag === "receivable");

    return (id === "cash" || id === "other_current_liability") && index > -1;
  });
  // console.log({ paymentAccounts });

  const formMethods = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: defaultValues || {},
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    // watch,
  } = formMethods;

  function onSubmit(data) {
    // console.log({ data });
    const { customerId, accountId, paymentModeId } = data;
    const customer = customers.find(
      (customer) => customer.customerId === customerId
    );
    const paymentMode = paymentModes.find(
      (mode) => mode.value === paymentModeId
    );
    const account = paymentAccounts.find(
      (account) => account.accountId === accountId
    );
    const { name, accountType } = account;
    const newData = {
      ...data,
      customer,
      paymentMode,
      account: { name, accountId, accountType },
    };

    // console.log({ newData });
    //update form values
    handleFormSubmit(newData);
    //go to the next step
    nextStep();
  }

  // console.log({ errors });

  return (
    <FormProvider {...formMethods}>
      <Box
        bg="white"
        borderRadius="md"
        shadow="md"
        p={4}
        w={["full", "80%"]}
        as="form"
        role="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid gap={3} templateColumns="repeat(12, 1fr)">
          <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              required
              isInvalid={errors.customerId}
            >
              <FormLabel htmlFor="customerId">Customer</FormLabel>
              <CustomSelect
                name="customerId"
                placeholder="--select customer--"
                options={customers.map((customer) => {
                  const { displayName, customerId } = customer;
                  return { name: displayName, value: customerId };
                })}
              />
              <FormErrorMessage>{errors.customerId?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              required
              isInvalid={errors.paymentDate}
            >
              <FormLabel htmlFor="paymentDate">Payment Date</FormLabel>
              <Input
                type="date"
                id="paymentDate"
                {...register("paymentDate")}
              />
              <FormErrorMessage>{errors.paymentDate?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              required
              isInvalid={errors.amount}
            >
              <FormLabel htmlFor="amount">Amount</FormLabel>
              <NumInput name="amount" />
              <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
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
                placeholder="select payment mode"
              />
              <FormErrorMessage>
                {errors.paymentModeId?.message}
              </FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              required
              isInvalid={errors.reference}
            >
              <FormLabel htmlFor="reference">Reference#</FormLabel>
              <Input id="reference" {...register("reference")} />
              <FormErrorMessage>{errors.reference?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          {/* <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              required
              isInvalid={errors.bankCharges}
            >
              <FormLabel htmlFor="bankCharges">Bank Charges </FormLabel>
              <NumInput name="bankCharges" />
              <FormErrorMessage>{errors.bankCharges?.message}</FormErrorMessage>
              <FormHelperText>if any</FormHelperText>
            </FormControl>
          </GridItem> */}

          {/* <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              required
              isInvalid={errors.taxDeducted}
            >
              <FormLabel htmlFor="taxDeducted">Tax Deducted?)</FormLabel>
              <RadioInput
                defaultValue="no"
                name="taxDeducted"
                options={["yes", "no"]}
              />
              <FormErrorMessage>{errors.taxDeducted?.message}</FormErrorMessage>
              <FormHelperText>TDS || Withholding Tax</FormHelperText>
            </FormControl>
          </GridItem> */}

          {/* {watch("taxDeducted") === "yes" && (
            <GridItem colSpan={[12, 6]}>
              <FormControl
                isDisabled={loading}
                required
                isInvalid={errors.tdsTaxAccount}
              >
                <FormLabel htmlFor="tdsTaxAccount">Tax Account</FormLabel>
                <Select
                  placeholder="---select account---"
                  id="tdsTaxAccount"
                  {...register("tdsTaxAccount")}
                >
                  {tdsTaxAccounts.map((account, i) => {
                    return (
                      <Box
                        as="option"
                        textTransform="capitalize"
                        key={i}
                        value={account}
                      >
                        {account}
                      </Box>
                    );
                  })}
                </Select>
                <FormErrorMessage>
                  {errors.tdsTaxAccount?.message}
                </FormErrorMessage>
                <FormHelperText>
                  Tax Deducted at Source(TDS) | Withholding tax Account
                </FormHelperText>
              </FormControl>
            </GridItem>
          )} */}
        </Grid>

        <Flex justify="center">
          <Button isLoading={loading} colorScheme="cyan" mt={4} type="submit">
            next
          </Button>
        </Flex>
      </Box>
    </FormProvider>
  );
}

ReceivePaymentForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  customers: PropTypes.array.isRequired,
  accounts: PropTypes.array.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.object.isRequired,
};

export default ReceivePaymentForm;
