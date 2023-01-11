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
import CustomSelect from '../../ui/CustomSelect';
import RHFSimpleSelect from 'components/ui/hookForm/RHFSimpleSelect';
import RHFGroupedOptionsSelect from 'components/ui/hookForm/RHFGroupedOptionsSelect';
import CustomDatePicker from '../../ui/CustomDatePicker';

function FormFields(props) {
  const { customers, accounts, paymentModes, customerId, formDisabled } = props;

  // console.log({ formDisabled, customerId });

  const paymentAccounts = accounts.filter(account => {
    const {
      accountType: { id },
      tags,
    } = account;
    const index = tags.findIndex(tag => tag === 'receivable');

    return (id === 'cash' || id === 'other_current_liability') && index > -1;
  });
  // console.log({ paymentAccounts });
  // console.log({ defaultValues });
  const {
    register,
    formState: { errors },
    control,
    // watch,
  } = useFormContext();

  // function onSubmit(data) {
  //   // console.log({ data });
  //   const { customerId, accountId, paymentModeId, ...formData } = data;
  //   //
  //   const customer = customers.find(customer => customer.id === customerId);
  //   if (!customer) {
  //     return toasts.error('The selected customer is not valid');
  //   }

  //   const paymentMode = paymentModes.find(mode => mode.value === paymentModeId);
  //   if (!paymentMode) {
  //     return toasts.error('The selected payment mode is not valid');
  //   }

  //   const account = paymentAccounts.find(
  //     account => account.accountId === accountId
  //   );
  //   if (!account) {
  //     return toasts.error('The selected account is not valid');
  //   }
  //   const { name, accountType } = account;
  //   const newData = {
  //     ...formData,
  //     customer: formats.formatCustomerData(customer),
  //     paymentMode,
  //     account: { name, accountId, accountType },
  //   };

  //   // console.log({ newData, data });

  //   // console.log({ newData });
  //   //update form values
  //   handleFormSubmit(newData);
  //   //go to the next step
  //   nextStep();
  // }

  // console.log({ errors });

  return (
    <>
      <Grid gap={3} templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={[12, 6]} mb={5}>
          <FormControl
            isDisabled={formDisabled}
            required
            isInvalid={errors.customerId}
          >
            <FormLabel htmlFor="customerId">Customer</FormLabel>
            <RHFSimpleSelect
              name="customer"
              placeholder="--select customer--"
              options={customers}
              optionsConfig={{
                nameField: 'displayName',
                valueField: 'id',
              }}
            />
            {/* <CustomSelect
              name="customerId"
              placeholder="--select customer--"
              options={customers.map(customer => {
                const { displayName, id: customerId } = customer;
                return { name: displayName, value: customerId };
              })}
            /> */}
            <FormErrorMessage>{errors.customerId?.message}</FormErrorMessage>
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
            isInvalid={errors.accountId}
          >
            <FormLabel htmlFor="accountId">Deposit To</FormLabel>

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

            {/* <CustomSelect
              name="accountId"
              placeholder="---select account---"
              groupedOptions={paymentAccounts.map(account => {
                const { name, accountId, accountType } = account;
                return {
                  name,
                  value: accountId,
                  groupName: accountType.name,
                };
              })}
              isDisabled={formDisabled || !customerId}
            /> */}
            <FormErrorMessage>{errors.accountId?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={formDisabled || !customerId}
            required
            isInvalid={errors.paymentModeId}
          >
            <FormLabel htmlFor="paymentModeId">Payment Mode</FormLabel>
            <RHFSimpleSelect
              name="paymentMode"
              placeholder="select payment mode"
              isDisabled={formDisabled || !customerId}
              options={paymentModes}
            />
            {/* <CustomSelect
              name="paymentModeId"
              options={paymentModes}
              placeholder="select payment mode"
            /> */}
            <FormErrorMessage>{errors.paymentModeId?.message}</FormErrorMessage>
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
  customers: PropTypes.array.isRequired,
  accounts: PropTypes.array.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.object,
  paymentModes: PropTypes.array.isRequired,
};

export default FormFields;
