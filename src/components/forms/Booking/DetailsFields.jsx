import { useCallback, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  // FormHelperText,
  FormErrorMessage,
  Grid,
  GridItem,
  Box,
} from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

import { deriveDueDate } from '../../../utils/invoices';

import CustomSelect from '../../ui/CustomSelect';
// import CustomDatePicker from '../../ui/CustomDatePicker';
import ControlledNumInput from 'components/ui/ControlledNumInput';
import ControlledSelect from 'components/ui/ControlledSelect';
//
import BookingItemFormFields from './BookingItemFormFields';
//

//---------------------------------------------------------------
DetailsFields.propTypes = {
  customers: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  paymentTerms: PropTypes.array.isRequired,
  paymentModes: PropTypes.object.isRequired,
  bookingId: PropTypes.string,
  currentBookingDetails: PropTypes.object,
};

export default function DetailsFields(props) {
  const {
    customers,
    paymentTerms,
    loading,
    bookingId,
    // items,
    paymentModes,
    currentBookingDetails,
  } = props;

  const {
    register,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useFormContext();
  // console.log({ errors });

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
    if (!bookingId && paymentTermId) {
      const paymentTerm = paymentTerms.find(
        term => term.value === paymentTermId
      );
      const dueDate = deriveDueDate(paymentTerm, saleDate);
      setValue('dueDate', dueDate);
    }
  }, [paymentTermId, saleDate, paymentTerms, setValue, bookingId]);

  return (
    <Box>
      <Grid mb={2} rowGap={2} columnGap={4} templateColumns="repeat(12, 1fr)">
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
          <BookingItemFormFields
            loading={loading}
            currentBookingDetails={currentBookingDetails}
          />
        </GridItem>
      </Grid>

      <Grid
        borderBottomLeftRadius="lg"
        borderBottomRightRadius="lg"
        mt={6}
        mx={-4}
        mb={-8}
        p={4}
        pb={8}
        bg="#f4f6f8"
        rowGap={2}
        columnGap={4}
        templateColumns="repeat(12, 1fr)"
      >
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
            isInvalid={errors.downPayment?.amount}
          >
            <FormLabel htmlFor="downPaymentAmount">Imprest Given</FormLabel>
            <Controller
              name="downPayment.amount"
              rules={{
                required: { value: true, message: '* Required!' },
              }}
              control={control}
              render={({ field: { value, ref, onBlur, onChange } }) => {
                return (
                  <ControlledNumInput
                    id="downPaymentAmount"
                    ref={ref}
                    updateFieldMode="onBlur"
                    value={value}
                    mode="onBlur"
                    onChange={onChange}
                    onBlur={onBlur}
                    min={1}
                    isReadOnly={loading}
                  />
                );
              }}
            />

            <FormErrorMessage>
              {errors.downPayment?.amount?.message}
            </FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 4]}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={errors.downPayment?.paymentMode}
          >
            <FormLabel htmlFor="paymentMode">Payment Mode</FormLabel>
            <Controller
              name="downPayment.paymentMode"
              control={control}
              render={({ field: { onBlur, onChange, value } }) => {
                function handleChange(paymentModeId) {
                  const paymentMode = paymentModes[paymentModeId];

                  onChange(paymentMode);
                }

                return (
                  <ControlledSelect
                    onChange={handleChange}
                    value={value?.value || ''}
                    options={Object.values(paymentModes || {})}
                    isDisabled={loading}
                    allowClearSelection
                    onBlur={onBlur}
                    placeholder="select payment mode"
                    id="paymentMode"
                  />
                );
              }}
              rules={{
                required: { value: true, message: '*Required!' },
              }}
            />

            <FormErrorMessage>
              {errors.downPayment?.paymentMode?.message}
            </FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 4]}>
          <FormControl
            isDisabled={loading}
            isInvalid={errors.downPayment?.reference}
          >
            <FormLabel htmlFor="reference">Reference#</FormLabel>
            <Input id="reference" {...register('downPayment.reference')} />
            <FormErrorMessage>
              {errors.downPayment?.reference?.message}
            </FormErrorMessage>
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
