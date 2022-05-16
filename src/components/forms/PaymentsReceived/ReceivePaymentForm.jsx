import { useContext } from "react";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  FormErrorMessage,
  FormHelperText,
  Button,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import PaymentsContext from "../../../contexts/PaymentsContext";
import StepperContext from "../../../contexts/StepperContext";

import NumInput from "../../ui/NumInput";
import RadioInput from "../../ui/RadioInput";

import { paymentsReceived } from "../../../utils/constants";
const { accounts, paymentModes, tdsTaxAccounts } = paymentsReceived;

const schema = Yup.object().shape({
  customerId: Yup.string().required("*Required!"),
  paymentDate: Yup.string().required("*Required!"),
  amount: Yup.number()
    .typeError("Value must be a number!")
    .min(1, "Amount cannot be less than one(1)!")
    .required("*Required!"),
  reference: Yup.string(),
  paymentMode: Yup.string().required("*Required!"),
  bankCharges: Yup.number()
    .typeError("Value must be a number!")
    .min(0, "Minimum value accepted is zero(0)!"),
  account: Yup.string().required("*Required!"),
  taxDeducted: Yup.string().required("*Required!"),
  tdsTaxAccount: Yup.string().when("taxDeducted", {
    is: "yes",
    then: Yup.string().required("*Required!"),
  }),
});

function ReceivePaymentForm(props) {
  const { customers, loading } = props;
  const { updateFormValues, formValues } = useContext(PaymentsContext);
  const { nextStep } = useContext(StepperContext);

  const formMethods = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: formValues || {},
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = formMethods;

  function onSubmit(data) {
    console.log({ data });
    const { customerId } = data;
    const customer = customers.find(
      (customer) => customer.customerId === customerId
    );
    const newData = {
      ...data,
      customer,
    };

    console.log({ newData });
    //update form values
    updateFormValues(newData);
    //go to the next step
    nextStep();
  }

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
              <Select
                placeholder="---select customer---"
                id="customerId"
                {...register("customerId")}
              >
                {customers.map((customer, i) => {
                  const { customerId, displayName } = customer;

                  return (
                    <option key={i} value={customerId}>
                      {displayName}
                    </option>
                  );
                })}
              </Select>
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
              isInvalid={errors.reference}
            >
              <FormLabel htmlFor="reference">Reference#</FormLabel>
              <Input id="reference" {...register("reference")} />
              <FormErrorMessage>{errors.reference?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              required
              isInvalid={errors.paymentMode}
            >
              <FormLabel htmlFor="paymentMode">Payment Mode</FormLabel>
              <Select
                placeholder="---select payment mode---"
                id="paymentMode"
                {...register("paymentMode")}
              >
                {paymentModes.map((mode, i) => {
                  return (
                    <Box
                      as="option"
                      textTransform="capitalize"
                      key={i}
                      value={mode}
                    >
                      {mode}
                    </Box>
                  );
                })}
              </Select>
              <FormErrorMessage>{errors.paymentMode?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              required
              isInvalid={errors.bankCharges}
            >
              <FormLabel htmlFor="bankCharges">Bank Charges</FormLabel>
              <NumInput name="bankCharges" />
              <FormErrorMessage>{errors.bankCharges?.message}</FormErrorMessage>
              <FormHelperText>optional</FormHelperText>
            </FormControl>
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            <FormControl
              isDisabled={loading}
              required
              isInvalid={errors.account}
            >
              <FormLabel htmlFor="account">Deposit To</FormLabel>
              <Select
                placeholder="---select account---"
                id="account"
                {...register("account")}
              >
                {accounts.map((account, i) => {
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
              <FormErrorMessage>{errors.account?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={[12, 6]}>
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
          </GridItem>

          {watch("taxDeducted") === "yes" && (
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
          )}
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
  // handleFormSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  customers: PropTypes.array.isRequired,
};

export default ReceivePaymentForm;