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
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';

import CustomSelect from '../../ui/CustomSelect';
import CustomDatePicker from '../../ui/CustomDatePicker';

SalesReceiptForm.propTypes = {
  paymentAccounts: PropTypes.array.isRequired,
  paymentModes: PropTypes.array.isRequired,
  customers: PropTypes.array,
  loading: PropTypes.bool.isRequired,
};

function SalesReceiptForm(props) {
  console.log({ props });
  const { paymentAccounts, paymentModes, customers, loading } = props;

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Container>
      <Container py={4}>
        <Grid rowGap={2} columnGap={4} templateColumns="repeat(12, 1fr)">
          {/* <GridItem colSpan={12}>
            <Heading size="sm">
              Total: {formValues?.summary.totalAmount}
            </Heading>
          </GridItem> */}
          <GridItem colSpan={[12, 6]}>
            <FormControl isDisabled={loading} isInvalid={errors.customerId}>
              <FormLabel htmlFor="customerId">Customer</FormLabel>
              <CustomSelect
                name="customerId"
                placeholder="--select customer--"
                isDisabled={loading}
                options={customers.map(customer => {
                  const { id: customerId, displayName } = customer;

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
              <FormErrorMessage>{errors.receiptDate?.message}</FormErrorMessage>
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
                rules={{ required: { value: true, message: '*Required!' } }}
                groupedOptions={paymentAccounts.map(account => {
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
                  required: { value: true, message: '*Required!' },
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
              <Input id="reference" {...register('reference')} />
              <FormErrorMessage>{errors.reference?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={[12, 6]}>
            <FormControl isDisabled={loading} isInvalid={errors.customerNotes}>
              <FormLabel htmlFor="customerNotes">Customer Notes</FormLabel>
              <Textarea id="customerNotes" {...register('customerNotes')} />
              <FormErrorMessage>
                {errors.customerNotes?.message}
              </FormErrorMessage>
              <FormHelperText>Include a note for the customer.</FormHelperText>
            </FormControl>
          </GridItem>
        </Grid>

        <Flex justify="flex-end" mt={4}>
          <Button isLoading={loading} colorScheme="cyan" type="submit">
            save
          </Button>
        </Flex>
      </Container>
    </Container>
  );
}

export default SalesReceiptForm;
