import { useCallback, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  // Input,
  Textarea,
  // FormHelperText,
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
import BookingItemFormFields from '../Booking/BookingItemFormFields';
//

//---------------------------------------------------------------
InvoiceDetailsFields.propTypes = {
  customers: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  paymentTerms: PropTypes.array.isRequired,
  invoiceId: PropTypes.string,
};

export default function InvoiceDetailsFields(props) {
  const { customers, paymentTerms, loading, invoiceId, items } = props;

  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const customerId = watch('customer');
  const paymentTermId = watch('paymentTerm');
  const saleDate = watch('saleDate');

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
      const dueDate = deriveDueDate(paymentTerm, saleDate);
      setValue('dueDate', dueDate);
    }
  }, [paymentTermId, saleDate, paymentTerms, setValue, invoiceId]);

  return (
    <Box pb={1}>
      <Grid my={2} rowGap={2} columnGap={4} templateColumns="repeat(12, 1fr)">
        {/* <GridItem colSpan={12}>
          <FormControl isDisabled={loading} isRequired isInvalid={errors.item}>
            <FormLabel htmlFor="item">Select Vehicle</FormLabel>
            <CustomSelect
              name="item"
              size="md"
              placeholder="--select item--"
              isDisabled={loading}
              rules={{
                required: { value: true, message: '*Required!' },
              }}
              options={items.map(item => {
                console.log({ item });
                const { itemId, name } = item;

                return { name, value: itemId };
              })}
            />
            <FormErrorMessage>{errors.item?.message}</FormErrorMessage>
          </FormControl>
        </GridItem> */}

        <GridItem colSpan={12}>
          <BookingItemFormFields itemsObject={items} />
        </GridItem>

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
              rules={{
                required: { value: true, message: '*Required!' },
              }}
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

        <GridItem colSpan={[12, 4]}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={errors.saleDate}
          >
            <FormLabel htmlFor="saleDate">Invoice Date</FormLabel>
            <CustomDatePicker size="md" name="saleDate" required />
            <FormErrorMessage>{errors.saleDate?.message}</FormErrorMessage>
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

        {/* <GridItem colSpan={[12, 6, 4]}>
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
        </GridItem> */}
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
