import { useCallback } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormHelperText,
  FormErrorMessage,
  Grid,
  GridItem,
  Box,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';

import { deriveDueDate } from '../../../utils/invoices';

import CustomSelect from '../../ui/CustomSelect';
import CustomDatePicker from '../../ui/CustomDatePicker';
import { useEffect } from 'react';

//---------------------------------------------------------------
InvoiceDetailsFields.propTypes = {
  customers: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  paymentTerms: PropTypes.array.isRequired,
  invoiceId: PropTypes.string,
};

export default function InvoiceDetailsFields(props) {
  const { customers, paymentTerms, loading, invoiceId } = props;

  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const customerId = watch('customer');
  const paymentTermId = watch('paymentTerm');
  const invoiceDate = watch('invoiceDate');

  const getCustomer = useCallback(
    customerId => {
      return customers.find(customer => customer.id === customerId);
    },
    [customers]
  );
  /**
   * update payment term according to customer preference
   */
  useEffect(() => {
    if (customerId) {
      const { paymentTerm } = getCustomer(customerId);
      //update payment term field
      setValue('paymentTerm', paymentTerm.value);
    }
  }, [customerId, getCustomer, setValue]);
  /**
   * update due date according to the selected payment term
   */
  useEffect(() => {
    if (!invoiceId && paymentTermId) {
      const paymentTerm = paymentTerms.find(
        term => term.value === paymentTermId
      );
      const dueDate = deriveDueDate(paymentTerm, invoiceDate);
      setValue('dueDate', dueDate);
    }
  }, [paymentTermId, invoiceDate, paymentTerms, setValue, invoiceId]);

  return (
    <Box pb={1}>
      <Grid mb={2} rowGap={2} columnGap={4} templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={[12, 6]}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={errors.customer}
          >
            <FormLabel htmlFor="customer">Customer</FormLabel>
            <CustomSelect
              name="customer"
              size="md"
              placeholder="--select customer--"
              isDisabled={loading}
              rules={{ required: { value: true, message: '*Required!' } }}
              options={customers.map(customer => {
                const { id: customerId, displayName } = customer;

                return { name: displayName, value: customerId };
              })}
            />
            <FormErrorMessage>{errors.customer?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem colSpan={[12, 6]}>
          <FormControl isDisabled={loading} isInvalid={errors.customerNotes}>
            <FormLabel htmlFor="customerNotes">Customer Notes</FormLabel>
            <Textarea
              placeholder="Include a note for the customer."
              id="customerNotes"
              {...register('customerNotes')}
            />
            <FormErrorMessage>{errors.customerNotes?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
      </Grid>

      <Grid
        rowGap={2}
        columnGap={4}
        templateColumns="repeat(12, 1fr)"
        bg="#f4f6f8"
        mx={-4}
        p={4}
      >
        <GridItem colSpan={[12, 4]}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={errors.invoiceDate}
          >
            <FormLabel htmlFor="invoiceDate">Invoice Date</FormLabel>
            <CustomDatePicker size="md" name="invoiceDate" required />
            <FormErrorMessage>{errors.invoiceDate?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 4]}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={errors.paymentTerm}
          >
            <FormLabel htmlFor="paymentTerm">Terms</FormLabel>
            <CustomSelect
              name="paymentTerm"
              options={paymentTerms || []}
              isDisabled={!customerId || loading}
            />
            <FormErrorMessage>{errors.paymentTerm?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 4]}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={errors.dueDate}
          >
            <FormLabel htmlFor="dueDate">Due Date</FormLabel>
            <CustomDatePicker name="dueDate" required />
            <FormErrorMessage>{errors.dueDate?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 6, 4]}>
          <FormControl isDisabled={loading} isInvalid={errors.orderNumber}>
            <FormLabel htmlFor="orderNumber">Order Number</FormLabel>
            <Input id="orderNumber" {...register('orderNumber')} />
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 6, 4]}>
          <FormControl isDisabled={loading} isInvalid={errors.subject}>
            <FormLabel htmlFor="subject">Subject</FormLabel>
            <Input size="md" {...register('subject')} />
            <FormErrorMessage>{errors.subject?.message}</FormErrorMessage>
            <FormHelperText>
              Let your customer know what this invoice is for
            </FormHelperText>
          </FormControl>
        </GridItem>
      </Grid>

      {/* <Flex justify="space-evenly" mt={4}>
        <Button
          onClick={prevStep}
          isDisabled={loading}
          type="button"
          colorScheme="cyan"
          variant="outline"
        >
          back
        </Button>

        <Button isLoading={loading} colorScheme="cyan" type="submit">
          save
        </Button>
      </Flex> */}
    </Box>
  );
}
