import { useEffect, useCallback } from 'react';
import { Box, Flex, Button } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useForm, FormProvider, Controller } from 'react-hook-form';

import formats from 'utils/formats';
import { confirmFutureDate } from 'utils/dates';
import { useToasts, useGetBookingFormProps } from 'hooks';
//
import { bookingFormProps } from 'propTypes';
//
import { Bookings } from 'utils/bookings';
//

import SkeletonLoader from 'components/ui/SkeletonLoader';
import Empty from 'components/ui/Empty';

import DetailsFields from './DetailsFields';

import ItemsLoader from './ItemsLoader';
//
import BookingDaysSelector from './Components/BookingDaysSelector';

const futureDateErrorMsg =
  'Return date must be either same day or ahead of Pickup date';

function BookingForm(props) {
  const { booking, handleFormSubmit, updating } = props;
  // console.log({ booking });

  const {
    // accounts,
    paymentModes,
    paymentTerms,
    customers,
    // items,
    taxes,
    loading,
  } = useGetBookingFormProps();

  const today = new Date();
  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      //booking values
      startDate: new Date(booking?.startDate || Date.now()),
      endDate: new Date(booking?.endDate || Date.now()),
      selectedDates: booking?.selectedDates || [],
      item: booking?.item || null,
      quantity: booking?.quantity || 0,
      bookingRate: booking?.bookingRate || 0,
      bookingTotal: booking?.bookingTotal || 0,
      transferAmount: booking?.transferAmount || 0,
      total: booking?.total || 0,
      //  itemTax: 0,
      //   itemRateTotal: 0,
      //   itemTaxTotal: 0,
      //   salesTax: null,
      // taxType: 'taxExclusive',
      //
      customer: booking?.customer?.id || '',
      saleDate: new Date(booking?.saleDate || today),
      paymentTerm: booking?.paymentTerm?.value || 'on_receipt',
      dueDate: new Date(booking?.dueDate || today),
      downPayment: booking?.downPayment || {
        amount: 0,
        paymentMode: null,
        reference: '',
      },
      //
      // subject: booking?.subject || '',
      // orderNumber: booking?.orderNumber || '',
      // customerNotes: booking?.customerNotes || '',
    },
  });

  const toasts = useToasts();

  const { handleSubmit, watch, control, setValue, clearErrors, setError } =
    formMethods;

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const selectedItem = watch('item');
  const selectedDates = watch('selectedDates');

  console.log({ selectedDates });

  const setFutureDateError = useCallback(() => {
    setError('endDate', {
      type: 'validate',
      message: futureDateErrorMsg,
    });
  }, [setError]);

  useEffect(() => {
    console.log('setFutureDateError function just changed');
  }, [setFutureDateError]);

  useEffect(() => {
    //validate fields
    console.log('updating selected dates');
    let incomingSelectedDates = [];

    try {
      if (startDate && endDate) {
        const endDateIsFutureDate = confirmFutureDate(startDate, endDate);

        if (endDateIsFutureDate) {
          clearErrors('endDate');

          //derives all selected dates from startDate and endDate
          const bookingDays = Bookings.getBookingDays(startDate, endDate);
          console.log({ bookingDays });
          const { ungroupedDates } = bookingDays;

          incomingSelectedDates = ungroupedDates;
        } else {
          setFutureDateError();
        }
      }
    } catch (error) {
      console.error(error);
    }

    //update selectedDates field
    setValue('selectedDates', incomingSelectedDates);
  }, [startDate, endDate, setValue, clearErrors, setFutureDateError]);

  useEffect(() => {
    console.log('selectedDates have changed');
  }, [selectedDates]);

  // console.log({
  //   dirtyFields,
  //   isDirty,
  //   totalAmount: booking?.summary?.totalAmount,
  // });

  function onSubmit(data) {
    console.log('submitting...', data);
    // console.log({ data });
    const { customer: customerId, paymentTerm: paymentTermId, ...rest } = data;
    const { startDate, endDate, total } = rest;
    let formValues = { ...rest };

    if (total < 0) {
      return toasts.error('Total Sale Amount should not be less than ZERO(0)!');
    }

    /**
     * ensure dueDate is not a past date
     */
    const dueDateIsFuture = confirmFutureDate(startDate, endDate);
    console.log({ dueDateIsFuture });
    if (!dueDateIsFuture) {
      //update form errors
      setFutureDateError();
      return toasts.error(futureDateErrorMsg);
    }

    const customer = customers.find(customer => customer.id === customerId);
    if (!customer) {
      return toasts.error('Selected an Invalid customer');
    }
    formValues.customer = formats.formatCustomerData(customer);

    const paymentTerm = paymentTerms.find(term => term.value === paymentTermId);
    if (!paymentTerm) {
      return toasts.error('Selected Payment Term is not a valid Payment Term');
    }
    formValues.paymentTerm = paymentTerm;

    // if (booking) {
    //   //booking is being updated-submit only the changed values
    //   formValues = getDirtyFields(dirtyFields, formValues);
    // }
    // console.log({ formValues });

    //submit the data
    handleFormSubmit(formValues);
  }

  // console.log({ customers, items, paymentTerms, loading });

  return loading ? (
    <SkeletonLoader />
  ) : customers?.length > 0 && paymentTerms?.length > 0 ? (
    <FormProvider {...formMethods}>
      <Box as="form" role="form" onSubmit={handleSubmit(onSubmit)} w="full">
        <Box w="full" rowGap={4}>
          {selectedItem ? (
            <>
              <Box
                w="full"
                mt={2}
                p={4}
                pb={4}
                bg="white"
                borderRadius="lg"
                shadow="lg"
                border="1px solid"
                borderColor="gray.200"
              >
                <DetailsFields
                  customers={customers}
                  paymentTerms={paymentTerms}
                  loading={updating}
                  bookingId={booking?.id || ''}
                  taxes={taxes}
                  item={selectedItem}
                  paymentModes={paymentModes}
                />
              </Box>

              <Flex w="full" py={6} justify="flex-end">
                <Button
                  size="lg"
                  type="submit"
                  isLoading={updating}
                  colorScheme="cyan"
                >
                  save
                </Button>
              </Flex>
            </>
          ) : (
            <>
              <Box
                w="full"
                mt={2}
                p={4}
                pb={4}
                bg="white"
                borderRadius="lg"
                shadow="lg"
                border="1px solid"
                borderColor="gray.200"
              >
                <BookingDaysSelector isEditing />
              </Box>

              <Box mt={4}>
                <Controller
                  name="item"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    function handleChange(item) {
                      console.log({ item });
                      onChange(item);
                      const itemRate = item?.rate || 0;

                      //update rate and reset transfer rate
                      setValue('bookingRate', itemRate, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }

                    return selectedDates?.length > 0 ? (
                      <ItemsLoader
                        startDate={startDate}
                        endDate={endDate}
                        onItemSelect={handleChange}
                        selectedItem={value}
                        selectedDates={selectedDates}
                      />
                    ) : null;
                  }}
                />
              </Box>
            </>
          )}
        </Box>
      </Box>
    </FormProvider>
  ) : // : items?.length === 0 ? (
  //   <Empty message="Please add atleast one ITEM to continue or reload the page" />
  // )
  customers?.length === 0 ? (
    <Empty message="Please add atleast one CUSTOMER to continue or reload the page" />
  ) : (
    <Empty message="Payment Terms not Found. Try Reloading the page" />
  );
}
BookingForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  booking: bookingFormProps,
};

export default BookingForm;
