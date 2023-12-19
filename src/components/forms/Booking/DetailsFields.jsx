import { useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  Textarea,
  // FormHelperText,
  FormErrorMessage,
  Grid,
  GridItem,
  Box,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
//
import SearchContacts from 'components/ui/SearchContacts';

import { deriveDueDate } from '../../../utils/invoices';

//
import BookingItemFormFields from './BookingItemFormFields';
//

//---------------------------------------------------------------
DetailsFields.propTypes = {
  loading: PropTypes.bool.isRequired,
  // paymentTerms: PropTypes.array.isRequired,
  paymentModes: PropTypes.array.isRequired,
  bookingId: PropTypes.string,
  currentBookingDetails: PropTypes.object,
};

export default function DetailsFields(props) {
  const {
    paymentTerms,
    loading,
    bookingId,
    // items,
    currentBookingDetails,
  } = props;

  // console.log({ paymentModes });

  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();
  // console.log({ errors });

  const customer = watch('customer');
  const paymentTerm = watch('paymentTerm');
  const saleDate = watch('saleDate');

  /**
   * update payment term according to customer preference
   */
  useEffect(() => {
    if (customer) {
      // console.log({ customer });
      const { paymentTerm } = customer;
      //update payment term field
      setValue('paymentTerm', paymentTerm);
    }
  }, [customer, setValue]);
  /**
   * update due date according to the selected payment term
   */
  useEffect(() => {
    if (!bookingId && paymentTerm) {
      const dueDate = deriveDueDate(paymentTerm, saleDate);

      setValue('dueDate', dueDate);
    }
  }, [paymentTerm, saleDate, paymentTerms, setValue, bookingId]);

  return (
    <Box w="full" p={4}>
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
        // mb={-8}
        p={4}
        pb={4}
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

            <SearchContacts
              name="customer"
              size="md"
              placeholder="--select customer--"
              isDisabled={loading}
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
