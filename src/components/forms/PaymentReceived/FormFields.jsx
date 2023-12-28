// import { useMemo } from 'react';
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
//
import SearchContacts from 'components/ui/SearchContacts';
//
import ControlledNumInput from 'components/ui/ControlledNumInput';
// import RadioInput from "../../ui/RadioInput";
// import RHFGroupedOptionsSelect from 'components/ui/hookForm/RHFGroupedOptionsSelect';
import CustomDatePicker from '../../ui/CustomDatePicker';
import RHFSimpleSelect from 'components/ui/hookForm/RHFSimpleSelect';
//

function FormFields(props) {
  const {
    // accounts,
    paymentModes,
    customerId,
    formIsDisabled,
  } = props;

  // console.log({ formIsDisabled, customerId });

  // console.log({ accounts });
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
            isDisabled={formIsDisabled}
            required
            isInvalid={errors.customer}
          >
            <FormLabel htmlFor="customer">Customer</FormLabel>

            <SearchContacts
              name="customer"
              size="md"
              placeholder="--select customer--"
              isDisabled={formIsDisabled}
              contactGroup="customer"
              controllerProps={{
                rules: {
                  required: { value: true, message: '*Required!' },
                },
              }}
            />

            <FormErrorMessage>{errors.customer?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem colSpan={[0, 6]}></GridItem>

        <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={formIsDisabled || !customerId}
            required
            isInvalid={errors.amount}
          >
            <FormLabel htmlFor="amount">Amount Received</FormLabel>
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

        <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={formIsDisabled || !customerId}
            required
            isInvalid={errors.paymentDate}
          >
            <FormLabel htmlFor="paymentDate">Payment Date</FormLabel>
            <CustomDatePicker name="paymentDate" />
            <FormErrorMessage>{errors.paymentDate?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <Controller name="account" control={control} render={() => <></>} />

        {/* <GridItem colSpan={[12, 4]}>
          <FormControl
            isDisabled={formIsDisabled || !customerId}
            required
            isInvalid={errors.account}
          >
            <FormLabel htmlFor="account">Deposit To</FormLabel>

            <RHFGroupedOptionsSelect
              name="account"
              placeholder="---select account---"
              options={accounts}
              optionsConfig={{
                nameField: 'name',
                valueField: 'accountId',
                groupNameField: ['accountType', 'name'],
              }}
              isDisabled={formIsDisabled || !customerId}
            />

            <FormErrorMessage>{errors.account?.message}</FormErrorMessage>
          </FormControl>
        </GridItem> */}

        <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={formIsDisabled || !customerId}
            required
            isInvalid={errors.paymentMode}
          >
            <FormLabel htmlFor="paymentMode">Payment Mode</FormLabel>

            <RHFSimpleSelect
              name="paymentMode"
              placeholder="select payment mode"
              id="payment_mode"
              isDisabled={formIsDisabled || !customerId}
              options={paymentModes}
              optionsConfig={{ nameField: 'name', valueField: '_id' }}
              controllerProps={{
                rules: {
                  required: { value: true, message: '*Required!' },
                },
              }}
            />

            <FormErrorMessage>{errors.paymentMode?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={formIsDisabled || !customerId}
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
  // accounts: PropTypes.array.isRequired,
  // loading: PropTypes.bool.isRequired,
  formIsDisabled: PropTypes.bool.isRequired,
  paymentModes: PropTypes.array.isRequired,
  customerId: PropTypes.string,
};

export default FormFields;
