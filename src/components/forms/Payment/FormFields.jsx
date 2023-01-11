import { useMemo } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

import ControlledNumInput from 'components/ui/ControlledNumInput';
// import RadioInput from "../../ui/RadioInput";
import RHFSimpleSelect from 'components/ui/hookForm/RHFSimpleSelect';
import RHFGroupedOptionsSelect from 'components/ui/hookForm/RHFGroupedOptionsSelect';
import CustomDatePicker from '../../ui/CustomDatePicker';

function FormFields(props) {
  const {
    customers: rawCustomers,
    accounts,
    paymentModes,
    customerId,
    formDisabled,
  } = props;

  // console.log({ formDisabled, customerId });

  const customers = useMemo(() => {
    if (!Array.isArray(rawCustomers)) {
      return [];
    }

    return rawCustomers.map(customer => {
      const { id, companyName, type, contactType, displayName, email } =
        customer;
      return { id, displayName, companyName, email, contactType, type };
    });
  }, [rawCustomers]);

  const paymentAccounts = useMemo(() => {
    return accounts
      .filter(account => {
        const {
          accountType: { id },
          tags,
        } = account;
        const index = tags.findIndex(tag => tag === 'receivable');

        return (
          (id === 'cash' || id === 'other_current_liability') && index > -1
        );
      })
      .map(account => {
        const { name, accountId, accountType } = account;
        return { name, accountId, accountType };
      });
  }, [accounts]);
  // console.log({ paymentAccounts });
  // console.log({ defaultValues });
  const {
    register,
    formState: { errors },
    control,
    // watch,
  } = useFormContext();
  // console.log({ errors });

  return (
    <>
      <Grid gap={3} templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={[12, 6]} mb={5}>
          <FormControl
            isDisabled={formDisabled}
            required
            isInvalid={errors.customer}
          >
            <FormLabel htmlFor="customer">Customer</FormLabel>
            <RHFSimpleSelect
              name="customer"
              placeholder="--select customer--"
              options={customers}
              optionsConfig={{
                nameField: 'displayName',
                valueField: 'id',
              }}
            />

            <FormErrorMessage>{errors.customer?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem colSpan={[0, 6]}></GridItem>

        <GridItem colSpan={[12, 4]}>
          <FormControl
            isDisabled={formDisabled || !customerId}
            required
            isInvalid={errors.amount}
          >
            <FormLabel htmlFor="amount">Amount</FormLabel>
            <Controller
              name="amount"
              control={control}
              render={({ field: { onBlur, onChange, ref, value } }) => {
                // console.log('amount', { value });
                function handleChange(incomingValue) {
                  // console.log({ incomingValue });
                  onChange(incomingValue);
                }

                return (
                  <ControlledNumInput
                    ref={ref}
                    mode="onBlur"
                    onChange={handleChange}
                    onBlur={onBlur}
                    value={value}
                    showButtons
                  />
                );
              }}
            />
            <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 4]}>
          <FormControl
            isDisabled={formDisabled || !customerId}
            required
            isInvalid={errors.paymentDate}
          >
            <FormLabel htmlFor="paymentDate">Payment Date</FormLabel>
            <CustomDatePicker name="paymentDate" />
            <FormErrorMessage>{errors.paymentDate?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 4]}>
          <FormControl
            isDisabled={formDisabled || !customerId}
            required
            isInvalid={errors.account}
          >
            <FormLabel htmlFor="account">Deposit To</FormLabel>

            <RHFGroupedOptionsSelect
              name="account"
              placeholder="---select account---"
              options={paymentAccounts}
              optionsConfig={{
                nameField: 'name',
                valueField: 'accountId',
                groupNameField: ['accountType', 'name'],
              }}
              isDisabled={formDisabled || !customerId}
            />

            <FormErrorMessage>{errors.account?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={formDisabled || !customerId}
            required
            isInvalid={errors.paymentMode}
          >
            <FormLabel htmlFor="paymentMode">Payment Mode</FormLabel>
            <RHFSimpleSelect
              name="paymentMode"
              placeholder="select payment mode"
              isDisabled={formDisabled || !customerId}
              options={paymentModes}
            />

            <FormErrorMessage>{errors.paymentMode?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={formDisabled || !customerId}
            required
            isInvalid={errors.reference}
          >
            <FormLabel htmlFor="reference">Reference#</FormLabel>
            <Input id="reference" {...register('reference')} />
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
    </>
  );
}

FormFields.propTypes = {
  loading: PropTypes.bool.isRequired,
  formDisabled: PropTypes.bool.isRequired,
  customers: PropTypes.array.isRequired,
  accounts: PropTypes.array.isRequired,
  paymentModes: PropTypes.array.isRequired,
  customerId: PropTypes.string,
  invoices: PropTypes.array,
};

export default FormFields;
