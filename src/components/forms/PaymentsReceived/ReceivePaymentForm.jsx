import {
  Box,
  Flex,
  VStack,
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
  const { customers, handleFormSubmit, loading, defaultValues } = props;
  const formMethods = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: defaultValues || {},
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
    handleFormSubmit(newData);
  }

  return (
    <VStack w="full">
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
                <FormErrorMessage>
                  {errors.customerId?.message}
                </FormErrorMessage>
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
                <FormErrorMessage>
                  {errors.paymentDate?.message}
                </FormErrorMessage>
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
                <FormErrorMessage>
                  {errors.paymentMode?.message}
                </FormErrorMessage>
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
                <FormErrorMessage>
                  {errors.bankCharges?.message}
                </FormErrorMessage>
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
                <FormErrorMessage>
                  {errors.taxDeducted?.message}
                </FormErrorMessage>
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

          <Flex>
            <Button colorScheme="cyan" mt={4} type="submit">
              save
            </Button>
          </Flex>
        </Box>
      </FormProvider>
    </VStack>
  );
}

ReceivePaymentForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
};

export default ReceivePaymentForm;
